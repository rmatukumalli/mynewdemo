// aviation-wizard/components/step3/eventHandlers.js
import { updateState, state as globalState } from '../../state.js';
import { handlers as globalHandlers } from '../../handlers.js';
import { localState, updateLocalState } from './state.js';
// Import the new Skill Navigator
import { openSkillNavigator } from '../../skill-navigator/skillNavigator.js';
// Import the new Add Skill Modal opener
import { openAddSkillModal } from '../../components/add-skill-modal/addSkillModal.js';

export const handleSelectJobForSkillMapping = (jobId) => {
    updateLocalState({ selectedJobIdForSkillMapping: jobId, activeJobDetailTab: 'basicInfo' });
    globalHandlers.triggerRender();
};

export const handleOpenSkillModal = () => {
    if (!localState.selectedJobIdForSkillMapping) {
        alert("Please select a job first to add skills/behaviours.");
        return;
    }
    // Call the new Skill Navigator
    openSkillNavigator(localState.selectedJobIdForSkillMapping);
    // Note: The new navigator handles its own rendering and state.
    // We don't trigger a global render here as the navigator is a separate DOM entity.
};

// The old handleCloseSkillModal and other modal-specific handlers 
// (rerenderModal, handleModalNext, handleModalBack, handleSelectCapability, 
// handleSelectCompetency, handleStageSkill, handleRemoveStagedSkill, 
// handleUpdateStagedSkillProficiency, handleAddSelectedSkillsToJob)
// are now effectively replaced by the logic within skillNavigator.js.
// The new skillNavigator.js handles its own closure and saving logic.

export const handleJobDetailChange = (event) => {
    if (!localState.selectedJobIdForSkillMapping) return;

    const { name, value } = event.target;
    const updatedRoleGroups = globalState.roleGroups.map(group => ({
        ...group,
        jobs: group.jobs.map(job => {
            if (job.id === localState.selectedJobIdForSkillMapping) {
                return { ...job, [name]: value };
            }
            return job;
        })
    }));
    updateState({ roleGroups: updatedRoleGroups });
};

export const handlePopulateWithAI = (fieldName) => {
    console.log(`AI population requested for field: ${fieldName}`);

    if (!localState.selectedJobIdForSkillMapping) {
        alert("Please select a job first.");
        return;
    }
    const selectedJob = globalState.roleGroups.flatMap(rg => rg.jobs).find(job => job.id === localState.selectedJobIdForSkillMapping);
    if (!selectedJob) {
        alert("Selected job details not found.");
        return;
    }

    const fieldsToOpenAIWriter = ['roleSummary', 'responsibilities', 'jobFamily', 'department', 'workLocation', 'businessUnit', 'roleGroup', 'roleLevelName', 'yearsOfExperience'];

    if (fieldsToOpenAIWriter.includes(fieldName)) {
        let groupIdForSelectedJob = null;
        for (const group of globalState.roleGroups) {
            if (group.jobs.find(j => j.id === selectedJob.id)) {
                groupIdForSelectedJob = group.id;
                break;
            }
        }

        if (!groupIdForSelectedJob) {
            alert("Could not determine the group for the selected job. Cannot proceed.");
            return;
        }

        const params = new URLSearchParams();
        params.set('source', 'jobArchWizard');
        params.set('groupId', groupIdForSelectedJob);
        params.set('jobId', selectedJob.id);

        for (const key in selectedJob) {
            if (key === 'skills') {
                const skillStrings = (selectedJob.skills || []).map(jobSkill => {
                    const skillDetail = globalState.ontologySkills.find(s => s.id === jobSkill.skillId);
                    return skillDetail ? skillDetail.name : 'Unknown Skill';
                }).filter(name => name !== 'Unknown Skill');
                if (skillStrings.length > 0) {
                    params.set('skills', skillStrings.join(';'));
                }
            } else if (selectedJob[key] !== null && selectedJob[key] !== undefined) {
                params.set(key, selectedJob[key].toString());
            }
        }
        window.location.href = `../create_with_ai.html?${params.toString()}`;
        return;
    }
    alert(`Placeholder: AI will generate content for "${fieldName}" and populate the field.`);
};

export const handleJobDetailTabClick = (tabId) => {
    updateLocalState({ activeJobDetailTab: tabId });
    globalHandlers.triggerRender();
};

export const handleRemoveSkillFromJob = (skillIdToRemove) => {
    if (!localState.selectedJobIdForSkillMapping) return;

    const updatedRoleGroups = globalState.roleGroups.map(group => ({
        ...group,
        jobs: group.jobs.map(job => {
            if (job.id === localState.selectedJobIdForSkillMapping) {
                const updatedSkills = (job.skills || []).filter(s => s.skillId !== skillIdToRemove);
                // Also remove associated behaviours if any logic ties them directly to skills being removed (currently not implemented)
                return { ...job, skills: updatedSkills };
            }
            return job;
        })
    }));
    updateState({ roleGroups: updatedRoleGroups });
    globalHandlers.triggerRender();
};

export const handleMapAiSkillToOntology = (rawSkillName, rawSkillProficiencyName) => {
    if (!localState.selectedJobIdForSkillMapping) {
        alert("Please select a job first to map an AI-suggested skill.");
        return;
    }
    console.log(`[handleMapAiSkillToOntology] Opening modal for AI skill: "${rawSkillName}" (Proficiency from AI: "${rawSkillProficiencyName}") for job ID: ${localState.selectedJobIdForSkillMapping}`);

    // Find the selected job to potentially get more details about the raw AI skill, like its description
    const selectedJob = globalState.roleGroups
        .flatMap(rg => rg.jobs)
        .find(job => job.id === localState.selectedJobIdForSkillMapping);

    let aiSkillDescription = ''; // Placeholder for AI skill description
    if (selectedJob && selectedJob.rawAiSkills) {
        const matchedRawSkill = selectedJob.rawAiSkills.find(rs => rs.name.toLowerCase() === rawSkillName.toLowerCase());
        // Assuming rawAiSkills objects might have a 'description' property.
        // If not, the AI writer might need to be updated to pass this, or we use a generic description.
        if (matchedRawSkill && matchedRawSkill.description) { 
            aiSkillDescription = matchedRawSkill.description;
        } else if (matchedRawSkill) { // If skill exists but no description
             aiSkillDescription = `AI-suggested skill: ${rawSkillName}. Review and map to ontology.`;
        } else { // If skill somehow not even in rawAiSkills list (should not happen if button is present)
            aiSkillDescription = `Reviewing AI-suggested skill: ${rawSkillName}.`;
        }
    } else {
        aiSkillDescription = `AI-suggested skill: ${rawSkillName}. Review and map to ontology.`;
    }
    
    const aiSkillDetails = {
        name: rawSkillName,
        description: aiSkillDescription,
        proficiencyName: rawSkillProficiencyName // This is the string name like "intermediate"
    };

    // Call the new modal opener function
    openAddSkillModal(
        localState.selectedJobIdForSkillMapping, 
        rawSkillName, // aiSkillDetails.name
        rawSkillProficiencyName, // aiSkillDetails.proficiencyName
        handleSkillAddedToOntology // Callback function
    );
    // The openAddSkillModal function will handle its own display and state.
};

// Callback function after a new skill is successfully added via the modal
const handleSkillAddedToOntology = (newlyAddedSkill, jobId) => {
    console.log('[handleSkillAddedToOntology] New skill added:', newlyAddedSkill, 'for job:', jobId);
    
    // 1. Add the new skill to the current job's skills list in the global state
    //    (assuming a default proficiency or allowing user to set it immediately after)
    //    For now, let's find the AI suggested proficiency for this skill if available.
    const selectedJob = globalState.roleGroups
        .flatMap(rg => rg.jobs)
        .find(job => job.id === jobId);
    
    let proficiencyToSet = 2; // Default to Intermediate (level 2)
    if (selectedJob && selectedJob.rawAiSkills) {
        const rawSkill = selectedJob.rawAiSkills.find(rs => rs.name.toLowerCase() === newlyAddedSkill.name.toLowerCase());
        if (rawSkill && rawSkill.proficiencyName) {
            const proficiencyNameMapToLevel = { 'expert': 3, 'advanced': 3, 'intermediate': 2, 'foundational': 1, 'basic': 1 };
            proficiencyToSet = proficiencyNameMapToLevel[rawSkill.proficiencyName.toLowerCase()] || 2;
        }
    }


    const updatedRoleGroups = globalState.roleGroups.map(group => ({
        ...group,
        jobs: group.jobs.map(job => {
            if (job.id === jobId) {
                const existingSkills = job.skills || [];
                // Avoid adding if somehow already present (should be handled by modal's unique check, but good practice)
                if (!existingSkills.find(s => s.skillId === newlyAddedSkill.id)) {
                    const updatedJobSkills = [...existingSkills, { skillId: newlyAddedSkill.id, proficiency: proficiencyToSet }];
                    
                    // Also, remove it from rawAiSkills for this job as it's now mapped
                    const updatedRawAiSkills = (job.rawAiSkills || []).filter(rs => rs.name.toLowerCase() !== newlyAddedSkill.name.toLowerCase());
                    
                    return { ...job, skills: updatedJobSkills, rawAiSkills: updatedRawAiSkills };
                }
            }
            return job;
        })
    }));
    updateState({ roleGroups: updatedRoleGroups });

    // 2. Trigger a re-render to update the UI (e.g., the skills list for the job)
    globalHandlers.triggerRender();
    
    // Optionally, display a success message or further UI updates
    console.log(`Skill "${newlyAddedSkill.name}" automatically added to job "${jobId}" with proficiency level ${proficiencyToSet}.`);
};


export const handleGenerateJobWithAI = () => {
    console.log('[handleGenerateJobWithAI] Clicked');
    if (!localState.selectedJobIdForSkillMapping) {
        alert("Please select a job first to generate or update its details with AI.");
        return;
    }

    const selectedJob = globalState.roleGroups
        .flatMap(rg => rg.jobs)
        .find(job => job.id === localState.selectedJobIdForSkillMapping);

    if (!selectedJob) {
        alert("Selected job details not found. Cannot proceed.");
        return;
    }

    let groupIdForSelectedJob = null;
    for (const group of globalState.roleGroups) {
        if (group.jobs.find(j => j.id === selectedJob.id)) {
            groupIdForSelectedJob = group.id;
            break;
        }
    }

    if (!groupIdForSelectedJob) {
        alert("Could not determine the group for the selected job. Cannot proceed.");
        return;
    }

    const params = new URLSearchParams();
    params.set('source', 'jobArchWizard');
    params.set('groupId', groupIdForSelectedJob);
    params.set('jobId', selectedJob.id);

    // Pre-populate with existing data from the wizard
    if (selectedJob.title) params.set('jobTitle', selectedJob.title);
    if (selectedJob.level) params.set('jobLevel', selectedJob.level); // This is L1-L5, create_with_ai.js handles mapping this if possible
    if (selectedJob.department) params.set('department', selectedJob.department);
    if (selectedJob.workLocation) params.set('workLocation', selectedJob.workLocation);
    if (selectedJob.roleSummary) params.set('roleSummary', selectedJob.roleSummary);
    if (selectedJob.responsibilities) params.set('responsibilities', selectedJob.responsibilities);
    if (selectedJob.yearsOfExperience) params.set('yearsOfExperience', selectedJob.yearsOfExperience);
    if (selectedJob.jobFamily) params.set('jobFamily', selectedJob.jobFamily);
    if (selectedJob.roleGroup) params.set('roleGroup', selectedJob.roleGroup);
    if (selectedJob.roleLevelName) params.set('roleLevelName', selectedJob.roleLevelName);
    if (selectedJob.additionalQualifications) params.set('qualifications', selectedJob.additionalQualifications); // Map to 'qualifications' in AI tool
    if (selectedJob.businessUnit) params.set('businessUnit', selectedJob.businessUnit);
    if (selectedJob.employmentType) params.set('employmentType', selectedJob.employmentType);
    if (selectedJob.salaryMin) params.set('salaryMin', selectedJob.salaryMin.toString());
    if (selectedJob.salaryMax) params.set('salaryMax', selectedJob.salaryMax.toString());
    if (selectedJob.hiringManager) params.set('hiringManager', selectedJob.hiringManager);
    if (selectedJob.recruiter) params.set('recruiter', selectedJob.recruiter);
    if (selectedJob.benefits) params.set('benefits', selectedJob.benefits);


    // Format skills as "Skill Name (Proficiency Name);..."
    // Wizard proficiency levels: 1 (Foundational), 2 (Basic), 3 (Intermediate), 4 (Advanced), 5 (Expert)
    // AI tool proficiency names: 'foundational', 'basic', 'intermediate', 'advanced', 'expert'
    const wizardProficiencyLevelToAiNameMap = {
        1: 'foundational',
        2: 'basic',
        3: 'intermediate',
        4: 'advanced',
        5: 'expert'
    };

    const skillStrings = (selectedJob.skills || []).map(jobSkill => {
        const skillDetail = globalState.ontologySkills.find(s => s.id === jobSkill.skillId);
        if (skillDetail) {
            const proficiencyName = wizardProficiencyLevelToAiNameMap[jobSkill.proficiency] || 'intermediate'; // Default to 'intermediate' if somehow not mapped
            return `${skillDetail.name} (${proficiencyName})`;
        }
        return null; // Should not happen if data is consistent
    }).filter(Boolean); // Filter out any nulls

    // Include rawAiSkills if they exist and are not already in mapped skills
    if (selectedJob.rawAiSkills && selectedJob.rawAiSkills.length > 0) {
        selectedJob.rawAiSkills.forEach(rawSkill => {
            // Avoid duplicating if the raw skill name matches an already mapped skill name
            if (!skillStrings.some(s => s.toLowerCase().startsWith(rawSkill.name.toLowerCase() + " ("))) {
                 const proficiencyName = rawSkill.proficiencyName || 'intermediate';
                 skillStrings.push(`${rawSkill.name} (${proficiencyName})`);
            }
        });
    }


    if (skillStrings.length > 0) {
        params.set('skills', skillStrings.join(';'));
    }
    
    // Navigate to the AI writer page
    // The path is relative to the aviation-wizard directory
    window.location.href = `../create_with_ai.html?${params.toString()}`;
};

// It might be necessary to add a handler for removing selected behaviours from a job as well.
// For now, this is not implemented as the request focused on adding them.

export const handleUpdateProficiencyForJobSkill = (skillId, newProficiency) => {
    if (!localState.selectedJobIdForSkillMapping) return;
    const proficiencyNum = parseInt(newProficiency, 10);

    const updatedRoleGroups = globalState.roleGroups.map(group => ({
        ...group,
        jobs: group.jobs.map(job => {
            if (job.id === localState.selectedJobIdForSkillMapping) {
                return {
                    ...job,
                    skills: (job.skills || []).map(skill => skill.skillId === skillId ? { ...skill, proficiency: proficiencyNum } : skill)
                };
            }
            return job;
        })
    }));
    updateState({ roleGroups: updatedRoleGroups });
    globalHandlers.triggerRender();
};
