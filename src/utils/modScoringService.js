// @flow

import {
  setFitnessScores,
  optimalPrimaryStats,
  maxPrimaryStatValues,
  defaultScoringWeights,
  getCategoryFromScore,
  usefulSecondaryStats,
} from '../constants/modScoringConfig';

/**
 * Mod Scoring Service
 *
 * Calculates a quality score (0-100) for each mod based on:
 * - Primary stat appropriateness for slot
 * - Primary stat value (normalized)
 * - Secondary stats quality (Grandivory's 1-4 rolls converted to 0.25-1.0)
 * - Presence of Speed secondary
 * - Mod level (+0 to +15)
 * - Set fitness (meta value)
 * - Potential (number of useful secondaries)
 */

/**
 * Convert Grandivory's secondary stat roll grades (1-4) to normalized scores (0.25-1.0)
 *
 * @param {number} roll - Roll grade from Grandivory (1-4)
 * @returns {number} Normalized score (0.25, 0.50, 0.75, or 1.00)
 */
function convertRollToScore(roll) {
  switch (roll) {
    case 4: return 1.00;
    case 3: return 0.75;
    case 2: return 0.50;
    case 1: return 0.25;
    default: return 0.25; // Fallback for unknown rolls
  }
}

/**
 * Calculate if the primary stat matches the slot optimally
 *
 * @param {string} slot - Mod slot (square, arrow, diamond, triangle, circle, cross)
 * @param {Object} primaryStat - Primary stat object with displayType
 * @returns {number} 1.0 if optimal, 0.0 if not
 */
function calculateMatchMainStat(slot, primaryStat) {
  const optimalStats = optimalPrimaryStats[slot] || [];
  const primaryType = primaryStat.displayType;

  return optimalStats.includes(primaryType) ? 1.0 : 0.0;
}

/**
 * Calculate normalized primary stat value (0-1)
 *
 * @param {Object} primaryStat - Primary stat object
 * @returns {number} Normalized value (0-1), clamped
 */
function calculateMainStatValue(primaryStat) {
  const statType = primaryStat.displayType;
  const maxValue = maxPrimaryStatValues[statType];

  if (!maxValue) {
    return 0.5; // Unknown stat type, return neutral score
  }

  // Get the actual value (handle both string and number formats)
  let actualValue = parseFloat(primaryStat.value);

  if (isNaN(actualValue)) {
    return 0.5; // Invalid value, return neutral score
  }

  // Normalize to 0-1 scale
  const normalized = actualValue / maxValue;

  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, normalized));
}

/**
 * Calculate secondary stats quality score (0-1)
 * Average of all secondary stats' converted rolls
 *
 * @param {Array} secondaryStats - Array of secondary stat objects with rolls
 * @returns {number} Average quality score (0-1)
 */
function calculateSecondaryQuality(secondaryStats) {
  if (!secondaryStats || secondaryStats.length === 0) {
    return 0.0;
  }

  const scores = secondaryStats.map(stat => convertRollToScore(stat.roll || 1));
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  return average;
}

/**
 * Check if mod has Speed as a secondary stat
 *
 * @param {Array} secondaryStats - Array of secondary stat objects
 * @returns {number} 1.0 if Speed present, 0.0 if not
 */
function calculateSpeedSecondaryScore(secondaryStats) {
  if (!secondaryStats || secondaryStats.length === 0) {
    return 0.0;
  }

  const hasSpeed = secondaryStats.some(stat =>
    stat.displayType === 'Speed' || stat.displayType === 'Speed %'
  );

  return hasSpeed ? 1.0 : 0.0;
}

/**
 * Calculate level score based on mod level
 *
 * @param {number} level - Mod level (0-15)
 * @returns {number} Score (0.25, 0.50, 0.75, or 1.0)
 */
function calculateLevelScore(level) {
  if (level === 15) return 1.0;
  if (level >= 12) return 0.75;
  if (level >= 9) return 0.50;
  return 0.25;
}

/**
 * Calculate set fitness score based on mod set
 *
 * @param {Object} set - Mod set object with name
 * @returns {number} Fitness score (0-1)
 */
function calculateSetFitScore(set) {
  const setName = set.name.toLowerCase();
  return setFitnessScores[setName] || 0.5; // Default to 0.5 if unknown
}

/**
 * Calculate potential score (ratio of useful secondaries)
 *
 * @param {Array} secondaryStats - Array of secondary stat objects
 * @returns {number} Ratio of useful stats (0-1)
 */
function calculatePotentialScore(secondaryStats) {
  if (!secondaryStats || secondaryStats.length === 0) {
    return 0.0;
  }

  const usefulCount = secondaryStats.filter(stat =>
    usefulSecondaryStats.includes(stat.displayType)
  ).length;

  return usefulCount / secondaryStats.length;
}

/**
 * Calculate final mod score (0-100)
 *
 * @param {Object} mod - Mod object
 * @param {Object} weights - Scoring weights (optional, uses defaults if not provided)
 * @returns {number} Final score (0-100)
 */
export function calculateModScore(mod, weights = defaultScoringWeights) {
  // Calculate all component scores (normalized 0-1)
  const matchMainStat = calculateMatchMainStat(mod.slot, mod.primaryStat);
  const mainStatValue = calculateMainStatValue(mod.primaryStat);
  const secondaryQuality = calculateSecondaryQuality(mod.secondaryStats);
  const speedSecondaryScore = calculateSpeedSecondaryScore(mod.secondaryStats);
  const levelScore = calculateLevelScore(mod.level);
  const setFitScore = calculateSetFitScore(mod.set);
  const potentialScore = calculatePotentialScore(mod.secondaryStats);

  // Calculate weighted final score
  const finalScore = 100 * (
    weights.matchMainStat * matchMainStat +
    weights.mainStatValue * mainStatValue +
    weights.secondaryQuality * secondaryQuality +
    weights.speedSecondaryScore * speedSecondaryScore +
    weights.levelScore * levelScore +
    weights.setFitScore * setFitScore +
    weights.potentialScore * potentialScore
  );

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, finalScore));
}

/**
 * Calculate score and category for a mod
 * Returns enhanced mod object with score and category
 *
 * @param {Object} mod - Mod object
 * @param {Object} weights - Scoring weights (optional)
 * @returns {Object} Enhanced mod with score and category
 */
export function scoreAndCategorizeMod(mod, weights = defaultScoringWeights) {
  const score = calculateModScore(mod, weights);
  const category = getCategoryFromScore(score);

  return {
    ...mod,
    score: Math.round(score * 10) / 10, // Round to 1 decimal
    category: category.label,
    categoryColor: category.color,
  };
}

/**
 * Score and categorize an array of mods
 *
 * @param {Array} mods - Array of mod objects
 * @param {Object} weights - Scoring weights (optional)
 * @returns {Array} Array of enhanced mods with scores and categories
 */
export function scoreMods(mods, weights = defaultScoringWeights) {
  return mods.map(mod => scoreAndCategorizeMod(mod, weights));
}

/**
 * Get statistics about scored mods
 *
 * @param {Array} scoredMods - Array of mods with scores and categories
 * @returns {Object} Statistics object
 */
export function getModStatistics(scoredMods) {
  if (!scoredMods || scoredMods.length === 0) {
    return {
      total: 0,
      epic: 0,
      veryGood: 0,
      standard: 0,
      trash: 0,
      averageScore: 0,
    };
  }

  const categoryCounts = scoredMods.reduce((acc, mod) => {
    acc[mod.category] = (acc[mod.category] || 0) + 1;
    return acc;
  }, {});

  const totalScore = scoredMods.reduce((sum, mod) => sum + mod.score, 0);
  const averageScore = totalScore / scoredMods.length;

  return {
    total: scoredMods.length,
    epic: categoryCounts['Épique'] || 0,
    veryGood: categoryCounts['Très bon'] || 0,
    standard: categoryCounts['Standard'] || 0,
    trash: categoryCounts['À jeter'] || 0,
    averageScore: Math.round(averageScore * 10) / 10,
  };
}
