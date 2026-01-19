// @flow

import React, { PureComponent } from 'react';
import './SortMyModsView.css';
import { connect } from 'react-redux';
import { scoreMods, getModStatistics } from '../../utils/modScoringService';
import ModImage from '../../components/ModImage/ModImage';
import ModDetail from '../../components/ModDetail/ModDetail';

/**
 * SortMyModsView Component
 *
 * Displays all mods with quality scores and categories
 * Allows sorting, filtering, and marking mods for deletion
 */
class SortMyModsView extends PureComponent {
  state = {
    // Sorting
    sortBy: 'score',         // score, category, slot, set, speed
    sortDirection: 'desc',    // asc or desc

    // Filtering
    categoryFilter: 'all',    // all, epic, veryGood, standard, trash
    speedFilter: 'all',       // all, withSpeed, withoutSpeed
    slotFilter: 'all',        // all, square, arrow, diamond, triangle, circle, cross
    setFilter: 'all',         // all, speed, offense, etc.
    equippedFilter: 'all',    // all, equipped, notEquipped

    // Deletion marking
    markedForDeletion: {},    // Map of mod IDs marked for deletion
    showOnlyMarked: false,    // Toggle to show only marked mods

    // Selected mod for detail view
    selectedMod: null,        // Currently selected mod to display
  };

  /**
   * Toggle mark for deletion on a mod
   */
  toggleMarkForDeletion = (modId) => {
    this.setState(prevState => ({
      markedForDeletion: {
        ...prevState.markedForDeletion,
        [modId]: !prevState.markedForDeletion[modId],
      },
    }));
  };

  /**
   * Reset all deletion marks
   */
  resetDeletionMarks = () => {
    this.setState({ markedForDeletion: {}, showOnlyMarked: false });
  };

  /**
   * Toggle showing only marked mods
   */
  toggleShowOnlyMarked = () => {
    this.setState(prevState => ({ showOnlyMarked: !prevState.showOnlyMarked }));
  };

  /**
   * Select a mod to display in detail view
   */
  selectMod = (mod) => {
    this.setState({ selectedMod: mod });
  };

  /**
   * Change sort field
   */
  changeSortBy = (field) => {
    this.setState(prevState => ({
      sortBy: field,
      // Toggle direction if clicking the same field
      sortDirection: prevState.sortBy === field && prevState.sortDirection === 'desc' ? 'asc' : 'desc',
    }));
  };

  /**
   * Get all mods from profile
   */
  getAllMods() {
    const { profile } = this.props;
    if (!profile || !profile.mods) return [];

    // Return all mods from the profile
    return profile.mods;
  }

  /**
   * Score and filter mods
   */
  getProcessedMods() {
    const allMods = this.getAllMods();

    // Score all mods
    const scoredMods = scoreMods(allMods);

    // Apply filters
    let filtered = scoredMods;

    // Category filter
    if (this.state.categoryFilter !== 'all') {
      const categoryMap = {
        epic: 'Épique',
        veryGood: 'Très bon',
        standard: 'Standard',
        trash: 'À jeter',
      };
      const targetCategory = categoryMap[this.state.categoryFilter];
      filtered = filtered.filter(mod => mod.category === targetCategory);
    }

    // Speed filter
    if (this.state.speedFilter === 'withSpeed') {
      filtered = filtered.filter(mod =>
        mod.secondaryStats && mod.secondaryStats.some(stat => stat.displayType === 'Speed')
      );
    } else if (this.state.speedFilter === 'withoutSpeed') {
      filtered = filtered.filter(mod =>
        !mod.secondaryStats || !mod.secondaryStats.some(stat => stat.displayType === 'Speed')
      );
    }

    // Slot filter
    if (this.state.slotFilter !== 'all') {
      filtered = filtered.filter(mod => mod.slot === this.state.slotFilter);
    }

    // Set filter
    if (this.state.setFilter !== 'all') {
      filtered = filtered.filter(mod => mod.set.name.toLowerCase() === this.state.setFilter);
    }

    // Equipped filter
    if (this.state.equippedFilter === 'equipped') {
      const characters = this.props.profile?.characters || {};
      filtered = filtered.filter(mod => {
        // A mod is equipped if it has a characterID that corresponds to an actual character
        const isEquipped = mod.characterID &&
                          mod.characterID !== 'null' &&
                          mod.characterID !== '' &&
                          characters[mod.characterID];
        return isEquipped;
      });
    } else if (this.state.equippedFilter === 'notEquipped') {
      const characters = this.props.profile?.characters || {};
      filtered = filtered.filter(mod => {
        // A mod is not equipped if:
        // - it has no characterID, OR
        // - characterID is 'null' or empty string, OR
        // - characterID doesn't correspond to an actual character in the profile
        const isNotEquipped = !mod.characterID ||
                             mod.characterID === 'null' ||
                             mod.characterID === '' ||
                             !characters[mod.characterID];
        return isNotEquipped;
      });
    }

    // Show only marked filter
    if (this.state.showOnlyMarked) {
      filtered = filtered.filter(mod => this.state.markedForDeletion[mod.id]);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (this.state.sortBy) {
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'category':
          // Sort by category order (Epic > Very Good > Standard > Trash)
          const categoryOrder = { 'Épique': 4, 'Très bon': 3, 'Standard': 2, 'À jeter': 1 };
          comparison = (categoryOrder[a.category] || 0) - (categoryOrder[b.category] || 0);
          break;
        case 'slot':
          comparison = a.slot.localeCompare(b.slot);
          break;
        case 'set':
          comparison = a.set.name.localeCompare(b.set.name);
          break;
        case 'speed':
          const aHasSpeed = a.secondaryStats && a.secondaryStats.some(s => s.displayType === 'Speed') ? 1 : 0;
          const bHasSpeed = b.secondaryStats && b.secondaryStats.some(s => s.displayType === 'Speed') ? 1 : 0;
          comparison = aHasSpeed - bHasSpeed;
          break;
        case 'equipped':
          const characters = this.props.profile?.characters || {};
          const aEquipped = (a.characterID && a.characterID !== 'null' && a.characterID !== '' && characters[a.characterID]) ? 1 : 0;
          const bEquipped = (b.characterID && b.characterID !== 'null' && b.characterID !== '' && characters[b.characterID]) ? 1 : 0;
          comparison = aEquipped - bEquipped;
          break;
        default:
          comparison = 0;
      }

      return this.state.sortDirection === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }

  /**
   * Render statistics summary
   */
  renderStatistics() {
    const allMods = this.getAllMods();
    const scoredMods = scoreMods(allMods);
    const stats = getModStatistics(scoredMods);
    const markedCount = Object.values(this.state.markedForDeletion).filter(Boolean).length;

    return (
      <div className="mod-stats-summary">
        <h3>Statistiques</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total mods:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item epic">
            <span className="stat-label">Épique:</span>
            <span className="stat-value">{stats.epic}</span>
          </div>
          <div className="stat-item very-good">
            <span className="stat-label">Très bon:</span>
            <span className="stat-value">{stats.veryGood}</span>
          </div>
          <div className="stat-item standard">
            <span className="stat-label">Standard:</span>
            <span className="stat-value">{stats.standard}</span>
          </div>
          <div className="stat-item trash">
            <span className="stat-label">À jeter:</span>
            <span className="stat-value">{stats.trash}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Score moyen:</span>
            <span className="stat-value">{stats.averageScore}</span>
          </div>
          <div className="stat-item marked">
            <span className="stat-label">Marqués suppression:</span>
            <span className="stat-value">{markedCount}</span>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render filters bar
   */
  renderFilters() {
    return (
      <div className="mod-filters">
        <div className="filter-group">
          <label>Catégorie:</label>
          <select
            value={this.state.categoryFilter}
            onChange={e => this.setState({ categoryFilter: e.target.value })}
          >
            <option value="all">Toutes</option>
            <option value="epic">Épique</option>
            <option value="veryGood">Très bon</option>
            <option value="standard">Standard</option>
            <option value="trash">À jeter</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Speed:</label>
          <select
            value={this.state.speedFilter}
            onChange={e => this.setState({ speedFilter: e.target.value })}
          >
            <option value="all">Tous</option>
            <option value="withSpeed">Avec Speed</option>
            <option value="withoutSpeed">Sans Speed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Slot:</label>
          <select
            value={this.state.slotFilter}
            onChange={e => this.setState({ slotFilter: e.target.value })}
          >
            <option value="all">Tous</option>
            <option value="square">Square</option>
            <option value="arrow">Arrow</option>
            <option value="diamond">Diamond</option>
            <option value="triangle">Triangle</option>
            <option value="circle">Circle</option>
            <option value="cross">Cross</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Set:</label>
          <select
            value={this.state.setFilter}
            onChange={e => this.setState({ setFilter: e.target.value })}
          >
            <option value="all">Tous</option>
            <option value="speed">Speed</option>
            <option value="offense">Offense</option>
            <option value="critdamage">Crit Damage</option>
            <option value="critchance">Crit Chance</option>
            <option value="health">Health</option>
            <option value="defense">Defense</option>
            <option value="potency">Potency</option>
            <option value="tenacity">Tenacity</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Équipement:</label>
          <select
            value={this.state.equippedFilter}
            onChange={e => this.setState({ equippedFilter: e.target.value })}
          >
            <option value="all">Tous</option>
            <option value="equipped">Équipé</option>
            <option value="notEquipped">Non équipé</option>
          </select>
        </div>

        <div className="filter-actions">
          <button
            className={this.state.showOnlyMarked ? 'active' : ''}
            onClick={this.toggleShowOnlyMarked}
          >
            {this.state.showOnlyMarked ? 'Afficher tous' : 'Marqués uniquement'}
          </button>
          <button
            onClick={this.resetDeletionMarks}
            disabled={Object.values(this.state.markedForDeletion).filter(Boolean).length === 0}
          >
            Réinitialiser sélections
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render table header
   */
  renderTableHeader() {
    const sortIndicator = (field) => {
      if (this.state.sortBy !== field) return '';
      return this.state.sortDirection === 'desc' ? ' ▼' : ' ▲';
    };

    return (
      <thead>
        <tr>
          <th>Marquer</th>
          <th onClick={() => this.changeSortBy('slot')} className="sortable">
            Slot{sortIndicator('slot')}
          </th>
          <th onClick={() => this.changeSortBy('set')} className="sortable">
            Set{sortIndicator('set')}
          </th>
          <th>Main Stat</th>
          <th onClick={() => this.changeSortBy('speed')} className="sortable">
            Speed{sortIndicator('speed')}
          </th>
          <th onClick={() => this.changeSortBy('equipped')} className="sortable">
            Équipé{sortIndicator('equipped')}
          </th>
          <th>Level</th>
          <th>Pips</th>
          <th onClick={() => this.changeSortBy('score')} className="sortable">
            Score{sortIndicator('score')}
          </th>
          <th onClick={() => this.changeSortBy('category')} className="sortable">
            Catégorie{sortIndicator('category')}
          </th>
        </tr>
      </thead>
    );
  }

  /**
   * Render mod row
   */
  renderModRow(mod) {
    const isMarked = this.state.markedForDeletion[mod.id];
    const hasSpeed = mod.secondaryStats && mod.secondaryStats.some(s => s.displayType === 'Speed');
    const isSelected = this.state.selectedMod && this.state.selectedMod.id === mod.id;
    const characters = this.props.profile?.characters || {};
    const isEquipped = mod.characterID && mod.characterID !== 'null' && mod.characterID !== '' && characters[mod.characterID];

    return (
      <tr
        key={mod.id}
        className={`${isMarked ? 'marked-for-deletion' : ''} ${isSelected ? 'selected-mod' : ''}`}
        onClick={() => this.selectMod(mod)}
      >
        <td className="checkbox-cell">
          <input
            type="checkbox"
            checked={isMarked || false}
            onChange={(e) => {
              e.stopPropagation();
              this.toggleMarkForDeletion(mod.id);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </td>
        <td className="slot-cell">
          <div className="mod-icon-wrapper">
            <ModImage mod={mod} className="mod-table-icon" />
          </div>
        </td>
        <td className="set-cell">{mod.set.name}</td>
        <td className="main-stat-cell">
          {mod.primaryStat.displayType}: {mod.primaryStat.value}
        </td>
        <td className="speed-cell">
          {hasSpeed ? '✓' : '-'}
        </td>
        <td className="equipped-cell">
          {isEquipped ? '✓' : '✗'}
        </td>
        <td className="level-cell">+{mod.level}</td>
        <td className="pips-cell">{mod.pips}</td>
        <td className="score-cell">{mod.score}</td>
        <td className="category-cell">
          <span
            className="category-badge"
            style={{ backgroundColor: mod.categoryColor }}
          >
            {mod.category}
          </span>
        </td>
      </tr>
    );
  }

  /**
   * Render main content
   */
  render() {
    const processedMods = this.getProcessedMods();

    if (!this.props.profile) {
      return (
        <div className="sort-my-mods-view">
          <h2>Sort My Mods</h2>
          <p>Chargez vos mods pour commencer.</p>
        </div>
      );
    }

    return (
      <div className="sort-my-mods-view">
        <h2>Sort My Mods</h2>

        {this.renderStatistics()}
        {this.renderFilters()}

        <div className="mods-content-wrapper">
          <div className="mods-table-container">
            <table className="mods-table">
              {this.renderTableHeader()}
              <tbody>
                {processedMods.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="no-mods">
                      Aucun mod ne correspond aux filtres sélectionnés.
                    </td>
                  </tr>
                ) : (
                  processedMods.map(mod => this.renderModRow(mod))
                )}
              </tbody>
            </table>

            {processedMods.length > 0 && (
              <div className="table-footer">
                Affichage de {processedMods.length} mod(s)
              </div>
            )}
          </div>

          {this.state.selectedMod && (
            <div className="mod-detail-panel">
              <div className="mod-detail-header">
                <h3>Détails du Mod</h3>
                <button
                  className="close-detail-btn"
                  onClick={() => this.setState({ selectedMod: null })}
                >
                  ✕
                </button>
              </div>
              <div className="mod-detail-content">
                <ModDetail mod={this.state.selectedMod} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps)(SortMyModsView);
