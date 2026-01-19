// @flow

/**
 * Configuration for mod scoring system
 * Defines set fitness scores and optimal main stats per slot
 */

/**
 * Set fitness scores - how valuable each mod set is in general
 * 1.0 = highly valuable/meta
 * 0.5 = situational
 * 0.0 = rarely useful
 */
export const setFitnessScores = {
  speed: 1.0,           // Speed set - universally valuable
  critdamage: 1.0,      // Crit Damage - very valuable for attackers
  critchance: 0.75,     // Crit Chance - good for attackers
  offense: 0.75,        // Offense - solid for damage dealers
  health: 0.5,          // Health - situational tanks
  defense: 0.5,         // Defense - situational tanks
  potency: 0.5,         // Potency - situational debuffers
  tenacity: 0.25,       // Tenacity - rarely optimal
};

/**
 * Optimal primary stats per slot
 * Defines which primary stats are considered "good" for each slot
 */
export const optimalPrimaryStats = {
  square: ['Offense', 'Offense %'], // Square is always offense
  arrow: ['Speed'],                  // Arrow should be speed
  diamond: ['Defense', 'Defense %'], // Diamond is always defense
  triangle: ['Critical Damage %', 'Offense %', 'Critical Chance %'], // Triangle - damage stats
  circle: ['Health %', 'Protection %'], // Circle - survivability
  cross: ['Potency %', 'Tenacity %', 'Offense %', 'Protection %', 'Health %'], // Cross - various
};

/**
 * Maximum possible values for primary stats at level 15
 * Used for normalization (0-1 scale)
 */
export const maxPrimaryStatValues = {
  // Flat stats
  'Health': 2400,
  'Protection': 2400,
  'Defense': 40,
  'Offense': 180,

  // Percentage stats
  'Health %': 16,
  'Protection %': 24,
  'Defense %': 20,
  'Offense %': 8.5,
  'Potency %': 30,
  'Tenacity %': 35,
  'Critical Chance %': 12,
  'Critical Damage %': 42,
  'Critical Avoidance %': 35,
  'Accuracy %': 30,

  // Speed (special case)
  'Speed': 32,
};

/**
 * Default scoring weights (general/balanced profile)
 * These define how much each component contributes to the final score
 */
export const defaultScoringWeights = {
  matchMainStat: 0.20,        // Is primary stat appropriate for slot?
  mainStatValue: 0.15,        // How good is the primary stat roll?
  secondaryQuality: 0.30,     // Average quality of secondary stats
  speedSecondaryScore: 0.15,  // Does it have speed secondary?
  levelScore: 0.05,           // Is the mod leveled up?
  setFitScore: 0.10,          // Is the set meta/valuable?
  potentialScore: 0.05,       // How many useful secondaries?
};

/**
 * Quality categories based on final score (0-100)
 */
export const qualityCategories = {
  EPIC: { min: 80, max: 100, label: 'Épique', color: '#ff9500' },
  VERY_GOOD: { min: 65, max: 79.99, label: 'Très bon', color: '#a335ee' },
  STANDARD: { min: 40, max: 64.99, label: 'Standard', color: '#0070dd' },
  TRASH: { min: 0, max: 39.99, label: 'À jeter', color: '#9d9d9d' },
};

/**
 * Get category from score
 * @param {number} score - Final score (0-100)
 * @returns {Object} Category object
 */
export function getCategoryFromScore(score) {
  if (score >= qualityCategories.EPIC.min) return qualityCategories.EPIC;
  if (score >= qualityCategories.VERY_GOOD.min) return qualityCategories.VERY_GOOD;
  if (score >= qualityCategories.STANDARD.min) return qualityCategories.STANDARD;
  return qualityCategories.TRASH;
}

/**
 * Useful secondary stats (for potential score calculation)
 */
export const usefulSecondaryStats = [
  'Speed',
  'Offense',
  'Offense %',
  'Critical Chance %',
  'Critical Damage %',
  'Health %',
  'Protection %',
  'Potency %',
  'Tenacity %',
];
