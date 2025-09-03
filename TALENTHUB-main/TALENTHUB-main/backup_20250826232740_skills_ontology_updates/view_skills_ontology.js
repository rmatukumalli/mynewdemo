// All required DOM elements
const skillGroupSelect = document.getElementById('capability-select');
const skillSetSelect = document.getElementById('competency-select');
const skillsListContainer = document.getElementById('skills-list');
const behaviorsListContainer = document.getElementById('behaviors-list');
const skillSearchInput = document.getElementById('skill-search-input');

// State variables
let allCapabilities = [];
let allCompetencies = [];
let allSkills = [];
let currentSelectedSkillId = null;
let currentSelectedCapability = null;
let currentSelectedCompetency = null;

/**
 * Fetches data from a given URL.
 * @param {string} url - The API endpoint to fetch.
 * @returns {Promise<any>} The JSON response or null on error.
 */
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}

/**
 * Loads all capabilities from the API and stores them.
 */
async function loadAllCapabilities() {
    const data = await fetchData('/api/v1/ontology/capabilities');
    if (data) {
        allCapabilities = data;
        console.log('All Capabilities Loaded and Stored:', allCapabilities);
    }
}

/**
 * Populates the capabilities dropdown from the pre-loaded data.
 */
function populateCapabilitiesDropdown() {
    skillGroupSelect.innerHTML = ''; // Clear loading message
    
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = '-- Select a Skill Group --';
    skillGroupSelect.appendChild(placeholderOption);

    allCapabilities.forEach(cap => {
        const option = document.createElement('option');
        option.value = cap.id;
        option.textContent = cap.name;
        skillGroupSelect.appendChild(option);
    });
}

/**
 * Populates competencies dropdown based on the selected capability from pre-loaded data.
 * @param {string} capabilityId - The ID of the selected capability.
 */
async function loadCompetencies(capabilityId) {
    skillsListContainer.innerHTML = '<button class="skill-tag">Select an area of expertise to see the skills.</button>';
    behaviorsListContainer.innerHTML = '<button class="skill-tag behavior-tag">Select an area of expertise to see key behaviors.</button>';
    const skillDetailsPanel = document.getElementById('skill-details-panel');
    if(skillDetailsPanel) skillDetailsPanel.style.display = 'none';

    skillSetSelect.innerHTML = '<option value="">-- Select a Skill Set --</option>';
    skillSetSelect.disabled = true;
    currentSelectedSkillId = null;
    currentSelectedCompetency = null;

    currentSelectedCapability = allCapabilities.find(cap => cap.id == capabilityId);

    const competencies = await fetchData(`/api/v1/ontology/capabilities/${capabilityId}/competencies`);
    if (competencies) {
        allCompetencies = competencies;
        competencies.forEach(comp => {
            const option = document.createElement('option');
            option.value = comp.id;
            option.textContent = comp.name;
            skillSetSelect.appendChild(option);
        });
        skillSetSelect.disabled = false;
    }
}

/**
 * Displays skills and behaviors as tags for the selected competency from pre-loaded data.
 * @param {string} competencyId - The ID of the selected competency.
 */
async function loadSkills(competencyId) {
    skillsListContainer.innerHTML = '<button class="skill-tag">Loading Skills...</button>';
    behaviorsListContainer.innerHTML = '<button class="skill-tag behavior-tag">Loading Behaviors...</button>';
    const skillDetailsPanel = document.getElementById('skill-details-panel');
    if(skillDetailsPanel) skillDetailsPanel.style.display = 'none';
    currentSelectedSkillId = null;

    currentSelectedCompetency = allCompetencies.find(comp => comp.id == competencyId);

    skillsListContainer.innerHTML = ''; // Clear previous skills
    behaviorsListContainer.innerHTML = ''; // Clear previous behaviors

    const skills = await fetchData(`/api/v1/ontology/competencies/${competencyId}/skills`);
    if (skills) {
        allSkills = skills;
        if (skills.length > 0) {
            skills.forEach(skill => {
                const button = document.createElement('button');
                button.classList.add('skill-tag');
                button.textContent = skill.name;
                button.dataset.skillId = skill.id;
                button.addEventListener('click', () => {
                    document.querySelectorAll('.skill-tag').forEach(tag => tag.classList.remove('active'));
                    document.querySelectorAll('.behavior-tag').forEach(tag => tag.classList.remove('active'));
                    button.classList.add('active');
                    displaySkillDetails(skill.id);
                });
                skillsListContainer.appendChild(button);
            });
        } else {
            skillsListContainer.innerHTML = '<button class="skill-tag">No skills found for this competency.</button>';
        }
    }

    const behaviors = await fetchData(`/api/v1/ontology/competencies/${competencyId}/behaviors`);
    if (behaviors) {
        if (behaviors.length > 0) {
            behaviors.forEach(behavior => {
                const button = document.createElement('button');
                button.classList.add('skill-tag', 'behavior-tag');
                button.textContent = behavior.name;
                button.dataset.behaviorId = behavior.id;
                button.addEventListener('click', () => {
                    document.querySelectorAll('.skill-tag').forEach(tag => tag.classList.remove('active'));
                    document.querySelectorAll('.behavior-tag').forEach(tag => tag.classList.remove('active'));
                    button.classList.add('active');
                    console.log('Behavior clicked:', behavior.name);
                });
                behaviorsListContainer.appendChild(button);
            });
        } else {
            behaviorsListContainer.innerHTML = '<button class="skill-tag behavior-tag">No behaviors found for this competency.</button>';
        }
    }
}

/**
 * Displays the details for a selected skill, including list and hierarchy views.
 * @param {string} skillId - The ID of the skill to display.
 */
async function displaySkillDetails(skillId) {
    currentSelectedSkillId = skillId;
    const skillDetailsPanel = document.getElementById('skill-details-panel'); // Hierarchy panel
    const sidebar = document.getElementById('sidebar'); // Hierarchy sidebar
    const proficienciesSidebar = document.getElementById('proficiencies-sidebar');
    const insightsSidebar = document.getElementById('insights-sidebar'); // New insights sidebar
    const skillInsightsPanel = document.getElementById('skill-insights-panel'); // New insights panel

    // If any other sidebar is open, close it before showing the hierarchy.
    if (proficienciesSidebar && proficienciesSidebar.classList.contains('visible')) {
        proficienciesSidebar.classList.remove('visible');
    }
    if (insightsSidebar && insightsSidebar.classList.contains('visible')) { // Close insights sidebar
        insightsSidebar.classList.remove('visible');
    }

    if (!skillDetailsPanel || !sidebar || !skillInsightsPanel) { // Check for new insights panel
        console.error('Sidebar or skill details panel not found.');
        return;
    }

    // Hide panels and show hierarchy sidebar while loading
    skillDetailsPanel.style.display = 'none';
    skillInsightsPanel.style.display = 'none'; // Hide insights panel too
    sidebar.classList.add('visible'); // Default to hierarchy view

    const timestamp = new Date().getTime();
    const rawDetails = await fetchData(`/api/v1/ontology/skills/${skillId}/details_full?_=${timestamp}`);
    console.log('Fetched skill details from API:', rawDetails);

    if (rawDetails) {
        const skillDetails = Array.isArray(rawDetails) ? rawDetails[0] : rawDetails;

        // --- Start Dummy Metadata Injection ---
        skillDetails.demandSignals = "High demand in Tech (80%), Moderate in Finance (50%)";
        skillDetails.relatedRoles = ["Software Engineer", "Data Scientist", "AI/ML Specialist"];
        skillDetails.learningContent = [
            { name: "Advanced Python Course", url: "#" },
            { name: "Machine Learning Certification", url: "#" }
        ];
        skillDetails.industryTags = ["Technology", "Data Science", "Artificial Intelligence"];
        // --- End Dummy Metadata Injection ---

        if (!skillDetails) {
            console.error("Skill details are null or undefined after processing API response.");
            sidebar.classList.remove('visible'); // Hide sidebar on error
            return;
        }

        const selectedSkill = allSkills.find(skill => skill.id == skillId);
        if (!skillDetails.name && selectedSkill) skillDetails.name = selectedSkill.name;
        if (!skillDetails.description && selectedSkill) skillDetails.description = selectedSkill.description;

        // Set category from the main skills list if not in details
        if (!skillDetails.category && selectedSkill) {
            skillDetails.category = selectedSkill.category;
        }

        renderHierarchyView(skillDetails);
        renderProficienciesInSlideout(skillDetails.proficiencies, skillDetails.name);
        fetchAndDisplaySkillRelationships(skillId);
        renderSkillMetadata(skillDetails); // Call the new rendering function for insights

        // Update skill name in insights panel
        const insightsSkillNameText = document.getElementById('insights-skill-name').querySelector('.skill-name-text');
        if (insightsSkillNameText) {
            insightsSkillNameText.textContent = `Skill Insights for ${skillDetails.name}`;
        }
        
        // Make the hierarchy panel visible now that it's populated
        skillDetailsPanel.style.display = 'block';
        // Also ensure the hierarchy sidebar is visible
        sidebar.classList.add('visible');

    } else {
        console.error("Failed to load skill details. Cannot render panels.");
        sidebar.classList.remove('visible'); // Hide sidebar on error
    }
}

function renderSkillMetadata(skillDetails) {
    console.log("renderSkillMetadata called with:", skillDetails);
    const metadataContainer = document.getElementById('metadata-container');
    console.log("metadataContainer:", metadataContainer);
    if (!metadataContainer) {
        console.error("Metadata container not found in DOM.");
        return;
    }

    const demandSignalsElem = document.getElementById('demand-signals');
    const relatedRolesList = document.getElementById('related-roles');
    const learningContentList = document.getElementById('learning-content');
    const industryTagsElem = document.getElementById('industry-tags');

    if (!demandSignalsElem || !relatedRolesList || !learningContentList || !industryTagsElem) {
        console.error("One or more metadata elements not found in DOM.");
        return;
    }

    // Populate Demand Signals
    demandSignalsElem.textContent = skillDetails.demandSignals || 'No data available.';

    // Populate Related Roles
    relatedRolesList.innerHTML = '';
    if (skillDetails.relatedRoles && skillDetails.relatedRoles.length > 0) {
        skillDetails.relatedRoles.forEach(role => {
            const li = document.createElement('li');
            li.textContent = role;
            relatedRolesList.appendChild(li);
        });
    } else {
        relatedRolesList.innerHTML = '<li>No data available.</li>';
    }

    // Populate Associated Learning Content
    learningContentList.innerHTML = '';
    if (skillDetails.learningContent && skillDetails.learningContent.length > 0) {
        skillDetails.learningContent.forEach(content => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = content.url;
            a.textContent = content.name;
            a.target = "_blank"; // Open in new tab
            li.appendChild(a);
            learningContentList.appendChild(li);
        });
    } else {
        learningContentList.innerHTML = '<li>No data available.</li>';
    }

    // Populate Industry Tags
    industryTagsElem.textContent = (skillDetails.industryTags && skillDetails.industryTags.length > 0) ? skillDetails.industryTags.join(', ') : 'No data available.';

    metadataContainer.style.display = 'block'; // Make the metadata container visible
}

async function fetchAndDisplaySkillRelationships(skillId) {
    try {
        const response = await fetch(`/api/v1/ontology/skills/${skillId}/relationships`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const relationships = await response.json();

        // Define relationship type groupings
        const relationshipGroupings = {
            "Hierarchy": ["part_of", "is_specialization_of", "is_generalization_of"],
            "Learning Path": ["prerequisite_of", "is_prerequisite_for", "is_successor_to", "is_corequisite_with"],
            "Associative": ["related_to", "is_complementary_to", "is_alternative_to", "is_similar_to"],
            "Contextual": ["is_used_in", "is_enabled_by", "is_contradictory_to"]
        };

        const groupedRelationships = {
            "Hierarchy": [],
            "Learning Path": [],
            "Associative": [],
            "Contextual": []
        };

        // --- Start Dummy Data Injection for Grouped Relationships ---
        const dummySkillId = skillId;
        const dummyGroupedRelationships = [
            // Hierarchy
            { source_skill: { id: "dummy-skill-h1", name: "Broader Skill" }, target_skill: { id: dummySkillId, name: "Current Skill" }, relationship_type: { id: "is_generalization_of", name: "isGeneralizationOf" } },
            { source_skill: { id: dummySkillId, name: "Current Skill" }, target_skill: { id: "dummy-skill-h2", name: "Niche Skill" }, relationship_type: { id: "is_specialization_of", name: "isSpecializationOf" } },
            // Learning Path
            { source_skill: { id: "dummy-skill-lp1", name: "Foundation Skill" }, target_skill: { id: dummySkillId, name: "Current Skill" }, relationship_type: { id: "is_prerequisite_for", name: "isPrerequisiteFor" } },
            { source_skill: { id: dummySkillId, name: "Current Skill" }, target_skill: { id: "dummy-skill-lp2", name: "Next Step Skill" }, relationship_type: { id: "is_successor_to", name: "isSuccessorTo" } },
            { source_skill: { id: "dummy-skill-lp3", name: "Parallel Skill" }, target_skill: { id: dummySkillId, name: "Current Skill" }, relationship_type: { id: "is_corequisite_with", name: "isCorequisiteWith" } },
            // Associative
            { source_skill: { id: dummySkillId, name: "Current Skill" }, target_skill: { id: "dummy-skill-a1", name: "Complementary Skill" }, relationship_type: { id: "is_complementary_to", name: "isComplementaryTo" } },
            { source_skill: { id: "dummy-skill-a2", name: "Alternative Skill" }, target_skill: { id: dummySkillId, name: "Current Skill" }, relationship_type: { id: "is_alternative_to", name: "isAlternativeTo" } },
            { source_skill: { id: dummySkillId, name: "Current Skill" }, target_skill: { id: "dummy-skill-a3", name: "Similar Skill" }, relationship_type: { id: "is_similar_to", name: "isSimilarTo" } },
            // Contextual
            { source_skill: { id: dummySkillId, name: "Current Skill" }, target_skill: { id: "dummy-skill-c1", name: "Project Management" }, relationship_type: { id: "is_used_in", name: "isUsedIn" } },
            { source_skill: { id: "dummy-skill-c2", name: "Leadership" }, target_skill: { id: dummySkillId, name: "Current Skill" }, relationship_type: { id: "is_enabled_by", name: "isEnabledBy" } },
            { source_skill: { id: dummySkillId, name: "Current Skill" }, target_skill: { id: "dummy-skill-c3", name: "Outdated Method" }, relationship_type: { id: "is_contradictory_to", name: "isContradictoryTo" } }
        ];
        relationships.push(...dummyGroupedRelationships);
        // --- End Dummy Data Injection ---


        relationships.forEach(rel => {
            const relationshipTypeId = rel.relationship_type.id;
            const relationshipTypeName = rel.relationship_type.name;
            let targetSkillName = '';
            let sourceSkillName = '';

            if (rel.source_skill.id === skillId) {
                targetSkillName = rel.target_skill.name;
                sourceSkillName = "Current Skill"; // For display purposes
            } else if (rel.target_skill.id === skillId) {
                targetSkillName = "Current Skill"; // For display purposes
                sourceSkillName = rel.source_skill.name;
            } else {
                return; // Skip relationships not directly involving the current skill
            }

            // Determine the group for the relationship
            let groupFound = false;
            for (const groupName in relationshipGroupings) {
                if (relationshipGroupings[groupName].includes(relationshipTypeId)) {
                    // For "isPrerequisiteFor" and "prerequisite_of", we need to distinguish source/target for display
                    if (groupName === "Learning Path" && (relationshipTypeId === "prerequisite_of" || relationshipTypeId === "is_prerequisite_for")) {
                        if (rel.target_skill.id === skillId) { // Current skill is the target, so source is the prerequisite
                            groupedRelationships[groupName].push(`Prerequisite: ${sourceSkillName}`);
                        } else { // Current skill is the source, so target is required by current skill
                            groupedRelationships[groupName].push(`Required By: ${targetSkillName}`);
                        }
                    } else {
                        // For other relationships, display type and the other skill
                        if (rel.source_skill.id === skillId) {
                            groupedRelationships[groupName].push(`${relationshipTypeName}: ${targetSkillName}`);
                        } else {
                            groupedRelationships[groupName].push(`${relationshipTypeName}: ${sourceSkillName}`);
                        }
                    }
                    groupFound = true;
                    break;
                }
            }
            if (!groupFound) {
                // Fallback for any un-categorized relationships, put them in Associative or a new 'Other' category
                // For now, let's put them in Associative
                if (rel.source_skill.id === skillId) {
                    groupedRelationships["Associative"].push(`${relationshipTypeName}: ${targetSkillName}`);
                } else {
                    groupedRelationships["Associative"].push(`${relationshipTypeName}: ${sourceSkillName}`);
                }
            }
        });

        const relationshipsContainer = document.getElementById('relationships-container');
        relationshipsContainer.innerHTML = '';

        for (const groupName in groupedRelationships) {
            const relationshipsInGroup = groupedRelationships[groupName];
            if (relationshipsInGroup.length > 0) {
                const section = document.createElement('div');
                section.classList.add('relationship-section');
                section.innerHTML = `<h4>${groupName}</h4>`;
                const ul = document.createElement('ul');
                relationshipsInGroup.forEach(r => {
                    const li = document.createElement('li');
                    // Split "Type: Skill Name" to apply class to type
                    const parts = r.split(':');
                    if (parts.length > 1) {
                        const type = parts[0].trim();
                        const skill = parts.slice(1).join(':').trim();
                        const typeClass = type.toLowerCase().replace(/\s+/g, '-');
                        li.innerHTML = `<span class="relationship-type ${typeClass}">${type}:</span> ${skill}`;
                    } else {
                        li.textContent = r; // Fallback if no colon
                    }
                    ul.appendChild(li);
                });
                section.appendChild(ul);
                relationshipsContainer.appendChild(section);
            }
        }
        relationshipsContainer.style.display = 'block';

    } catch (error) {
        console.error("Error fetching skill relationships:", error);
    }
}

function renderHierarchyView(skillDetails) {
    const skillHierarchyPanel = document.getElementById('skill-hierarchy-panel');
    if (!skillHierarchyPanel) {
        console.error("Hierarchy panel not found in DOM.");
        return;
    }

    const detailSkillCategoryBadge = document.getElementById('detail-skill-category-badge');
    if (skillDetails.category && skillDetails.category !== 'Not Categorized') {
        detailSkillCategoryBadge.textContent = skillDetails.category;
        detailSkillCategoryBadge.style.display = 'inline-block';
    } else {
        detailSkillCategoryBadge.style.display = 'none';
    }

    // Ensure skillDetails is not null or undefined
    if (!skillDetails) {
        console.error("renderHierarchyView called with null skillDetails.");
        // Optionally, clear the panel or show an error message
        skillHierarchyPanel.innerHTML = '<p>Error: Skill data not available.</p>';
        return;
    }

    const grandparentSkillBox = document.getElementById('grandparent-skill-box');
    const grandparentName = document.getElementById('grandparent-name');
    const parentSkillBox = document.getElementById('parent-skill-box');
    const parentName = document.getElementById('parent-name');
    const currentSkillNameHierarchyElem = document.getElementById('current-skill-name-hierarchy');
    const detailSkillDescription = document.getElementById('detail-skill-description');
    const detailSkillName = document.getElementById('detail-skill-name');
    const detailSkillNameText = detailSkillName ? detailSkillName.querySelector('.skill-name-text') : null;
    const behaviorsContainerHierarchy = document.getElementById('behaviors-container-hierarchy');
    const behaviorsGrid = behaviorsContainerHierarchy ? behaviorsContainerHierarchy.querySelector('.behaviors-grid') : null;
    const relationshipsContainer = document.getElementById('relationships-container');

    // Null-check all elements before using them
    if (!grandparentSkillBox || !grandparentName || !parentSkillBox || !parentName || !currentSkillNameHierarchyElem || !behaviorsContainerHierarchy || !behaviorsGrid || !relationshipsContainer || !detailSkillNameText) {
        console.error("One or more elements for hierarchy view are missing from the DOM.");
        return;
    }

    [grandparentSkillBox, parentSkillBox].forEach(el => el.style.display = 'none');
    behaviorsGrid.innerHTML = '';
    relationshipsContainer.innerHTML = '';

    detailSkillNameText.textContent = skillDetails.name;
    currentSkillNameHierarchyElem.textContent = skillDetails.name;
    detailSkillDescription.innerHTML = `<strong>Description:</strong> ${skillDetails.description || 'No description available.'}`;

    if (currentSelectedCapability) {
        grandparentSkillBox.style.display = 'block';
        grandparentName.textContent = currentSelectedCapability.name;
    }

    if (currentSelectedCompetency) {
        parentSkillBox.style.display = 'block';
        parentName.textContent = currentSelectedCompetency.name;
    }

    const associatedBehaviors = currentSelectedCompetency ? currentSelectedCompetency.behaviors : [];
    if (associatedBehaviors.length > 0) {
        behaviorsContainerHierarchy.style.display = 'block';
        associatedBehaviors.forEach(behavior => {
            const div = document.createElement('div');
            div.classList.add('behavior-item');
            div.innerHTML = `<div class="title">${behavior.name}</div>`;
            behaviorsGrid.appendChild(div);
        });
    } else {
        behaviorsContainerHierarchy.style.display = 'none';
    }
}

function renderProficienciesInSlideout(proficiencies, skillName) {
    const tabsContainer = document.getElementById('proficiencies-container-slideout');
    const detailsContainer = document.getElementById('proficiency-details-container-slideout');
    const skillNameElem = document.getElementById('proficiencies-skill-name').querySelector('.skill-name-text');

    if (!tabsContainer || !detailsContainer || !skillNameElem) {
        console.error("One or more proficiency slideout elements not found!");
        return;
    }

    skillNameElem.textContent = skillName;
    tabsContainer.innerHTML = '';
    detailsContainer.innerHTML = '';

    if (!proficiencies || proficiencies.length === 0) {
        tabsContainer.innerHTML = '<p>No proficiency levels defined for this skill.</p>';
        const supplementaryContainer = document.getElementById('supplementary-content-container');
        if (supplementaryContainer) supplementaryContainer.innerHTML = '';
        return;
    }

    const tabs = document.createElement('div');
    tabs.className = 'proficiency-tabs';

    const sortedProficiencies = proficiencies.sort((a, b) => a.level - b.level);

    sortedProficiencies.forEach((proficiencyData, index) => {
        const tab = document.createElement('button');
        tab.className = 'proficiency-tab';
        tab.textContent = proficiencyData.name;
        tab.dataset.level = proficiencyData.name.toLowerCase();

        tab.addEventListener('click', () => {
            tabs.querySelectorAll('.proficiency-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderProficiencyDetailsInSlideout(proficiencyData);
            renderSupplementaryContent(proficiencyData, sortedProficiencies);
        });
        tabs.appendChild(tab);

        if (index === 0) {
            requestAnimationFrame(() => tab.click());
        }
    });

    tabsContainer.appendChild(tabs);
}

function renderProficiencyDetailsInSlideout(proficiency) {
    const detailsContainer = document.getElementById('proficiency-details-container-slideout');
    if (!detailsContainer) return;
    detailsContainer.innerHTML = `<div class="proficiency-detail"><h4>${proficiency.name}</h4><p>${proficiency.description}</p></div>`;
}

function renderSupplementaryContent(proficiency, allProficiencies) {
    const supplementaryContainer = document.getElementById('supplementary-content-container');
    if (!supplementaryContainer) return;

    const currentIndex = allProficiencies.findIndex(p => p.level === proficiency.level);
    const nextProficiency = currentIndex < allProficiencies.length - 1 ? allProficiencies[currentIndex + 1] : null;

    let courseHTML = '';
    if (nextProficiency) {
        courseHTML = `
        <div class="course-card">
            <img src="images/course_card.jpg" alt="Course Thumbnail">
            <div class="course-card-content">
                <h5>Course to reach ${nextProficiency.name}</h5>
                <p>This course covers core concepts to progress from ${proficiency.name} to ${nextProficiency.name}.</p>
                <p class="duration">Approx. 4–6 hours</p>
                <a href="#" class="cta-button">Explore Course</a>
            </div>
        </div>`;
    } else {
        courseHTML = `
        <div class="course-card">
            <div class="course-card-content">
                <h5>You've reached the highest level!</h5>
                <p>Consider mentoring others or exploring related advanced skills.</p>
            </div>
        </div>`;
    }

    supplementaryContainer.innerHTML = `
        ${courseHTML}
        <div class="content-block"><h5>Why this skill matters</h5><ul><li>Commonly required in mid-to-senior roles.</li><li>Helps in cross-functional collaboration.</li></ul></div>
        <div class="content-block"><span class="progress-tag">Your level: ${proficiency.name}</span><span class="progress-indicator">Progress: ${currentIndex + 1} of ${allProficiencies.length}</span></div>
    `;
}

async function handleSkillSearch() {
    const query = skillSearchInput.value.toLowerCase();
    const resultsContainer = document.querySelector('.search-results');
    if (query.length < 2) {
        if (resultsContainer) resultsContainer.remove();
        return;
    }

    const filteredSkills = allSkills.filter(skill => skill.name.toLowerCase().includes(query));
    
    if (resultsContainer) resultsContainer.remove();
    const newResultsContainer = document.createElement('div');
    newResultsContainer.className = 'search-results';
    
    filteredSkills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.textContent = skill.name;
        item.dataset.skillId = skill.id;
        item.addEventListener('click', async () => {
            const skillId = item.dataset.skillId;
            const skillData = allSkills.find(s => s.id === skillId);
            if (skillData && skillData.competencies.length > 0) {
                const competency = allCompetencies.find(c => c.id === skillData.competencies[0].id);
                if (competency && competency.capabilities.length > 0) {
                    const capability = competency.capabilities[0];
                    capabilitySelect.value = capability.id;
                    await loadCompetencies(capability.id);
                    competencySelect.value = competency.id;
                    await loadSkills(competency.id);
                    const skillButton = skillsListContainer.querySelector(`button[data-skill-id="${skillId}"]`);
                    if (skillButton) skillButton.click();
                }
            }
            newResultsContainer.remove();
        });
        newResultsContainer.appendChild(item);
    });
    skillSearchInput.parentElement.appendChild(newResultsContainer);
}

async function initializeApp() {
    try {
        let response = await fetch('slideout_hierarchy.html');
        let data = await response.text();
        document.getElementById('slideout-placeholder').innerHTML = data;

        response = await fetch('slideout_proficiencies.html');
        data = await response.text();
        document.getElementById('proficiencies-slideout-placeholder').innerHTML = data;

        // Load new insights slideout
        response = await fetch('slideout_insights.html');
        data = await response.text();
        document.getElementById('insights-slideout-placeholder').innerHTML = data;

    } catch (error) {
        console.error("Failed to load slideout panel HTML:", error);
        return;
    }

    skillGroupSelect.innerHTML = '<option value="">Loading Ontology Data...</option>';
    await loadAllCapabilities();
    populateCapabilitiesDropdown();
    
    skillGroupSelect.addEventListener('change', (event) => {
        if (event.target.value) loadCompetencies(event.target.value);
    });

    skillSetSelect.addEventListener('change', (event) => {
        if (event.target.value) loadSkills(event.target.value);
    });

    skillSearchInput.addEventListener('input', handleSkillSearch);

    console.log("Application initialized.");
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const proficienciesSidebar = document.getElementById('proficiencies-sidebar');

    if (!sidebar) {
        console.error('Hierarchy sidebar element not found.');
        return;
    }

    const isOpening = !sidebar.classList.contains('visible');

    // If we are opening this sidebar, close the other one first.
    if (isOpening && proficienciesSidebar && proficienciesSidebar.classList.contains('visible')) {
        proficienciesSidebar.classList.remove('visible');
    }

    sidebar.classList.toggle('visible');
}

function toggleProficienciesSidebar() {
    const sidebar = document.getElementById('sidebar');
    const proficienciesSidebar = document.getElementById('proficiencies-sidebar');

    if (!proficienciesSidebar) {
        console.error('Proficiencies sidebar element not found.');
        return;
    }

    const isOpening = !proficienciesSidebar.classList.contains('visible');

    // If we are opening this sidebar, close the other one first.
    if (isOpening && sidebar && sidebar.classList.contains('visible')) {
        sidebar.classList.remove('visible');
    }

    proficienciesSidebar.classList.toggle('visible');
}

// Global toggle functions for sidebars
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const proficienciesSidebar = document.getElementById('proficiencies-sidebar');
    const insightsSidebar = document.getElementById('insights-sidebar');

    if (!sidebar) {
        console.error('Hierarchy sidebar element not found.');
        return;
    }

    const isOpening = !sidebar.classList.contains('visible');

    if (isOpening) {
        if (proficienciesSidebar && proficienciesSidebar.classList.contains('visible')) {
            proficienciesSidebar.classList.remove('visible');
        }
        if (insightsSidebar && insightsSidebar.classList.contains('visible')) {
            insightsSidebar.classList.remove('visible');
        }
    }

    sidebar.classList.toggle('visible');
}

function toggleProficienciesSidebar() {
    const sidebar = document.getElementById('sidebar');
    const proficienciesSidebar = document.getElementById('proficiencies-sidebar');
    const insightsSidebar = document.getElementById('insights-sidebar');

    if (!proficienciesSidebar) {
        console.error('Proficiencies sidebar element not found.');
        return;
    }

    const isOpening = !proficienciesSidebar.classList.contains('visible');

    if (isOpening) {
        if (sidebar && sidebar.classList.contains('visible')) {
            sidebar.classList.remove('visible');
        }
        if (insightsSidebar && insightsSidebar.classList.contains('visible')) {
            insightsSidebar.classList.remove('visible');
        }
    }

    proficienciesSidebar.classList.toggle('visible');
}

function toggleSkillInsightsSidebar() {
    const sidebar = document.getElementById('sidebar');
    const proficienciesSidebar = document.getElementById('proficiencies-sidebar');
    const insightsSidebar = document.getElementById('insights-sidebar');
    const skillInsightsPanel = document.getElementById('skill-insights-panel'); // Get the panel

    if (!insightsSidebar || !skillInsightsPanel) { // Check for both
        console.error('Skill Insights sidebar or panel element not found.');
        return;
    }

    const isOpening = !insightsSidebar.classList.contains('visible');

    if (isOpening) {
        if (sidebar && sidebar.classList.contains('visible')) {
            sidebar.classList.remove('visible');
        }
        if (proficienciesSidebar && proficienciesSidebar.classList.contains('visible')) {
            proficienciesSidebar.classList.remove('visible');
        }
        skillInsightsPanel.style.display = 'block'; // Make the panel visible when opening the sidebar
    } else {
        skillInsightsPanel.style.display = 'none'; // Hide the panel when closing the sidebar
    }

    insightsSidebar.classList.toggle('visible');
}

// Wait for the DOM to be fully loaded before initializing the app
document.addEventListener('DOMContentLoaded', initializeApp);
