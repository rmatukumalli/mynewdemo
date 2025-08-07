const API_BASE_URL = 'http://127.0.0.1:8000/api/v1'; // Assuming backend runs on port 8000

/**
 * Fetches data from the API.
 * @param {string} endpoint - The API endpoint to call (e.g., '/skills').
 * @param {object} options - Optional fetch options (method, headers, body).
 * @returns {Promise<object>} - The JSON response from the API.
 */
async function fetchData(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            // Try to parse error message from backend if available
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                // Ignore if error response is not JSON
            }
            const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }
        // For 204 No Content, response.json() will fail.
        if (response.status === 204) {
            return null; 
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error; // Re-throw to allow calling function to handle
    }
}

/**
 * Fetches summary counts for dashboard items.
 * NOTE: Assumes backend endpoints like /skills/count, /capabilities/count exist.
 * These need to be implemented on the Flask backend.
 * For now, it will call the regular list endpoints and use the 'total' from pagination.
 */
async function getSummaryCounts() {
    try {
        // For now, we'll fetch the first page of each resource and use the 'total' field.
        // Ideally, dedicated /count endpoints would be more efficient.
        const [skillsData, capabilitiesData, competenciesData, behaviorsData] = await Promise.all([
            fetchData('/skills/?per_page=1'), // Added trailing slash
            fetchData('/capabilities/?per_page=1'), // Added trailing slash
            fetchData('/competencies/?per_page=1'), // Added trailing slash
            fetchData('/behaviors/?per_page=1') // Added trailing slash
        ]);

        return {
            skills: skillsData?.total || 0,
            capabilities: capabilitiesData?.total || 0,
            competencies: competenciesData?.total || 0,
            behaviors: behaviorsData?.total || 0,
        };
    } catch (error) {
        console.error("Error fetching summary counts:", error);
        return {
            skills: 'N/A',
            capabilities: 'N/A',
            competencies: 'N/A',
            behaviors: 'N/A',
        };
    }
}

/**
 * Fetches recent audit logs.
 * NOTE: Assumes backend endpoint /audit-logs exists.
 * This needs to be implemented on the Flask backend.
 * @param {number} limit - The number of log entries to fetch.
 * @returns {Promise<Array>} - A list of audit log entries.
 */
async function getRecentAuditLogs(limit = 5) {
    try {
        // Placeholder: Replace with actual API call when endpoint is ready
        // const logs = await fetchData(`/audit-logs?limit=${limit}&sort=timestamp_desc`);
        // return logs;

        console.warn("getRecentAuditLogs: /api/v1/audit-logs endpoint not yet implemented on backend.");
        // Return mock data for now
        return [
            { id: 1, action: 'Created Skill "Python Programming"', user: 'admin', timestamp: new Date(Date.now() - 3600000).toISOString(), entity_type: 'Skill', entity_id: 101 },
            { id: 2, action: 'Updated Capability "Software Development"', user: 'editor', timestamp: new Date(Date.now() - 7200000).toISOString(), entity_type: 'Capability', entity_id: 20 },
            { id: 3, action: 'Deleted Competency "Agile Methodologies"', user: 'admin', timestamp: new Date(Date.now() - 10800000).toISOString(), entity_type: 'Competency', entity_id: 55 },
            { id: 4, action: 'Added related skill "Flask" to "Python Programming"', user: 'editor', timestamp: new Date(Date.now() - 14400000).toISOString(), entity_type: 'Skill', entity_id: 101 },
            { id: 5, action: 'Viewed Behavior "Code Review Participation"', user: 'viewer', timestamp: new Date(Date.now() - 18000000).toISOString(), entity_type: 'Behavior', entity_id: 72 }
        ].slice(0, limit);
    } catch (error) {
        console.error("Error fetching recent audit logs:", error);
        return [];
    }
}

// Add other API functions here as needed (e.g., for CRUD operations on entities)
// Example:
// async function getSkill(id) {
//     return fetchData(`/skills/${id}`);
// }
// async function createSkill(skillData) {
//     return fetchData('/skills', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(skillData) });
// }

// --- Functions to fetch all items for ontology types ---

/**
 * Fetches all skills.
 * @returns {Promise<Array>} - A list of all skill objects.
 */
async function getAllSkills() {
    const data = await fetchData('/skills/'); // Added trailing slash
    return data?.skills || [];
}

/**
 * Fetches all capabilities.
 * @returns {Promise<Array>} - A list of all capability objects.
 */
async function getAllCapabilities() {
    const data = await fetchData('/capabilities/'); // Added trailing slash
    return data?.capabilities || [];
}

/**
 * Fetches all competencies.
 * @returns {Promise<Array>} - A list of all competency objects.
 */
async function getAllCompetencies() {
    const data = await fetchData('/competencies/'); // Added trailing slash
    return data?.competencies || [];
}

/**
 * Fetches all behaviors.
 * @returns {Promise<Array>} - A list of all behavior objects.
 */
async function getAllBehaviors() {
    const data = await fetchData('/behaviors/'); // Added trailing slash
    return data?.behaviors || [];
}

/**
 * Fetches all proficiencies.
 * @returns {Promise<Array>} - A list of all proficiency objects.
 */
async function getAllProficiencies() {
    const data = await fetchData('/proficiencies/'); // Added trailing slash
    return data?.proficiencies || [];
}
