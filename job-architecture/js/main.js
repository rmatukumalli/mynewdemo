import { openModal, closeModal } from './utils.js';

const steps = [
    { id: 1, name: 'organization', title: '&nbsp;Organization&nbsp;' },
    { id: 2, name: 'business-units', title: '&nbsp;Business Units&nbsp;' },
    { id: 3, name: 'departments', title: '&nbsp;Departments&nbsp;' },
    { id: 4, name: 'job-families', title: '&nbsp;Job Families&nbsp;' },
    { id: 5, name: 'job-levels', title: '&nbsp;Job Levels&nbsp;' },
    { id: 6, name: 'ai-wizard', title: '&nbsp;AI Wizard&nbsp;', isAIPowered: true },
    { id: 7, name: 'job-profiles', title: '&nbsp;Job Profiles&nbsp;', isAIPowered: true },
    { id: 8, name: 'skill-gaps', title: '&nbsp;Skill Gaps&nbsp;', isAIPowered: true },
    { id: 9, name: 'career-paths', title: '&nbsp;Career Paths&nbsp;', isAIPowered: true },
    { id: 10, name: 'review-ai', title: '&nbsp;Review & AI&nbsp;', isAIPowered: true },
];
let currentStep = 1;

const stepperEl = document.getElementById('stepper');
const contentWrapper = document.getElementById('wizard-content-wrapper');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const finishBtn = document.getElementById('finish-btn');

function initStepper() {
    stepperEl.innerHTML = steps.map((step, index) => `
        <button data-step="${step.id}" class="stepper-tab flex-shrink-0 flex items-center justify-center gap-1 px-1 py-1 rounded-md border-b-2 border-transparent bg-slate-100 hover:bg-slate-200 ${step.isAIPowered ? 'ai-powered' : ''} scroll-snap-align-start">
            <span class="step-marker flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full font-bold text-xs">${step.id}</span>
            <span class="font-semibold text-xs text-center">${step.title}</span>
        </button>
        ${index < steps.length - 1 ? '<div class="h-px flex-shrink-0 w-2 bg-slate-300"></div>' : ''}
    `).join('');
}

const appData = {}; // Initialize as empty, will be populated from JSON

async function loadAppData() {
    try {
        const response = await fetch('/job-architecture/data/consolidated-mock-data.json');
        if (!response.ok) {
            throw new Error(`Could not load consolidated mock data: ${response.statusText}`);
        }
        const data = await response.json();
        Object.assign(appData, data); // Merge loaded data into appData

        // Generate career paths based on the loaded jobs_skills data
        appData.career_paths = generateCareerPaths(appData);

        console.log("App Data loaded:", appData);
    } catch (error) {
        console.error("Failed to load app data:", error);
        alert("Failed to load initial application data. Please check console for details.");
        // Fallback to empty arrays or minimal data if loading fails
        appData.organizations = [];
        appData.business_units = [];
        appData.departments = [];
        appData.role_groups = [];
        appData.job_levels = [];
        appData.jobs_skills = [];
        appData.ai_wizard = [];
        appData.skill_gaps = [];
        appData.career_paths = [];
    }
}

function generateCareerPaths(data) {
    let careerPaths = [];
    const roleGroups = {};

    // Group jobs by role group
    data.jobs_skills.forEach(job => {
        // Find the corresponding job level to get the role_group_id
        const jobLevel = data.job_levels.find(jl => jl.level_name === job.job_title);
        if (jobLevel && jobLevel.role_group_id) {
            if (!roleGroups[jobLevel.role_group_id]) {
                roleGroups[jobLevel.role_group_id] = [];
            }
            roleGroups[jobLevel.role_group_id].push(job);
        }
    });

    // Create paths within each role group
    for (const groupId in roleGroups) {
        const jobsInGroup = roleGroups[groupId];
        // Sort jobs by level number to ensure correct progression
        jobsInGroup.sort((a, b) => {
            const levelA = data.job_levels.find(jl => jl.level_name === a.job_title)?.level_number || '';
            const levelB = data.job_levels.find(jl => jl.level_name === b.job_title)?.level_number || '';
            
            const extractParts = (s) => {
                const match = s.match(/([A-Z]+)(\d+)/);
                return match ? [match[1], parseInt(match[2])] : [s, 0];
            };
            const [prefixA, numA] = extractParts(levelA);
            const [prefixB, numB] = extractParts(levelB);

            if (prefixA !== prefixB) {
                return prefixA.localeCompare(prefixB);
            }
            return numA - numB;
        });

        for (let i = 0; i < jobsInGroup.length - 1; i++) {
            const fromJob = jobsInGroup[i];
            const toJob = jobsInGroup[i + 1];
            careerPaths.push({
                id: `cp_${fromJob.id}_${toJob.id}`,
                from_job_id: fromJob.id,
                to_job_id: toJob.id,
                competency_match: Math.floor(Math.random() * 30) + 70, // 70-99%
                development_plan: `Complete ${toJob.job_title} training modules.`,
                mentorship_availability: 'Available'
            });
        }
    }
    return careerPaths;
}

async function loadStepContent(stepId) {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    const header = document.querySelector('header');
    if (header) {
        if (step.name === 'career-paths') {
            header.style.display = 'none';
        } else {
            header.style.display = 'flex';
        }
    }

    try {
        const response = await fetch(`/job-architecture/tabs/${step.name}.html`);
        if (!response.ok) {
            throw new Error(`Could not load tab content for ${step.name}`);
        }
        const html = await response.text();
        console.log(`Loading content for step ${step.name}. HTML length: ${html.length}`);
        contentWrapper.innerHTML = html;

        const module = await import(`./modules/${step.name}.js`);
        console.log(`Module loaded for step ${step.name}:`, module);
        const moduleName = `${step.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Module`;

        const navigation = {
            navigateToStep: (stepId) => {
                const stepToGo = parseInt(stepId, 10);
                if (stepToGo !== currentStep) {
                    currentStep = stepToGo;
                    updateWizardState();
                }
            }
        };

        if (step.name === 'career-paths') {
            const titleElement = contentWrapper.querySelector('#career-path-title');
            if (titleElement) {
                const lastJob = appData.jobs_skills[appData.jobs_skills.length - 1];
                if (lastJob && lastJob.job_title) {
                    titleElement.textContent = `Potential Career Paths for ${lastJob.job_title}`;
                }
            }
            if (window.initializeJobArchitectureCareerPaths) {
                window.initializeJobArchitectureCareerPaths();
            }
        } else if (step.name === 'review-ai') {
            if (window.reviewAIModule && window.reviewAIModule.init) {
                window.reviewAIModule.init(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper, navigation);
            }
        } else if (window[moduleName] && window[moduleName].init) {
            window[moduleName].init(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper, navigation);
        } else if (module.default && module.default.init) {
            module.default.init(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper, navigation);
        } else {
            const stepModule = Object.values(module).find(m => m && m.init);
            if (stepModule) {
                stepModule.init(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper, navigation);
            } else {
                 console.warn(`No initialized module found for step: ${step.name}`);
            }
        }
    } catch (error) {
        console.error(`Error loading step ${step.name}:`, error);
        contentWrapper.innerHTML = `<p class="text-red-500">Error: Content for step "${step.name}" could not be loaded.</p>`;
    }
}

function getFormHTML(sections) {
    return Object.entries(sections).map(([title, fields]) => `
        <div class="mb-6">
            <h3 class="text-lg font-semibold border-b pb-2 mb-3 capitalize">${title.replace('_', ' ')}</h3>
            ${fields.map(field => `
                <div class="mb-4">
                    <label for="form-${field.id}" class="block text-sm font-medium text-slate-700 mb-1">${field.label}</label>
                    ${field.type === 'textarea' ?
                        `<textarea id="form-${field.id}" rows="${field.rows || 3}" class="w-full p-2 border border-slate-300 rounded-md">${field.value || ''}</textarea>` :
                    field.type === 'select' ?
                        `<select id="form-${field.id}" class="w-full p-2 border border-slate-300 rounded-md bg-white">
                            ${field.options.map(opt => `<option value="${opt.value}" ${opt.value === field.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                        </select>` :
                    field.type === 'checkbox' ?
                        `<input type="checkbox" id="form-${field.id}" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" ${field.value ? 'checked' : ''}>` :
                        `<input type="${field.type || 'text'}" id="form-${field.id}" value="${field.value || ''}" class="w-full p-2 border border-slate-300 rounded-md">`
                    }
                </div>
            `).join('')}
        </div>
    `).join('');
}

async function callAPI(endpoint, method, body = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(endpoint, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.detail || JSON.stringify(errorData)}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error calling API ${endpoint}:`, error);
        throw error;
    }
}

function updateWizardState() {
    document.querySelectorAll('.stepper-tab').forEach(tab => {
        const step = parseInt(tab.dataset.step, 10);
        tab.classList.toggle('active', step === currentStep);
        tab.classList.toggle('completed', step < currentStep);
    });
    
    loadStepContent(currentStep);

    backBtn.disabled = currentStep === 1;

    if (currentStep === steps.length) {
        nextBtn.classList.add('hidden');
        finishBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        finishBtn.classList.add('hidden');
    }
}

// Navigation Listeners
nextBtn.addEventListener('click', () => {
    if (currentStep < steps.length) {
        currentStep++;
        updateWizardState();
    } else {
        // This case is now handled by the finish button's onclick event
    }
});

backBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateWizardState();
    }
});

document.addEventListener('click', (e) => {
    const stepButton = e.target.closest('.stepper-tab[data-step]');
    if (stepButton) {
        const stepToGo = parseInt(stepButton.dataset.step, 10);
        console.log(`Clicked step: ${stepToGo}, Current step: ${currentStep}`);
        if (stepToGo !== currentStep) {
            currentStep = stepToGo;
            updateWizardState();
        }
    }
});

export function goToFirstStep() {
    currentStep = 1;
    updateWizardState();
}

// Initial Load
document.addEventListener('DOMContentLoaded', async () => {
    await loadAppData(); // Load data before initializing stepper and state
    initStepper();
    updateWizardState();

    const stepperContainerWrapper = document.querySelector('.stepper-container-wrapper');
    const stepper = document.getElementById('stepper');

    function updateFadeShadows() {
        if (!stepperContainerWrapper || !stepper) return;

        const { scrollWidth, clientWidth, scrollLeft } = stepper;
        const isScrollable = scrollWidth > clientWidth;

        stepperContainerWrapper.classList.toggle('show-left-fade', isScrollable && scrollLeft > 0);
        stepperContainerWrapper.classList.toggle('show-right-fade', isScrollable && scrollLeft + clientWidth < scrollWidth);
    }

    // Initial check and update on load
    updateFadeShadows();

    // Update on scroll
    stepper.addEventListener('scroll', updateFadeShadows);

    // Update on window resize (in case scrollability changes)
    window.addEventListener('resize', updateFadeShadows);

    const jobArchitectureHeading = document.getElementById('job-architecture-heading');
    if (jobArchitectureHeading) {
        jobArchitectureHeading.addEventListener('click', goToFirstStep);
    }
});
