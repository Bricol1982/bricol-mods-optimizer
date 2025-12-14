// @flow

import { updateProfile } from "./app";
import ModSquad from "../../domain/ModSquad";

/**
 * Create a new squad
 * @param name {string} Name of the squad
 * @param type {string} '3v3' or '5v5'
 * @param gameMode {string} Game mode (GAC, TW, etc.)
 * @returns {Function}
 */
export function createSquad(name, type = '5v5', gameMode = 'GAC') {
  return updateProfile(profile => {
    const newSquad = new ModSquad(
      ModSquad.generateId(),
      name,
      type,
      [],
      gameMode
    );

    return profile.withSquads([...profile.squads, newSquad]);
  });
}

/**
 * Delete a squad by ID
 * @param squadId {string} ID of the squad to delete
 * @returns {Function}
 */
export function deleteSquad(squadId) {
  return updateProfile(profile => {
    const newSquads = profile.squads.filter(squad => squad.id !== squadId);
    return profile.withSquads(newSquads);
  });
}

/**
 * Update a squad's name
 * @param squadId {string} ID of the squad
 * @param name {string} New name
 * @returns {Function}
 */
export function updateSquadName(squadId, name) {
  return updateProfile(profile => {
    const newSquads = profile.squads.map(squad =>
      squad.id === squadId ? squad.withName(name) : squad
    );
    return profile.withSquads(newSquads);
  });
}

/**
 * Update a squad's type (3v3 or 5v5)
 * @param squadId {string} ID of the squad
 * @param type {string} '3v3' or '5v5'
 * @returns {Function}
 */
export function updateSquadType(squadId, type) {
  return updateProfile(profile => {
    const newSquads = profile.squads.map(squad =>
      squad.id === squadId ? squad.withType(type) : squad
    );
    return profile.withSquads(newSquads);
  });
}

/**
 * Update a squad's game mode
 * @param squadId {string} ID of the squad
 * @param gameMode {string} Game mode
 * @returns {Function}
 */
export function updateSquadGameMode(squadId, gameMode) {
  return updateProfile(profile => {
    const newSquads = profile.squads.map(squad =>
      squad.id === squadId ? squad.withGameMode(gameMode) : squad
    );
    return profile.withSquads(newSquads);
  });
}

/**
 * Add a member to a squad
 * @param squadId {string} ID of the squad
 * @param characterID {string} Character ID to add
 * @param target {OptimizationPlan} Optimization target
 * @returns {Function}
 */
export function addSquadMember(squadId, characterID, target) {
  return updateProfile(profile => {
    const newSquads = profile.squads.map(squad =>
      squad.id === squadId ? squad.addMember(characterID, target) : squad
    );
    return profile.withSquads(newSquads);
  });
}

/**
 * Remove a member from a squad
 * @param squadId {string} ID of the squad
 * @param position {number} Position of the member to remove
 * @returns {Function}
 */
export function removeSquadMember(squadId, position) {
  return updateProfile(profile => {
    const newSquads = profile.squads.map(squad =>
      squad.id === squadId ? squad.removeMember(position) : squad
    );
    return profile.withSquads(newSquads);
  });
}

/**
 * Update a squad member's optimization target
 * @param squadId {string} ID of the squad
 * @param position {number} Position of the member
 * @param target {OptimizationPlan} New optimization target
 * @returns {Function}
 */
export function updateSquadMemberTarget(squadId, position, target) {
  return updateProfile(profile => {
    const newSquads = profile.squads.map(squad =>
      squad.id === squadId ? squad.updateMemberTarget(position, target) : squad
    );
    return profile.withSquads(newSquads);
  });
}

/**
 * Move a squad member to a different position
 * @param squadId {string} ID of the squad
 * @param fromPosition {number} Current position
 * @param toPosition {number} New position
 * @returns {Function}
 */
export function moveSquadMember(squadId, fromPosition, toPosition) {
  return updateProfile(profile => {
    const newSquads = profile.squads.map(squad =>
      squad.id === squadId ? squad.moveMember(fromPosition, toPosition) : squad
    );
    return profile.withSquads(newSquads);
  });
}

/**
 * Send a squad to the optimizer (copy members to selectedCharacters)
 * @param squadId {string} ID of the squad to send
 * @returns {Function}
 */
export function sendSquadToOptimizer(squadId) {
  return updateProfile(profile => {
    const squad = profile.squads.find(s => s.id === squadId);
    if (!squad) {
      return profile;
    }

    const selectedCharacters = squad.toSelectedCharacters();
    return profile.withSelectedCharacters(selectedCharacters);
  });
}

/**
 * Clone a squad
 * @param squadId {string} ID of the squad to clone
 * @returns {Function}
 */
export function cloneSquad(squadId) {
  return updateProfile(profile => {
    const squad = profile.squads.find(s => s.id === squadId);
    if (!squad) {
      return profile;
    }

    const clonedSquad = new ModSquad(
      ModSquad.generateId(),
      `${squad.name} (Copy)`,
      squad.type,
      squad.members.map(m => ({ ...m })),
      squad.gameMode
    );

    return profile.withSquads([...profile.squads, clonedSquad]);
  });
}
