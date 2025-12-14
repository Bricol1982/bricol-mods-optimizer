// @flow

import React from 'react';
import './SquadCard.css';

class SquadCard extends React.PureComponent {
  render() {
    const { squad, isSelected, onClick, onDelete, onClone, onSendToOptimizer } = this.props;

    const memberCount = squad.members.length;
    const maxMembers = squad.getMaxMembers();
    const isComplete = memberCount === maxMembers;

    return (
      <div
        className={`squad-card ${isSelected ? 'selected' : ''} ${isComplete ? 'complete' : ''}`}
        onClick={onClick}
      >
        <div className="squad-card-header">
          <div className="squad-name">{squad.name}</div>
          <div className="squad-badges">
            <span className={`badge type-badge ${squad.type}`}>{squad.type}</span>
            <span className="badge mode-badge">{squad.gameMode}</span>
          </div>
        </div>

        <div className="squad-card-body">
          <div className="member-count">
            {memberCount} / {maxMembers} characters
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(memberCount / maxMembers) * 100}%` }}
            />
          </div>
        </div>

        <div className="squad-card-footer">
          <button
            className="btn-icon"
            onClick={(e) => {
              e.stopPropagation();
              onSendToOptimizer(squad.id);
            }}
            disabled={memberCount === 0}
            title="Send to optimizer"
          >
            <span>▶</span>
          </button>
          <button
            className="btn-icon"
            onClick={(e) => {
              e.stopPropagation();
              onClone(squad.id);
            }}
            title="Clone squad"
          >
            <span>⧉</span>
          </button>
          <button
            className="btn-icon delete"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete squad "${squad.name}"?`)) {
                onDelete(squad.id);
              }
            }}
            title="Delete squad"
          >
            <span>🗑</span>
          </button>
        </div>
      </div>
    );
  }
}

export default SquadCard;
