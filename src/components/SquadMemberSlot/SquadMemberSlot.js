// @flow

import React from 'react';
import './SquadMemberSlot.css';
import CharacterAvatar from '../CharacterAvatar/CharacterAvatar';
import { Dropdown } from '../Dropdown/Dropdown';
import OptimizationPlan from '../../domain/OptimizationPlan';

class SquadMemberSlot extends React.PureComponent {
  static defaultProps = {
    onDrop: null,
    onRemove: null,
    onTargetChange: null,
  };

  render() {
    const {
      character,
      position,
      target,
      availableTargets,
      onRemove,
      onTargetChange,
      isEmpty
    } = this.props;

    if (isEmpty || !character) {
      return (
        <div
          className="squad-member-slot empty"
          onDragOver={this.handleDragOver}
          onDrop={(e) => this.handleDrop(e, position)}
        >
          <div className="empty-slot-icon">+</div>
          <div className="empty-slot-text">Drop character here</div>
        </div>
      );
    }

    const targetOptions = availableTargets.map(t => ({
      value: t.name,
      label: t.name
    }));

    return (
      <div className="squad-member-slot filled">
        <div className="remove-button" onClick={() => onRemove(position)}>
          ×
        </div>
        <CharacterAvatar character={character} />
        <div className="character-name">{character.gameSettings?.name || character.baseID}</div>
        <div className="target-selector">
          <label>Target:</label>
          <Dropdown
            name={`target-${position}`}
            value={target ? target.name : ''}
            onChange={(e) => {
              const selectedTarget = availableTargets.find(t => t.name === e.target.value);
              if (selectedTarget && onTargetChange) {
                onTargetChange(position, selectedTarget);
              }
            }}
          >
            <option value="">Select target...</option>
            {targetOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Dropdown>
        </div>
      </div>
    );
  }

  handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  handleDrop = (e, position) => {
    e.preventDefault();
    if (this.props.onDrop) {
      const data = e.dataTransfer.getData('text/plain');
      try {
        const { characterID, target } = JSON.parse(data);
        const deserializedTarget = OptimizationPlan.deserialize(target);
        this.props.onDrop(position, characterID, deserializedTarget);
      } catch (error) {
        console.error('Invalid drop data', error);
      }
    }
  };
}

export default SquadMemberSlot;
