import { state, STEPS, updateState, initializeOntologyData } from './state.js'; // Added initializeOntologyData
import { handlers } from './handlers.js';
import { updateLocalState as updateStep3LocalState } from './components/step3/state.js';

// Function to map descriptive job level from AI tool to L1-L5 used in wizard
function mapJobLevelToWizardFormat(descriptiveLevel) {
    const levelMap = {
        "entry level": "L1",
        "associate": "L2",
        "senior": "L3",
        "lead": "L4",
        "manager": "L4", // Manager could map to Lead or a specific Manager level if defined
        "senior manager": "L5",
        "director": "L5", // Director and VP might be above L5, adjust if wizard has more levels
        "vp": "L5",
        "vice president": "L5"
    };
    return levelMap[descriptiveLevel.toLowerCase()] || descriptiveLevel; // Fallback to original if not mapped
}

// Function to map skill names to skill objects { skillId, proficiency (defaulted) }
function mapSkillsToWizardFormat(skillsStringWithProficiency) {
    console.log('[mapSkillsToWizardFormat] Input string:', skillsStringWithProficiency);
    if (!skillsStringWithProficiency) return [];
    
    console.log('[mapSkillsToWizardFormat] state.ontologySkills length:', state.ontologySkills?.length);
    // console.log('[mapSkillsToWizardFormat] First 3 ontology skills:', state.ontologySkills?.slice(0,3));


    const skillEntries = skillsStringWithProficiency.split(';');
    const mappedSkills = [];

    const proficiencyNameMapToLevel = {
        'expert': 3,
        'advanced': 3,
        'intermediate': 2,
        'foundational': 1,
        'basic': 1
    };

    skillEntries.forEach(entry => {
        const match = entry.trim().match(/^(.*?)\s*\((.*?)\)$/);
        let skillName;
        let proficiencyNameFromAI = 'intermediate'; // Default

        if (match && match[1] && match[2]) {
            skillName = match[1].trim();
            proficiencyNameFromAI = match[2].trim().toLowerCase();
        } else {
            skillName = entry.trim(); // No proficiency specified, use default
        }

        if (!skillName) return; // Should be continue if in forEach, but forEach handles undefined from map
        
        console.log(`[mapSkillsToWizardFormat] Processing skillName: "${skillName}", proficiencyName: "${proficiencyNameFromAI}"`);

        const foundSkill = state.ontologySkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
        
        if (foundSkill) {
            console.log(`[mapSkillsToWizardFormat] Found skill in ontology:`, foundSkill);
            let proficiency = proficiencyNameMapToLevel[proficiencyNameFromAI] || 2; // Default to Intermediate (level 2) if name not in map
            
            mappedSkills.push({ skillId: foundSkill.id, proficiency: proficiency });
        } else {
            // Skill not found in ontology, it will be handled by rawAiSkills
            console.warn(`[mapSkillsToWizardFormat] Skill "${skillName}" (from AI writer) not found in wizard ontology. It will be in rawAiSkills.`);
        }
    });
    console.log('[mapSkillsToWizardFormat] Returned mappedSkills:', mappedSkills);
    return mappedSkills;
}


// --- INITIALIZATION & URL PARAMETER HANDLING ---
document.addEventListener('DOMContentLoaded', async () => { // Made async
    // Initialize ontology data from APIs first
    try {
        await initializeOntologyData();
        console.log('Ontology data loaded successfully in main.js.');
    } catch (error) {
        console.error('Failed to initialize ontology data in main.js:', error);
        // Handle error appropriately, e.g., show a message to the user
        // For now, the application might proceed with empty ontology data,
        // or you might want to prevent further initialization.
    }

    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    let initialStep = state.currentStep; // Default to current state's step or 1

    if (action === 'updateJobFromAI') {
        const groupId = params.get('groupId');
        const jobId = params.get('jobId');

        if (groupId && jobId) {
            const updatedRoleGroups = state.roleGroups.map(group => {
                if (group.id === groupId) {
                    const updatedJobs = group.jobs.map(job => {
                        if (job.id === jobId) {
                            // Update all relevant fields from params
                            return {
                                ...job,
                                title: params.get('jobTitle') || job.title,
                                requisitionId: params.get('requisitionId') || job.requisitionId,
                                department: params.get('department') || job.department,
                                businessUnit: params.get('businessUnit') || job.businessUnit,
                                level: mapJobLevelToWizardFormat(params.get('jobLevel')) || job.level,
                                employmentType: params.get('employmentType') || job.employmentType,
                                workLocation: params.get('location') || job.workLocation, // 'location' from AI tool maps to 'workLocation'
                                salaryMin: params.get('salaryMin') ? parseFloat(params.get('salaryMin')) : job.salaryMin,
                                salaryMax: params.get('salaryMax') ? parseFloat(params.get('salaryMax')) : job.salaryMax,
                                hiringManager: params.get('hiringManager') || job.hiringManager,
                                recruiter: params.get('recruiter') || job.recruiter,
                                roleSummary: params.get('jobSummary') || job.roleSummary, // 'jobSummary' from AI tool
                                responsibilities: params.get('responsibilities') || job.responsibilities,
                                additionalQualifications: params.get('qualifications') || job.additionalQualifications, // 'qualifications' from AI tool
                                benefits: params.get('benefits') || job.benefits,
                                skills: mapSkillsToWizardFormat(params.get('skills') || ''), // Pass empty string if null/undefined
                                rawAiSkills: params.get('skills') ? (params.get('skills') || '').split(';').map(s => {
                                    const match = s.trim().match(/^(.*?)\s*\((.*?)\)$/);
                                    if (match && match[1] && match[2]) {
                                        return { name: match[1].trim(), proficiencyName: match[2].trim().toLowerCase() };
                                    }
                                    return { name: s.trim(), proficiencyName: 'intermediate' }; // Fallback
                                }).filter(s => s.name) : (job.rawAiSkills || [])
                            };
                        }
                        return job;
                    });
                    return { ...group, jobs: updatedJobs };
                }
                return group;
            });
            // Update role groups but don't set currentStep here yet, let 'step' param override
            updateState({ roleGroups: updatedRoleGroups });
            
            // Explicitly set the selected job for Step 3 (Skills Mapping) to the one just updated
            updateStep3LocalState({ selectedJobIdForSkillMapping: jobId });
            
            // Clean URL params after processing (only if action was processed)
            // Keep 'step' param if it exists for step navigation
            const stepParamForClean = params.get('step');
            const newSearchParams = new URLSearchParams();
            if (stepParamForClean) {
                newSearchParams.set('step', stepParamForClean);
            }
            window.history.replaceState({}, document.title, `${window.location.pathname}?${newSearchParams.toString()}${window.location.hash}`);


        } else {
            console.warn('Missing groupId or jobId for updateJobFromAI action.');
        }
    }

    // Check for a 'step' parameter to set the initial step, this takes precedence
    const stepParam = params.get('step');
    if (stepParam) {
        const parsedStep = parseInt(stepParam, 10);
        if (!isNaN(parsedStep) && parsedStep >= 1 && parsedStep <= STEPS.length) {
            initialStep = parsedStep;
        } else {
            console.warn(`Invalid 'step' parameter in URL: ${stepParam}`);
        }
    }
    
    updateState({ currentStep: initialStep });

    // Initial render of the application
    handlers.triggerRender();
    loadAddSkillModalHTML(); // Load the HTML for the new modal
});

async function loadAddSkillModalHTML() {
    try {
        const response = await fetch('components/add-skill-modal/addSkillModal.html');
        if (!response.ok) {
            throw new Error(`Failed to fetch addSkillModal.html: ${response.status}`);
        }
        const html = await response.text();
        const container = document.getElementById('add-skill-modal-container');
        if (container) {
            container.innerHTML = html;
            console.log('Add Skill Modal HTML loaded into container.');
            // JS for this modal is loaded via script tag in index.html, so it will self-initialize
        } else {
            console.error('add-skill-modal-container not found in the DOM.');
        }
    } catch (error) {
        console.error('Error loading Add Skill Modal HTML:', error);
    }
}
