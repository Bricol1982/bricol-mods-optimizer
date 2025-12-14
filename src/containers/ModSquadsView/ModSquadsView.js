// @flow

import React, { PureComponent } from 'react';
import './ModSquadsView.css';
import { connect } from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar';
import SquadCard from '../../components/SquadCard/SquadCard';
import SquadMemberSlot from '../../components/SquadMemberSlot/SquadMemberSlot';
import CharacterAvatar from '../../components/CharacterAvatar/CharacterAvatar';
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
  updateSquadCategory,
  addCategory,
  renameCategory,
  deleteCategory,
} from '../../state/actions/squads';
import { changeSection, updateProfile } from '../../state/actions/app';
import characterSettings from '../../constants/characterSettings';
import OptimizationPlan from '../../domain/OptimizationPlan';

class ModSquadsView extends PureComponent {
  state = {
    selectedSquadId: null,
    characterFilter: '',
    selectedCategory: 'Uncategorized',
  };

  render() {
    const { squads } = this.props;
    const selectedSquad = squads.find(s => s.id === this.state.selectedSquadId);
    const filteredSquads = squads.filter(squad => squad.category === this.state.selectedCategory);

    return (
      <div className="mod-squads-view">
        <Sidebar content={[this.categoryTabsSidebar()]} />

        <div className="squads-main-content">
          {this.renderSquadsList(filteredSquads)}
        </div>

        <div className="composition-panel">
          {selectedSquad && this.renderComposition(selectedSquad)}
        </div>

        <div className="available-characters-panel">
          {selectedSquad && this.renderAvailableCharacters(selectedSquad)}
        </div>
      </div>
    );
  }

  renderSquadsList(filteredSquads) {
    return (
      <div className="squads-list-content">
        <h3>Squads List</h3>

        <button className="btn-create-squad" onClick={this.handleCreateSquad}>
          + Create New Squad
        </button>

        {filteredSquads.length === 0 && (
          <div className="empty-message">
            No squads in this category. Create your first squad to get started!
          </div>
        )}

        <div className="squads-grid">
          {filteredSquads.map(squad => (
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

  renderComposition(squad) {
    return (
      <div className="composition-content">
        <h3>Squad Composition</h3>
        {this.renderSquadEditor(squad)}
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

            <label>Category:</label>
            <Dropdown
              value={squad.category}
              onChange={(e) => this.props.updateSquadCategory(squad.id, e.target.value)}
            >
              {this.props.squadCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
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
          // Get character name from gameSettings or use baseID as fallback
          const characterName = gameSettings[char.baseID]?.name || char.baseID;

          // Check character name
          if (characterName.toLowerCase().includes(filter)) {
            return true;
          }

          // Check baseID
          if (char.baseID.toLowerCase().includes(filter)) {
            return true;
          }

          // Check tags (factions) and extra tags (abbreviations)
          const tags = gameSettings[char.baseID]?.tags || [];
          const extraTags = characterSettings[char.baseID]?.extraTags || [];
          const allTags = tags.concat(extraTags);

          if (allTags.some(tag => tag.toLowerCase().includes(filter))) {
            return true;
          }

          return false;
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

  categoryTabsSidebar() {
    const { squads, squadCategories } = this.props;
    const { selectedCategory } = this.state;

    return (
      <div className="category-sidebar" key="category-sidebar">
        <h3>Squads Categories</h3>

        {/* Category tabs */}
        <div className="category-tabs">
          {squadCategories.map(category => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => this.setState({ selectedCategory: category, selectedSquadId: null })}
            >
              {category}
              <span className="category-count">
                ({squads.filter(s => s.category === category).length})
              </span>
            </button>
          ))}
        </div>

        {/* Category management buttons */}
        <div className="category-actions">
          <button className="btn-small" onClick={this.handleAddCategory}>
            + Add Category
          </button>
          {selectedCategory !== 'Uncategorized' && (
            <>
              <button className="btn-small" onClick={this.handleRenameCategory}>
                Rename
              </button>
              <button className="btn-small delete" onClick={this.handleDeleteCategory}>
                Delete
              </button>
            </>
          )}
        </div>

        {/* Export/Import buttons */}
        <div className="export-import-actions">
          <button className="btn-export" onClick={this.handleExportSquads}>
            Export Squads
          </button>
          <button className="btn-import" onClick={this.handleImportSquads}>
            Import Squads
          </button>
          <input
            type="file"
            ref={ref => this.fileInput = ref}
            style={{ display: 'none' }}
            accept=".json"
            onChange={this.handleFileSelect}
          />
        </div>
      </div>
    );
  }

  handleCreateSquad = () => {
    const name = prompt('Enter squad name:', `Squad ${this.props.squads.length + 1}`);
    if (name) {
      this.props.createSquad(name, '5v5', 'GAC', this.state.selectedCategory);
      // Select the newly created squad
      setTimeout(() => {
        const newSquad = this.props.squads[this.props.squads.length - 1];
        if (newSquad) {
          this.setState({ selectedSquadId: newSquad.id });
        }
      }, 100);
    }
  };

  handleAddCategory = () => {
    const categoryName = prompt('Enter category name:');
    if (categoryName && categoryName.trim()) {
      this.props.addCategory(categoryName.trim());
      this.setState({ selectedCategory: categoryName.trim() });
    }
  };

  handleRenameCategory = () => {
    const newName = prompt('Enter new category name:', this.state.selectedCategory);
    if (newName && newName.trim() && newName.trim() !== this.state.selectedCategory) {
      this.props.renameCategory(this.state.selectedCategory, newName.trim());
      this.setState({ selectedCategory: newName.trim() });
    }
  };

  handleDeleteCategory = () => {
    if (window.confirm(`Delete category "${this.state.selectedCategory}"? All squads will be moved to Uncategorized.`)) {
      this.props.deleteCategory(this.state.selectedCategory);
      this.setState({ selectedCategory: 'Uncategorized' });
    }
  };

  handleExportSquads = () => {
    const { squads, squadCategories } = this.props;

    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      squadCategories: squadCategories,
      squads: squads.map(squad => ({
        id: squad.id,
        name: squad.name,
        type: squad.type,
        gameMode: squad.gameMode,
        category: squad.category,
        members: squad.members,
        createdDate: squad.createdDate,
        modifiedDate: squad.modifiedDate
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `squads-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  handleImportSquads = () => {
    if (this.fileInput) {
      this.fileInput.click();
    }
  };

  handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);

        if (!importData.version || !importData.squads || !importData.squadCategories) {
          alert('Invalid backup file format');
          return;
        }

        const confirmMessage = `This will import ${importData.squads.length} squads and ${importData.squadCategories.length} categories. Do you want to:\n\n` +
          `- Click OK to MERGE with existing squads\n` +
          `- Click Cancel to abort`;

        if (window.confirm(confirmMessage)) {
          this.importSquadsData(importData);
        }
      } catch (error) {
        alert('Error reading backup file: ' + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  importSquadsData = (importData) => {
    const { squads, squadCategories } = this.props;

    // Merge categories (avoid duplicates)
    const mergedCategories = [...new Set([...squadCategories, ...importData.squadCategories])];

    // Import squads with new IDs to avoid conflicts
    const importedSquads = importData.squads.map(squadData => {
      const ModSquad = require('../../domain/ModSquad').default;

      // Deserialize members with their targets
      const deserializedMembers = squadData.members.map(member => ({
        ...member,
        target: member.target ? OptimizationPlan.deserialize(member.target) : null
      }));

      return new ModSquad(
        ModSquad.generateId(), // Generate new ID
        squadData.name,
        squadData.type,
        deserializedMembers,
        squadData.gameMode,
        squadData.category,
        new Date(squadData.createdDate),
        new Date()
      );
    });

    // Update profile with merged data
    this.props.updateProfile(profile => {
      return profile
        .withSquadCategories(mergedCategories)
        .withSquads([...squads, ...importedSquads]);
    });

    alert(`Successfully imported ${importedSquads.length} squads and ${importData.squadCategories.length} categories!`);
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
  squadCategories: state.profile.squadCategories || ['Uncategorized'],
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
  updateSquadCategory,
  addCategory,
  renameCategory,
  deleteCategory,
  changeSection,
  showModal,
  updateProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModSquadsView);
