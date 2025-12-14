// @flow

import React, { PureComponent } from 'react';
import './ModSquadsView.css';
import { connect } from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar';
import SquadCard from '../../components/SquadCard/SquadCard';
import SquadMemberSlot from '../../components/SquadMemberSlot/SquadMemberSlot';
import CharacterAvatar from '../../components/CharacterAvatar/CharacterAvatar';
import { GameSettings } from '../../domain/CharacterDataClasses';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { showModal } from '../../state/actions/app';
import {
  createSquad,
  deleteSquad,
  updateSquadName,
  updateSquadType,
  updateSquadGameMode,
  addSquadMember,
  removeSquadMember,
  updateSquadMemberTarget,
  sendSquadToOptimizer,
  cloneSquad,
} from '../../state/actions/squads';
import { changeSection } from '../../state/actions/app';
import characterSettings from '../../constants/characterSettings';
import OptimizationPlan from '../../domain/OptimizationPlan';

class ModSquadsView extends PureComponent {
  state = {
    selectedSquadId: null,
    characterFilter: '',
  };

  render() {
    const { squads } = this.props;
    const selectedSquad = squads.find(s => s.id === this.state.selectedSquadId);

    return (
      <div className="mod-squads-view">
        <Sidebar content={[this.squadListSidebar()]} />

        <div className="squads-main-content">
          {!selectedSquad && this.renderWelcome()}
          {selectedSquad && this.renderSquadEditor(selectedSquad)}
        </div>

        <div className="available-characters-panel">
          {selectedSquad && this.renderAvailableCharacters(selectedSquad)}
        </div>
      </div>
    );
  }

  renderWelcome() {
    return (
      <div className="welcome-message">
        <h2>My Mods Sets</h2>
        <p>Create and manage your squad compositions for 3v3 and 5v5 battles.</p>
        <p>Select a squad from the left sidebar or create a new one to get started.</p>
        <button className="btn-primary" onClick={this.handleCreateSquad}>
          Create New Squad
        </button>
      </div>
    );
  }

  renderSquadEditor(squad) {
    const maxMembers = squad.getMaxMembers();
    const slots = [];

    for (let i = 0; i < maxMembers; i++) {
      const member = squad.members.find(m => m.position === i);
      const character = member ? this.props.characters[member.characterID] : null;

      slots.push(
        <SquadMemberSlot
          key={i}
          position={i}
          character={character}
          target={member ? member.target : null}
          availableTargets={this.getAvailableTargets(member ? member.characterID : null)}
          isEmpty={!member}
          onDrop={this.handleDropCharacter}
          onRemove={this.handleRemoveMember}
          onTargetChange={this.handleTargetChange}
        />
      );
    }

    return (
      <div className="squad-editor">
        <div className="squad-editor-header">
          <input
            type="text"
            className="squad-name-input"
            value={squad.name}
            onChange={(e) => this.props.updateSquadName(squad.id, e.target.value)}
            placeholder="Squad name"
          />
          <div className="squad-controls">
            <label>Type:</label>
            <Dropdown
              value={squad.type}
              onChange={(e) => this.props.updateSquadType(squad.id, e.target.value)}
            >
              <option value="3v3">3v3</option>
              <option value="5v5">5v5</option>
            </Dropdown>

            <label>Mode:</label>
            <Dropdown
              value={squad.gameMode}
              onChange={(e) => this.props.updateSquadGameMode(squad.id, e.target.value)}
            >
              <option value="GAC">GAC</option>
              <option value="TW">TW</option>
              <option value="TB">TB</option>
              <option value="ARENA">ARENA</option>
              <option value="RAID">RAID</option>
              <option value="CONQUEST">CONQUEST</option>
            </Dropdown>

            <button
              className="btn-send-optimizer"
              onClick={() => this.handleSendToOptimizer(squad.id)}
              disabled={squad.members.length === 0}
            >
              Send to Optimizer ▶
            </button>
          </div>
        </div>

        <div className="squad-members-grid">
          {slots}
        </div>
      </div>
    );
  }

  renderAvailableCharacters(squad) {
    const { characters, gameSettings } = this.props;
    const filter = this.state.characterFilter.toLowerCase();

    const availableCharacters = Object.values(characters)
      .filter(char => {
        const alreadyInSquad = squad.members.some(m => m.characterID === char.baseID);
        if (alreadyInSquad) return false;

        if (filter) {
          const gameSetting = gameSettings[char.baseID] || new GameSettings(char.baseID, char.baseID);
          return gameSetting.name.toLowerCase().includes(filter);
        }
        return true;
      })
      .sort((a, b) => {
        const nameA = (gameSettings[a.baseID]?.name || a.baseID).toLowerCase();
        const nameB = (gameSettings[b.baseID]?.name || b.baseID).toLowerCase();
        return nameA.localeCompare(nameB);
      });

    return (
      <div className="available-characters">
        <h3>Available Characters</h3>
        <input
          type="text"
          className="character-search"
          placeholder="Search characters..."
          value={this.state.characterFilter}
          onChange={(e) => this.setState({ characterFilter: e.target.value })}
        />
        <div className="characters-list">
          {availableCharacters.map(character => (
            <div
              key={character.baseID}
              className="character-tile"
              draggable={!squad.isFull()}
              onDragStart={(e) => this.handleDragStart(e, character)}
            >
              <CharacterAvatar character={character} />
              <div className="character-tile-name">
                {gameSettings[character.baseID]?.name || character.baseID}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  squadListSidebar() {
    const { squads } = this.props;

    return (
      <div className="squad-list-sidebar" key="squad-list">
        <h3>My Squads</h3>
        <button className="btn-create-squad" onClick={this.handleCreateSquad}>
          + Create New Squad
        </button>

        <div className="squads-list">
          {squads.length === 0 && (
            <div className="empty-message">No squads created yet</div>
          )}
          {squads.map(squad => (
            <SquadCard
              key={squad.id}
              squad={squad}
              isSelected={squad.id === this.state.selectedSquadId}
              onClick={() => this.setState({ selectedSquadId: squad.id })}
              onDelete={this.props.deleteSquad}
              onClone={this.props.cloneSquad}
              onSendToOptimizer={this.handleSendToOptimizer}
            />
          ))}
        </div>
      </div>
    );
  }

  handleCreateSquad = () => {
    const name = prompt('Enter squad name:', `Squad ${this.props.squads.length + 1}`);
    if (name) {
      this.props.createSquad(name, '5v5', 'GAC');
      // Select the newly created squad
      setTimeout(() => {
        const newSquad = this.props.squads[this.props.squads.length - 1];
        if (newSquad) {
          this.setState({ selectedSquadId: newSquad.id });
        }
      }, 100);
    }
  };

  handleDragStart = (e, character) => {
    const defaultTarget = this.getDefaultTarget(character.baseID);
    const data = {
      characterID: character.baseID,
      target: defaultTarget.serialize(),
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'copy';
  };

  handleDropCharacter = (position, characterID, target) => {
    const squad = this.props.squads.find(s => s.id === this.state.selectedSquadId);
    if (!squad || squad.isFull()) return;

    this.props.addSquadMember(squad.id, characterID, target);
  };

  handleRemoveMember = (position) => {
    const squad = this.props.squads.find(s => s.id === this.state.selectedSquadId);
    if (!squad) return;

    this.props.removeSquadMember(squad.id, position);
  };

  handleTargetChange = (position, target) => {
    const squad = this.props.squads.find(s => s.id === this.state.selectedSquadId);
    if (!squad) return;

    this.props.updateSquadMemberTarget(squad.id, position, target);
  };

  handleSendToOptimizer = (squadId) => {
    this.props.sendSquadToOptimizer(squadId);
    this.props.changeSection('optimize');
  };

  getDefaultTarget(characterID) {
    const character = this.props.characters[characterID];
    if (!character) {
      return new OptimizationPlan('unnamed');
    }

    const charSettings = characterSettings[characterID];
    if (charSettings && charSettings.targets && charSettings.targets.length > 0) {
      return charSettings.targets[0];
    }

    return character.optimizerSettings.target || new OptimizationPlan('unnamed');
  }

  getAvailableTargets(characterID) {
    if (!characterID) return [];

    const charSettings = characterSettings[characterID];
    if (charSettings && charSettings.targets) {
      return charSettings.targets;
    }

    const character = this.props.characters[characterID];
    if (character && character.optimizerSettings.target) {
      return [character.optimizerSettings.target];
    }

    return [new OptimizationPlan('unnamed')];
  }
}

const mapStateToProps = (state) => ({
  squads: state.profile.squads || [],
  characters: state.profile.characters,
  gameSettings: state.gameSettings,
});

const mapDispatchToProps = {
  createSquad,
  deleteSquad,
  updateSquadName,
  updateSquadType,
  updateSquadGameMode,
  addSquadMember,
  removeSquadMember,
  updateSquadMemberTarget,
  sendSquadToOptimizer,
  cloneSquad,
  changeSection,
  showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModSquadsView);
