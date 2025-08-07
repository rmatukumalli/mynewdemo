// --- DOM Element References ---
const jobTextareas = document.querySelectorAll('#jobSummary, #responsibilities, #qualifications');
const typingIndicator = document.getElementById('typingIndicator');
const analysisText = document.getElementById('analysisText');
const skillSuggestionsContainer = document.getElementById('skillSuggestions');
const skillsListContainer = document.getElementById('skillsList');
const jobTitleInput = document.getElementById('jobTitle');
const departmentSelect = document.getElementById('department');
const jobLevelSelect = document.getElementById('jobLevel');
const employmentTypeSelect = document.getElementById('employmentType');
const locationInput = document.getElementById('location');
const jobSummaryTextarea = document.getElementById('jobSummary');
const responsibilitiesTextarea = document.getElementById('responsibilities');
const qualificationsTextarea = document.getElementById('qualifications');
const hiringManagerInput = document.getElementById('hiringManager');
const addAllSkillsButton = document.getElementById('addAllSkillsButton');


// --- State Variables ---
let analysisTimeout;
let addedSkills = new Set(); // Stores names of skills already added to the main list

// --- Skill Database (Simulated AI Knowledge) ---
const skillDatabase = {
    // Marketing
    'digital marketing': { name: 'Digital Marketing', level: 'expert' },
    'marketing strategy': { name: 'Marketing Strategy', level: 'advanced' },
    'seo': { name: 'SEO/SEM', level: 'advanced' },
    'sem': { name: 'SEO/SEM', level: 'advanced' },
    'content strategy': { name: 'Content Strategy', level: 'advanced' },
    'content marketing': { name: 'Content Marketing', level: 'advanced' },
    'social media marketing': { name: 'Social Media Marketing', level: 'advanced' },
    'email marketing': { name: 'Email Marketing', level: 'advanced' },
    'marketing analytics': { name: 'Marketing Analytics', level: 'advanced' },
    'crm': { name: 'CRM Management', level: 'intermediate' },
    'marketing automation': { name: 'Marketing Automation', level: 'advanced' },
    'campaign management': { name: 'Campaign Management', level: 'advanced' },
    'ppc': { name: 'PPC Advertising', level: 'advanced'},
    'google analytics': { name: 'Google Analytics', level: 'advanced' },
    // Engineering & Development
    'javascript': { name: 'JavaScript', level: 'expert' },
    'python': { name: 'Python', level: 'expert' },
    'java': { name: 'Java', level: 'expert' },
    'c#': { name: 'C#', level: 'expert' },
    'c++': { name: 'C++', level: 'expert' },
    'php': { name: 'PHP', level: 'advanced' },
    'ruby': { name: 'Ruby on Rails', level: 'advanced' },
    'swift': { name: 'Swift (iOS)', level: 'expert' },
    'kotlin': { name: 'Kotlin (Android)', level: 'expert' },
    'react': { name: 'React.js', level: 'advanced' },
    'angular': { name: 'Angular', level: 'advanced' },
    'vue': { name: 'Vue.js', level: 'advanced' },
    'node.js': { name: 'Node.js', level: 'advanced' },
    'django': { name: 'Django', level: 'advanced' },
    'flask': { name: 'Flask', level: 'advanced' },
    'spring boot': { name: 'Spring Boot', level: 'advanced' },
    '.net': { name: '.NET Core/Framework', level: 'advanced' },
    'sql': { name: 'SQL', level: 'advanced' },
    'mysql': { name: 'MySQL', level: 'advanced' },
    'postgresql': { name: 'PostgreSQL', level: 'advanced' },
    'mongodb': { name: 'MongoDB', level: 'advanced' },
    'database management': { name: 'Database Management', level: 'advanced' },
    'api development': { name: 'API Development', level: 'advanced' },
    'restful apis': { name: 'RESTful APIs', level: 'advanced' },
    'graphql': { name: 'GraphQL', level: 'intermediate' },
    'cloud computing': { name: 'Cloud Computing (AWS/Azure/GCP)', level: 'advanced' },
    'aws': { name: 'AWS', level: 'advanced' },
    'azure': { name: 'Microsoft Azure', level: 'advanced' },
    'gcp': { name: 'Google Cloud Platform', level: 'advanced' },
    'docker': { name: 'Docker', level: 'advanced' },
    'kubernetes': { name: 'Kubernetes', level: 'advanced' },
    'ci/cd': { name: 'CI/CD Pipelines', level: 'advanced' },
    'git': { name: 'Git Version Control', level: 'expert' },
    'devops': { name: 'DevOps Principles', level: 'advanced' },
    'microservices': { name: 'Microservices Architecture', level: 'advanced' },
    'software testing': { name: 'Software Testing', level: 'intermediate' },
    'machine learning': { name: 'Machine Learning', level: 'expert' },
    'data science': { name: 'Data Science', level: 'expert' },
    // Business & Management
    'project management': { name: 'Project Management', level: 'intermediate' },
    'agile': { name: 'Agile Methodology', level: 'intermediate' },
    'scrum': { name: 'Scrum Master/Product Owner', level: 'intermediate' },
    'leadership': { name: 'Team Leadership', level: 'intermediate' },
    'team management': { name: 'Team Management', level: 'intermediate' },
    'people management': { name: 'People Management', level: 'intermediate' },
    'budget management': { name: 'Budget Management', level: 'intermediate' },
    'financial analysis': { name: 'Financial Analysis', level: 'advanced' },
    'data analysis': { name: 'Data Analysis', level: 'advanced' },
    'business analysis': { name: 'Business Analysis', level: 'advanced' },
    'product management': { name: 'Product Management', level: 'advanced' },
    'sales strategy': { name: 'Sales Strategy', level: 'advanced' },
    'negotiation': { name: 'Negotiation Skills', level: 'intermediate' },
    // General & Soft Skills
    'communication': { name: 'Communication Skills', level: 'intermediate' },
    'problem solving': { name: 'Problem Solving', level: 'intermediate' },
    'critical thinking': { name: 'Critical Thinking', level: 'intermediate' },
    'collaboration': { name: 'Team Collaboration', level: 'intermediate' },
    'customer service': { name: 'Customer Service', level: 'intermediate' },
    'stakeholder management': { name: 'Stakeholder Management', level: 'advanced' },
    // Design
    'ui design': { name: 'UI Design', level: 'advanced' },
    'ux design': { name: 'UX Design', level: 'advanced' },
    'figma': { name: 'Figma', level: 'advanced' },
    'adobe xd': { name: 'Adobe XD', level: 'advanced' },
    'sketch': { name: 'Sketch', level: 'advanced' },
    // Other
    'excel': { name: 'Microsoft Excel', level: 'advanced' },
    'powerpoint': { name: 'Microsoft PowerPoint', level: 'intermediate' },
    'data visualization': { name: 'Data Visualization', level: 'advanced' },
};

// --- Event Listeners ---
jobTextareas.forEach(textarea => {
    textarea.addEventListener('input', handleTextInput);
});

document.addEventListener('DOMContentLoaded', function() {
    // Generate auto requisition ID on page load
    const reqId = 'REQ-' + new Date().getFullYear() + '-' +
                  String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    document.getElementById('requisitionId').value = reqId;

    populateFormFromURLParams(); // Populate form from URL parameters

    // Initialize skill lists
    updateRequiredSkillsList();
    updateSkillSuggestions([]); // Show initial message and manage Add All button state

    // Check for source parameter to adjust back button and save button
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source');

    if (source === 'job-architecture') {
        // Adjust the "Home" button to act as "Back to Job Architecture"
        const homeButton = document.querySelector('header a[href="index.html"]'); // More specific selector
        if (homeButton) {
            homeButton.textContent = 'Back to Job Architecture';
            homeButton.href = '../aviation-wizard/index.html'; // Assumes create_with_ai.html is one level down from where aviation-wizard is
        } else {
            console.warn('Could not find the "Home" button in the header to update for Job Architecture flow.');
        }

        // Adjust the "Save & Return to Requisitions" button
        const saveButton = document.getElementById('saveAiJobDescriptionBtn');
        if (saveButton) {
            saveButton.textContent = 'Save & Return to Job Architecture';
            // The event listener for this button will be modified further down.
        }
    }
});

// --- Function to populate form from URL parameters ---
function populateFormFromURLParams() {
    const params = new URLSearchParams(window.location.search);
    const jobTitle = params.get('jobTitle');
    const jobLevel = params.get('jobLevel');
    // const skillsString = params.get('skills'); // Comma-separated: "Skill Name (Proficiency Name), ..."
    // Updated to use semicolon as separator from jobArchWizard
    const skillsString = params.get('skills'); 


    // Populate other fields from jobArchWizard if present
    const jobFamily = params.get('jobFamily');
    const department = params.get('department');
    const workLocation = params.get('workLocation');
    const roleGroup = params.get('roleGroup');
    const roleLevelName = params.get('roleLevelName');
    const roleSummary = params.get('roleSummary');
    const responsibilities = params.get('responsibilities');
    const yearsOfExperience = params.get('yearsOfExperience');

    if (jobTitle && jobTitleInput) {
        jobTitleInput.value = jobTitle;
    }

    if (jobLevel && jobLevelSelect) {
        // Attempt to match jobLevel with an option value.
        let matched = false;
        for (let i = 0; i < jobLevelSelect.options.length; i++) {
            // Try matching by value or by text content (e.g. L3 vs "L3")
            if (jobLevelSelect.options[i].value.toLowerCase() === jobLevel.toLowerCase() || 
                jobLevelSelect.options[i].textContent.toLowerCase() === jobLevel.toLowerCase()) {
                jobLevelSelect.value = jobLevelSelect.options[i].value;
                matched = true;
                break;
            }
        }
        if (!matched) {
            console.warn(`Job level "${jobLevel}" not found in select options. It will not be pre-filled.`);
        }
    }

    // Populate new fields if they exist in the form and params
    if (department && departmentSelect) {
         // Attempt to match department with an option value.
        let matched = false;
        for (let i = 0; i < departmentSelect.options.length; i++) {
            if (departmentSelect.options[i].value.toLowerCase() === department.toLowerCase()) {
                departmentSelect.value = departmentSelect.options[i].value;
                matched = true;
                break;
            }
        }
        if (!matched) { // If not found, try to add it if it's a free text or has an "Other" option
            console.warn(`Department "${department}" not found in select options.`);
        }
    }
    if (workLocation && locationInput) locationInput.value = workLocation; // Assuming locationInput is for workLocation
    if (roleSummary && jobSummaryTextarea) jobSummaryTextarea.value = roleSummary;
    if (responsibilities && responsibilitiesTextarea) responsibilitiesTextarea.value = responsibilities;
    // Note: jobFamily, roleGroup, roleLevelName, yearsOfExperience don't have direct inputs in the provided create_with_ai.js
    // These would typically be part of the job description text or used by the AI.
    // For now, we can log them or append to qualifications if needed.
    let additionalDetailsForQualifications = [];
    if (jobFamily) additionalDetailsForQualifications.push(`Job Family: ${jobFamily}`);
    if (roleGroup) additionalDetailsForQualifications.push(`Role Group: ${roleGroup}`);
    if (roleLevelName) additionalDetailsForQualifications.push(`Role Level Name: ${roleLevelName}`);
    if (yearsOfExperience) additionalDetailsForQualifications.push(`Years of Experience: ${yearsOfExperience}`);


    if (skillsString) {
        const skillsArray = skillsString.split(';').map(s => s.trim()).filter(s => s); // Split by semicolon and filter empty
        let unaddedSkillsForQualifications = [];

        skillsArray.forEach(skillStringWithProf => {
            // Extract skill name, assuming format "Skill Name (Proficiency Name)"
            // This is a simple parsing; more robust parsing might be needed if format varies.
            const match = skillStringWithProf.match(/^(.*?)\s*\((.*?)\)$/);
            let skillNameFromWizard = skillStringWithProf; // Default to full string if no proficiency found
            // let proficiencyNameFromWizard = ''; // We are not using this directly for adding to skillDatabase
            
            if (match && match[1]) {
                skillNameFromWizard = match[1].trim();
                // proficiencyNameFromWizard = match[2].trim(); // Available if needed later
            }
            
            let foundInLocalDB = false;
            // Attempt to find the skill in the local skillDatabase by name
            for (const key in skillDatabase) {
                const dbSkill = skillDatabase[key];
                // Normalize both for comparison (e.g., lowercase)
                if (dbSkill.name.toLowerCase() === skillNameFromWizard.toLowerCase()) {
                    addSkill(dbSkill.name, dbSkill.level, null); // Add to structured list
                    foundInLocalDB = true;
                    break;
                }
            }

            if (!foundInLocalDB) {
                unaddedSkillsForQualifications.push(skillStringWithProf); // Keep original string with proficiency
            }
        });

        if (unaddedSkillsForQualifications.length > 0 && qualificationsTextarea) {
            const currentQualifications = qualificationsTextarea.value;
            let newQualificationsText = currentQualifications ? currentQualifications + '\n\n' : '';

            if (additionalDetailsForQualifications.length > 0) {
                newQualificationsText += 'Additional Job Details (from Wizard):\n- ' + additionalDetailsForQualifications.join('\n- ') + '\n\n';
            }

            if (unaddedSkillsForQualifications.length > 0) {
                const skillsFormatted = unaddedSkillsForQualifications.join('\n- ');
                newQualificationsText += 'Additional Mapped Skills (from Wizard):\n- ' + skillsFormatted;
            }
            qualificationsTextarea.value = newQualificationsText.trim();
        } else if (additionalDetailsForQualifications.length > 0 && qualificationsTextarea) {
             qualificationsTextarea.value = (qualificationsTextarea.value ? qualificationsTextarea.value + '\n\n' : '') +
                                           'Additional Job Details (from Wizard):\n- ' + 
                                           additionalDetailsForQualifications.join('\n- ');
        }
        
        // Trigger AI analysis if text areas are populated (or skills were added)
        handleTextInput(); 
    } else if (additionalDetailsForQualifications.length > 0 && qualificationsTextarea) { // If no skills, but other details
         qualificationsTextarea.value = (qualificationsTextarea.value ? qualificationsTextarea.value + '\n\n' : '') +
                                       'Additional Job Details (from Wizard):\n- ' + 
                                       additionalDetailsForQualifications.join('\n- ');
        handleTextInput(); // Still trigger analysis if other details were added
    }
}

// --- Core Functions ---
function handleTextInput() {
    typingIndicator.classList.add('active');
    analysisText.textContent = '🤖 AI is analyzing your text...';
    analysisText.classList.add('analyzing');

    clearTimeout(analysisTimeout);
    analysisTimeout = setTimeout(() => {
        const combinedText = Array.from(jobTextareas)
            .map(ta => ta.value)
            .join(' ')
            .toLowerCase();

        analyzeText(combinedText);
        typingIndicator.classList.remove('active');
        analysisText.textContent = '✅ Analysis complete - Skills identified';
        analysisText.classList.remove('analyzing');
    }, 1500);
}

function analyzeText(text) {
    if (!text.trim()) {
        updateSkillSuggestions([]);
        return;
    }

    const detectedSkills = new Set();
    for (const keyword in skillDatabase) {
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        if (regex.test(text)) {
            detectedSkills.add(skillDatabase[keyword]);
        }
    }
    updateSkillSuggestions(Array.from(detectedSkills));
}

function updateSkillSuggestions(skills) {
    if (skills.length === 0) {
        skillSuggestionsContainer.innerHTML = `
            <div style="text-align: center; color: #6c757d; padding: 20px; font-style: italic;">
                No specific skills detected yet. Keep typing or add more details.
            </div>`;
        addAllSkillsButton.disabled = true; // Disable if no suggestions
        return;
    }

    skills.sort((a, b) => {
        const levelOrder = { expert: 0, advanced: 1, intermediate: 2 };
        return levelOrder[a.level] - levelOrder[b.level];
    });

    let allSuggestionsAlreadyAdded = true;

    const levelColorClasses = {
        expert: 'bg-red-100 text-red-700 border-red-300',
        advanced: 'bg-sky-100 text-sky-700 border-sky-300', // Changed from blue to sky for better contrast with indigo button
        intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    };
    const buttonBaseClasses = "font-medium py-1 px-2.5 rounded-md text-xs transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1";
    const addButtonClasses = `${buttonBaseClasses} bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-400`;
    const addedButtonClasses = `${buttonBaseClasses} bg-green-500 text-white cursor-not-allowed`;


    skillSuggestionsContainer.innerHTML = skills.map(skill => {
        const isAdded = addedSkills.has(skill.name);
        if (!isAdded) {
            allSuggestionsAlreadyAdded = false;
        }
        const proficiencyBadgeClasses = `text-xs font-semibold px-2 py-0.5 rounded-full ${levelColorClasses[skill.level] || 'bg-gray-100 text-gray-700 border-gray-300'}`;

        return `
            <div class="skill-item flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm mb-2 hover:shadow-md transition-shadow duration-150" 
                 data-skill-name="${skill.name}" data-skill-level="${skill.level}">
                <div class="flex-grow">
                    <div class="skill-name font-semibold text-gray-800 text-sm">${skill.name}</div>
                </div>
                <div class="flex items-center">
                    <span class="skill-level-badge mr-3 ${proficiencyBadgeClasses}">${capitalizeFirst(skill.level)}</span>
                    <button class="add-skill-btn ${isAdded ? addedButtonClasses : addButtonClasses}" 
                            onclick="addSkill('${skill.name}', '${skill.level}', this)"
                            ${isAdded ? 'disabled' : ''}>
                        ${isAdded ? '✓ Added' : '+ Add'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    addAllSkillsButton.disabled = allSuggestionsAlreadyAdded;
}

function addSkill(skillName, level, buttonElement) {
    if (addedSkills.has(skillName)) return;

    addedSkills.add(skillName);
    updateRequiredSkillsList();
    
    const buttonBaseClasses = "font-medium py-1 px-2.5 rounded-md text-xs transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1";
    const addButtonClasses = `${buttonBaseClasses} bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-400`;
    const addedButtonClasses = `${buttonBaseClasses} bg-green-500 text-white cursor-not-allowed`;

    if (buttonElement) { // From individual add button
        buttonElement.textContent = '✓ Added';
        buttonElement.disabled = true;
        // Remove old classes, add new ones
        buttonElement.className = `add-skill-btn ${addedButtonClasses}`; // Overwrite classes
        // No need to add 'added' to skill-item as styling is now on button
    } else { // From "Add All" or programmatic add
        const skillItemDiv = skillSuggestionsContainer.querySelector(`.skill-item[data-skill-name="${skillName}"]`);
        if (skillItemDiv) {
            const individualButton = skillItemDiv.querySelector('.add-skill-btn');
            if (individualButton) {
                individualButton.textContent = '✓ Added';
                individualButton.disabled = true;
                individualButton.className = `add-skill-btn ${addedButtonClasses}`; // Overwrite classes
            }
        }
    }
    showNotification(`Added "${skillName}" to required skills.`);
    checkAndDisableAddAllButton(); // Check state of Add All button
}

function removeSkill(skillName) {
    addedSkills.delete(skillName);
    updateRequiredSkillsList();

    const skillItemDiv = skillSuggestionsContainer.querySelector(`.skill-item[data-skill-name="${skillName}"]`);
    if (skillItemDiv) {
        const button = skillItemDiv.querySelector('.add-skill-btn');
        if (button) {
            button.textContent = '+ Add';
            button.disabled = false;
            const buttonBaseClasses = "font-medium py-1 px-2.5 rounded-md text-xs transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1";
            const addButtonClasses = `${buttonBaseClasses} bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-400`;
            button.className = `add-skill-btn ${addButtonClasses}`; // Reset to add button classes
        }
    }
    showNotification(`Removed "${skillName}" from required skills.`, 'info');
    checkAndDisableAddAllButton(); // Check state of Add All button
}

function addAllSuggestedSkills() {
    const suggestedItems = skillSuggestionsContainer.querySelectorAll('.skill-item:not(.added)'); // Get only those not yet added
    let countAdded = 0;
    suggestedItems.forEach(item => {
        const skillName = item.dataset.skillName;
        const skillLevel = item.dataset.skillLevel;
        if (!addedSkills.has(skillName)) {
            addSkill(skillName, skillLevel, null); // Pass null as buttonElement
            countAdded++;
        }
    });
    if (countAdded > 0) {
        showNotification(`Added ${countAdded} skill(s) to required skills.`, 'success');
    } else {
        showNotification(`All suggested skills are already added.`, 'info');
    }
    addAllSkillsButton.disabled = true; // Disable after adding all
}

function checkAndDisableAddAllButton() {
    const suggestedItems = skillSuggestionsContainer.querySelectorAll('.skill-item');
    if (suggestedItems.length === 0) { // No suggestions available
        addAllSkillsButton.disabled = true;
        return;
    }
    let allAdded = true;
    suggestedItems.forEach(item => {
        if (!item.classList.contains('added')) {
            allAdded = false;
        }
    });
    addAllSkillsButton.disabled = allAdded;
}


function updateRequiredSkillsList() {
    if (addedSkills.size === 0) {
        skillsListContainer.innerHTML = `
            <div class="empty-skills text-sm text-gray-500 italic p-3">
                No skills added yet. Use AI suggestions or type in qualifications.
            </div>`;
        return;
    }
    
    const levelColorClasses = { // Re-define or ensure scope if defined globally
        expert: 'bg-red-100 text-red-700 border-red-300',
        advanced: 'bg-sky-100 text-sky-700 border-sky-300',
        intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    };

    skillsListContainer.innerHTML = Array.from(addedSkills).map(skillName => {
        let skillLevel = 'intermediate'; // Default
        // Find the skill in skillDatabase to get its original level
        const skillData = Object.values(skillDatabase).find(s => s.name === skillName);
        if (skillData) {
            skillLevel = skillData.level;
        }
        
        const proficiencyBadgeClasses = `text-xs font-semibold px-2 py-0.5 rounded-full ${levelColorClasses[skillLevel] || 'bg-gray-100 text-gray-700 border-gray-300'}`;

        return `
            <div class="skill-tag flex items-center justify-between bg-indigo-500 text-white text-sm font-medium px-3 py-1.5 rounded-md mb-2 shadow-sm">
                <span>${skillName}</span>
                <div class="flex items-center">
                    <span class="skill-level-badge-main mr-2 ${proficiencyBadgeClasses} !text-xs !py-0.5 !px-1.5">${capitalizeFirst(skillLevel)}</span>
                    <button class="remove-skill-btn bg-transparent hover:bg-indigo-400 text-white font-bold p-1 rounded-full leading-none" 
                            onclick="removeSkill('${skillName}')" title="Remove ${skillName}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// --- Utility Functions ---
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    let backgroundColor = 'linear-gradient(135deg, #003366 0%, #862633 100%)';
    if (type === 'info') {
        backgroundColor = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
    } else if (type === 'error') {
        backgroundColor = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
    }

    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 500;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 50);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// --- Demo Data Population ---
function populateDemoData() {
    addedSkills.clear();

    jobTitleInput.value = 'Senior Marketing Manager';
    departmentSelect.value = 'Marketing';
    jobLevelSelect.value = 'Senior Manager';
    employmentTypeSelect.value = 'Full-time';
    locationInput.value = 'San Francisco, CA';
    hiringManagerInput.value = 'Jane Doe';

    jobSummaryTextarea.value = `
We are seeking an experienced Senior Marketing Manager to lead our dynamic marketing team.
The ideal candidate will be responsible for developing and executing comprehensive marketing strategies to drive brand awareness, customer acquisition, and revenue growth.
This role requires strong leadership skills and a deep understanding of digital marketing, content strategy, and marketing analytics.
            `.trim();

    responsibilitiesTextarea.value = `
- Develop and implement innovative marketing campaigns across multiple channels (digital, social media, email).
- Manage and mentor a team of marketing specialists, fostering a collaborative and high-performing environment.
- Oversee the creation of engaging content for various platforms, ensuring brand consistency.
- Analyze marketing data and campaign performance to identify trends, optimize strategies, and report on ROI.
- Manage the marketing budget effectively, ensuring optimal allocation of resources.
- Collaborate with sales and product teams to align marketing efforts with business objectives.
- Stay up-to-date with industry trends and emerging technologies in marketing.
- Key skills include project management, SEO, and CRM proficiency.
            `.trim();

    qualificationsTextarea.value = `
- Bachelor's degree in Marketing, Business Administration, or a related field. MBA preferred.
- 7+ years of experience in marketing, with at least 3 years in a leadership role.
- Proven track record of developing and executing successful marketing campaigns.
- Expertise in digital marketing, including SEO/SEM, social media marketing, and email marketing.
- Strong analytical skills and experience with marketing analytics tools (e.g., Google Analytics).
- Excellent communication, presentation, and interpersonal skills.
- Experience with CRM systems (e.g., Salesforce) and marketing automation platforms.
            `.trim();

    handleTextInput(); // This will also call updateSkillSuggestions which manages the Add All button
    showNotification('Demo data loaded and AI analysis initiated!', 'info');
}

// --- Save and Return Functionality ---
const saveAiJobDescriptionBtn = document.getElementById('saveAiJobDescriptionBtn');

if (saveAiJobDescriptionBtn) {
    saveAiJobDescriptionBtn.addEventListener('click', function() {
        const currentUrlParams = new URLSearchParams(window.location.search);
        const source = currentUrlParams.get('source');
        const wizardJobId = currentUrlParams.get('jobId');     // Expected from wizard, used as jobId_ai later
        // const wizardGroupId = currentUrlParams.get('groupId'); // groupId is not explicitly used in the return to aviation-wizard for this flow

        // 1. Gather all form data
        const jobData = {
            jobTitle: jobTitleInput.value,
            requisitionId: document.getElementById('requisitionId').value,
            department: departmentSelect.value,
            businessUnit: document.getElementById('businessUnit') ? document.getElementById('businessUnit').value : '',
            jobLevel: jobLevelSelect.value, // This is the descriptive name, e.g., "Senior Manager"
            employmentType: employmentTypeSelect.value,
            location: locationInput.value,
            salaryMin: document.getElementById('salaryMin') ? document.getElementById('salaryMin').value : '',
            salaryMax: document.getElementById('salaryMax') ? document.getElementById('salaryMax').value : '',
            hiringManager: hiringManagerInput.value,
            recruiter: document.getElementById('recruiter') ? document.getElementById('recruiter').value : '',
            jobSummary: jobSummaryTextarea.value,
            responsibilities: responsibilitiesTextarea.value,
            qualifications: qualificationsTextarea.value, // This is the "Additional Qualifications / Experience"
            benefits: document.getElementById('benefits') ? document.getElementById('benefits').value : '',
            // Convert addedSkills (Set of names) to a string of "Name (Level)" for URL params
            skills: Array.from(addedSkills).map(skillName => {
                const skillDetail = Object.values(skillDatabase).find(s => s.name === skillName);
                const skillLevel = skillDetail ? skillDetail.level : 'intermediate'; // Default if somehow not found
                return `${skillName} (${skillLevel})`;
            }).join(';'),
        };

        console.log('Saving AI Job Description Data:', jobData);
        localStorage.setItem('aiGeneratedJobData', JSON.stringify(jobData));
        showNotification('Job description data saved!', 'success');

        // Navigate back to the job architecture page
        window.location.href = 'jobarch01/index.html';
    });
}
