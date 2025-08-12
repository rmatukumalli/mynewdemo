// Utility functions for the Aviation Job Architecture Wizard

/**
 * Generates a unique ID with a given prefix.
 * @param {string} prefix - The prefix for the ID (e.g., 's' for skill, 'j' for job).
 * @returns {string} A unique ID string.
 */
export function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Add other utility functions here as needed
console.log('Wizard utils.js loaded.');
