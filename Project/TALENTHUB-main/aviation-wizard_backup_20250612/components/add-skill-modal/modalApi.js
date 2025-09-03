import { state, updateState } from '../../state.js';

const API_BASE_URL = '/api/v1'; // Centralized API base URL

async function fetchFromApi(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Server responded with ${response.status}` }));
        console.error(`API Error (${endpoint}):`, response.status, errorData.message);
        throw new Error(errorData.message || `Server responded with ${response.status}`);
    }
    return response.json();
}

export async function fetchCapabilities() {
    try {
        const data = await fetchFromApi('/capabilities?per_page=1000');
        if (data.capabilities) {
            updateState({ capabilities: data.capabilities });
            console.log('Modal API: Updated state.capabilities from API.');
        }
        return data.capabilities || [];
    } catch (error) {
        console.error('Modal API: Error fetching/updating capabilities:', error);
        throw error; // Re-throw to be caught by caller if needed
    }
}

export async function fetchCompetencies() {
    try {
        const data = await fetchFromApi('/competencies?per_page=1000');
        if (data.competencies) {
            updateState({ competencies: data.competencies });
            console.log('Modal API: Updated state.competencies from API.');
        }
        return data.competencies || [];
    } catch (error) {
        console.error('Modal API: Error fetching/updating competencies:', error);
        throw error;
    }
}

export async function fetchSkills() {
    try {
        const data = await fetchFromApi('/skills?per_page=1000');
        // if (data.skills) {
        //     updateState({ ontologySkills: data.skills }); // Do not overwrite global state here
        //     console.log('Modal API: Updated state.ontologySkills from API.');
        // }
        // Return the fetched skills for the modal's potential internal use,
        // but don't let it dictate the global ontology skill list.
        console.log('Modal API: Fetched skills from API. Global ontologySkills NOT updated by this fetch.');
        return data.skills || [];
    } catch (error) {
        console.error('Modal API: Error fetching/updating skills:', error);
        throw error;
    }
}

export async function addSkillToOntology(skillData) { // skillData contains string IDs from the form
    try {
        const apiResponseSkill = await fetchFromApi('/skills/ontology/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(skillData),
        });

        // Ensure the skill object that gets added to the state has the correct competencyId (as a number)
        // The apiResponseSkill might not include it, or include it differently.
        // We trust the skillData.competencyId from the form.
        const skillForState = {
            ...apiResponseSkill, // Base on API response (e.g., for skill's own ID, name, description)
            // Override or ensure competencyId from the form data is present and parsed as int
            competencyId: skillData.competencyId ? parseInt(skillData.competencyId, 10) : undefined,
        };
        
        // Update in-memory state
        const newOntologySkills = [...state.ontologySkills, skillForState];
        updateState({ ontologySkills: newOntologySkills });
        console.log('Modal API: Skill added and state updated. Ensured competencyId is set from form data.');
        return skillForState; // Return the object that was actually added to the state
    } catch (error) {
        console.error('Modal API: Error adding skill to ontology:', error);
        throw error;
    }
}

export async function addNewCapability(capabilityData) {
    try {
        const addedCapability = await fetchFromApi('/capabilities/ontology/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(capabilityData),
        });

        const newCapabilities = [...state.capabilities, addedCapability];
        updateState({ capabilities: newCapabilities });
        console.log('Modal API: Capability added and state updated.');
        return addedCapability;
    } catch (error) {
        console.error('Modal API: Error adding new capability:', error);
        throw error;
    }
}

export async function addNewCompetency(competencyData) {
    try {
        const addedCompetency = await fetchFromApi('/competencies/ontology/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(competencyData),
        });

        const newCompetencies = [...state.competencies, addedCompetency];
        updateState({ competencies: newCompetencies });
        console.log('Modal API: Competency added and state updated.');
        return addedCompetency;
    } catch (error) {
        console.error('Modal API: Error adding new competency:', error);
        throw error;
    }
}
