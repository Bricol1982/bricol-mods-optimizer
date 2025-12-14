// @flow

import OptimizationPlan from "./OptimizationPlan";

/**
 * Class to represent a squad of 3 or 5 characters with their optimization targets
 * Used to manage and store squad compositions for different game modes
 */
export default class ModSquad {
  id;
  name;
  type;
  members;
  gameMode;
  category;
  createdDate;
  modifiedDate;

  /**
   * @param id {string} Unique identifier for the squad
   * @param name {string} User-defined name for the squad
   * @param type {string} Squad type: '3v3' or '5v5'
   * @param members {Array<{characterID: string, position: number, target: OptimizationPlan}>} Squad members
   * @param gameMode {string} Game mode (GAC, TW, ARENA, TB, etc.)
   * @param category {string} Category/group name for organization
   * @param createdDate {Date} When the squad was created
   * @param modifiedDate {Date} Last modification date
   */
  constructor(
    id,
    name,
    type = '5v5',
    members = [],
    gameMode = 'GAC',
    category = 'Uncategorized',
    createdDate = new Date(),
    modifiedDate = new Date()
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.members = members;
    this.gameMode = gameMode;
    this.category = category;
    this.createdDate = createdDate;
    this.modifiedDate = modifiedDate;
  }

  /**
   * Create a new ModSquad with a different name
   * @param name {string}
   * @returns {ModSquad}
   */
  withName(name) {
    return new ModSquad(
      this.id,
      name,
      this.type,
      this.members,
      this.gameMode,
      this.category,
      this.createdDate,
      new Date()
    );
  }

  /**
   * Create a new ModSquad with different members
   * @param members {Array}
   * @returns {ModSquad}
   */
  withMembers(members) {
    return new ModSquad(
      this.id,
      this.name,
      this.type,
      members,
      this.gameMode,
      this.category,
      this.createdDate,
      new Date()
    );
  }

  /**
   * Create a new ModSquad with a different type
   * @param type {string}
   * @returns {ModSquad}
   */
  withType(type) {
    return new ModSquad(
      this.id,
      this.name,
      type,
      this.members,
      this.gameMode,
      this.category,
      this.createdDate,
      new Date()
    );
  }

  /**
   * Create a new ModSquad with a different game mode
   * @param gameMode {string}
   * @returns {ModSquad}
   */
  withGameMode(gameMode) {
    return new ModSquad(
      this.id,
      this.name,
      this.type,
      this.members,
      gameMode,
      this.category,
      this.createdDate,
      new Date()
    );
  }

  /**
   * Create a new ModSquad with a different category
   * @param category {string}
   * @returns {ModSquad}
   */
  withCategory(category) {
    return new ModSquad(
      this.id,
      this.name,
      this.type,
      this.members,
      this.gameMode,
      category,
      this.createdDate,
      new Date()
    );
  }

  /**
   * Add a character to the squad
   * @param characterID {string}
   * @param target {OptimizationPlan}
   * @returns {ModSquad}
   */
  addMember(characterID, target) {
    const maxMembers = this.type === '3v3' ? 3 : 5;
    if (this.members.length >= maxMembers) {
      return this;
    }

    const newMembers = [
      ...this.members,
      {
        characterID,
        position: this.members.length,
        target
      }
    ];

    return this.withMembers(newMembers);
  }

  /**
   * Remove a character from the squad by position
   * @param position {number}
   * @returns {ModSquad}
   */
  removeMember(position) {
    const newMembers = this.members
      .filter(member => member.position !== position)
      .map((member, index) => ({ ...member, position: index }));

    return this.withMembers(newMembers);
  }

  /**
   * Update a member's optimization target
   * @param position {number}
   * @param target {OptimizationPlan}
   * @returns {ModSquad}
   */
  updateMemberTarget(position, target) {
    const newMembers = this.members.map(member =>
      member.position === position ? { ...member, target } : member
    );

    return this.withMembers(newMembers);
  }

  /**
   * Move a member from one position to another
   * @param fromPosition {number}
   * @param toPosition {number}
   * @returns {ModSquad}
   */
  moveMember(fromPosition, toPosition) {
    const member = this.members.find(m => m.position === fromPosition);
    if (!member) {
      return this;
    }

    const newMembers = this.members
      .filter(m => m.position !== fromPosition)
      .map(m => {
        if (m.position < fromPosition && m.position >= toPosition) {
          return { ...m, position: m.position + 1 };
        } else if (m.position > fromPosition && m.position <= toPosition) {
          return { ...m, position: m.position - 1 };
        }
        return m;
      });

    newMembers.push({ ...member, position: toPosition });
    newMembers.sort((a, b) => a.position - b.position);

    return this.withMembers(newMembers);
  }

  /**
   * Check if the squad is full
   * @returns {boolean}
   */
  isFull() {
    const maxMembers = this.type === '3v3' ? 3 : 5;
    return this.members.length >= maxMembers;
  }

  /**
   * Get maximum allowed members for this squad type
   * @returns {number}
   */
  getMaxMembers() {
    return this.type === '3v3' ? 3 : 5;
  }

  /**
   * Convert squad members to the format used by selectedCharacters
   * @returns {Array<{id: string, target: OptimizationPlan}>}
   */
  toSelectedCharacters() {
    return this.members.map(member => ({
      id: member.characterID,
      target: member.target
    }));
  }

  /**
   * Serialize the ModSquad for storage
   * @returns {Object}
   */
  serialize() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      members: this.members.map(member => ({
        characterID: member.characterID,
        position: member.position,
        target: member.target.serialize()
      })),
      gameMode: this.gameMode,
      category: this.category,
      createdDate: this.createdDate.toISOString(),
      modifiedDate: this.modifiedDate.toISOString()
    };
  }

  /**
   * Deserialize a ModSquad from JSON
   * @param squadJson {Object}
   * @returns {ModSquad}
   */
  static deserialize(squadJson) {
    if (!squadJson) {
      return null;
    }

    return new ModSquad(
      squadJson.id,
      squadJson.name,
      squadJson.type || '5v5',
      squadJson.members.map(member => ({
        characterID: member.characterID,
        position: member.position,
        target: OptimizationPlan.deserialize(member.target)
      })),
      squadJson.gameMode || 'GAC',
      squadJson.category || 'Uncategorized',
      new Date(squadJson.createdDate),
      new Date(squadJson.modifiedDate)
    );
  }

  /**
   * Generate a unique ID for a new squad
   * @returns {string}
   */
  static generateId() {
    return `squad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
