// --- CONSTANTS ---
export const PROFICIENCY_LEVELS = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
export const getProficiencyDisplay = (level) => Object.keys(PROFICIENCY_LEVELS).find(key => PROFICIENCY_LEVELS[key] === level) || 'N/A';
export const DEFAULT_REQUIRED_SKILL_LEVEL = 3; // Assume 'Advanced' for skills defined in the role form
