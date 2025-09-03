// All required DOM elements
const capabilitySelect = document.getElementById('capability-select');
const competencySelect = document.getElementById('competency-select');
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
    capabilitySelect.innerHTML = ''; // Clear loading message
    
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = '-- Select a Domain --';
    capabilitySelect.appendChild(placeholderOption);

    allCapabilities.forEach(cap => {
        const option = document.createElement('option');
        option.value = cap.id;
        option.textContent = cap.name;
        capabilitySelect.appendChild(option);
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

    competencySelect.innerHTML = '<option value="">-- Select an Area of Expertise --</option>';
    competencySelect.disabled = true;
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
            competencySelect.appendChild(option);
        });
        competencySelect.disabled = false;
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
    const skillDetailsPanel = document.getElementById('skill-details-panel');
    const sidebar = document.getElementById('sidebar');
    const proficienciesSidebar = document.getElementById('proficiencies-sidebar');

    // If the proficiencies sidebar is open, close it before showing the hierarchy.
    if (proficienciesSidebar && proficienciesSidebar.classList.contains('visible')) {
        proficienciesSidebar.classList.remove('visible');
    }

    if (!skillDetailsPanel || !sidebar) {
        console.error('Sidebar or skill details panel not found.');
        return;
    }

    // Hide panel and show sidebar while loading
    skillDetailsPanel.style.display = 'none';
    sidebar.classList.add('visible');

    const timestamp = new Date().getTime();
    const rawDetails = await fetchData(`/api/v1/ontology/skills/${skillId}/details_full?_=${timestamp}`);
    console.log('Fetched skill details from API:', rawDetails);

    if (rawDetails) {
        const skillDetails = Array.isArray(rawDetails) ? rawDetails[0] : rawDetails;

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
        
        // Make the panel visible now that it's populated
        skillDetailsPanel.style.display = 'block';
        // Also ensure the sidebar is visible
        sidebar.classList.add('visible');

    } else {
        console.error("Failed to load skill details. Cannot render panels.");
        sidebar.classList.remove('visible'); // Hide sidebar on error
    }
}

async function fetchAndDisplaySkillRelationships(skillId) {
    try {
        const response = await fetch(`/api/v1/ontology/skills/${skillId}/relationships`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const relationships = await response.json();

        const prerequisites = [];
        const requiredBy = [];
        const relatedSkills = [];

        relationships.forEach(rel => {
            if (rel.source_skill.id === skillId) {
                // If this skill is the source, the other skill is the target.
                // Example: "This skill" (source) is a "prerequisite of" (type) "that skill" (target).
                // So, "that skill" is required by "this skill".
                if (rel.relationship_type.id === "prerequisite_of") {
                    requiredBy.push(rel.target_skill.name);
                } else {
                    relatedSkills.push(`${rel.relationship_type.name}: ${rel.target_skill.name}`);
                }
            } else if (rel.target_skill.id === skillId) {
                // If this skill is the target, the other skill is the source.
                // Example: "That skill" (source) is a "prerequisite of" (type) "this skill" (target).
                // So, "this skill" has a prerequisite of "that skill".
                if (rel.relationship_type.id === "prerequisite_of") {
                    prerequisites.push(rel.source_skill.name);
                } else {
                    relatedSkills.push(`${rel.relationship_type.name}: ${rel.source_skill.name}`);
                }
            }
        });

        const relationshipsContainer = document.getElementById('relationships-container');
        relationshipsContainer.innerHTML = '';

        if (prerequisites.length > 0) {
            const section = document.createElement('div');
            section.classList.add('relationship-section');
            section.innerHTML = `<h4>Prerequisites</h4><ul>${prerequisites.map(p => `<li>${p}</li>`).join('')}</ul>`;
            relationshipsContainer.appendChild(section);
        }

        if (requiredBy.length > 0) {
            const section = document.createElement('div');
            section.classList.add('relationship-section');
            section.innerHTML = `<h4>Required By</h4><ul>${requiredBy.map(r => `<li>${r}</li>`).join('')}</ul>`;
            relationshipsContainer.appendChild(section);
        }

        const relatedSkillsSection = document.createElement('div');
        relatedSkillsSection.classList.add('relationship-section');
        relatedSkillsSection.innerHTML = `<h4>Related Skills</h4>`;
        if (relatedSkills.length > 0) {
            const ul = document.createElement('ul');
            relatedSkills.forEach(r => {
                const [type, ...skillParts] = r.split(':');
                const skill = skillParts.join(':').trim();
                const li = document.createElement('li');
                const typeClass = type.toLowerCase().replace(/\s+/g, '-');
                li.innerHTML = `<span class="relationship-type ${typeClass}">${type}:</span> ${skill}`;
                ul.appendChild(li);
            });
            relatedSkillsSection.appendChild(ul);
        } else {
            relatedSkillsSection.innerHTML += '<p>No related skills data available.</p>';
        }
        relationshipsContainer.appendChild(relatedSkillsSection);
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
    } catch (error) {
        console.error("Failed to load slideout panel HTML:", error);
        return;
    }

    capabilitySelect.innerHTML = '<option value="">Loading Ontology Data...</option>';
    await loadAllCapabilities();
    populateCapabilitiesDropdown();
    
    capabilitySelect.addEventListener('change', (event) => {
        if (event.target.value) loadCompetencies(event.target.value);
    });

    competencySelect.addEventListener('change', (event) => {
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

// Wait for the DOM to be fully loaded before initializing the app
document.addEventListener('DOMContentLoaded', initializeApp);