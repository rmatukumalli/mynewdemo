import { openModal, closeModal, getFormHTML } from './utils.js';

const steps = [
    { id: 1, name: 'organization', title: 'Organization' },
    { id: 2, name: 'business_units', title: 'Business Units' },
    { id: 3, name: 'departments', title: 'Departments' },
    { id: 4, name: 'role_groups', title: 'Role Groups' },
    { id: 5, name: 'job_levels', title: 'Job Levels' },
    { id: 6, name: 'jobs_skills', title: 'Add Jobs & Skills' },
    { id: 7, name: 'skill_gaps', title: 'Skill Gaps' },
    { id: 8, name: 'career_paths', title: 'Career Paths' },
    { id: 9, name: 'review_ai', title: 'Review & AI' },
];
let currentStep = 1;
let appData = {}; // Global data store

const stepperEl = document.getElementById('stepper');
const contentWrapper = document.getElementById('wizard-content-wrapper');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');

function initStepper() {
    stepperEl.innerHTML = steps.map(step => `
        <button data-step="${step.id}" class="stepper-tab flex-1 px-4 py-2 text-center font-semibold text-sm text-slate-600 border-b-2 border-transparent hover:bg-slate-50 hover:border-slate-300">
            ${step.title}
        </button>
    `).join('');
}

async function loadStepContent(stepId) {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    // Fetch the partial HTML for the step
    const response = await fetch(`/step/${step.name}`);
    contentWrapper.innerHTML = await response.text();

    // Dynamically import the corresponding JS module
    try {
        const module = await import(`./${step.name}.js`);
        if (module.init) {
            console.log(`Initializing step ${step.name} with appData:`, appData);
            // Pass appData and utility functions to the init function of each step
            module.init(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper);
        }
    } catch (error) {
        console.warn(`No JS module found for step: ${step.name}`, error);
    }
}

// Generic API call utility
async function callAPI(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    try {
        const response = await fetch(endpoint, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API call failed with status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error calling API endpoint ${endpoint}:`, error);
        throw error;
    }
}

async function updateWizardState() {
    // Fetch latest data from backend first
    try {
        const response = await fetch('/api/data');
        appData = await response.json();
    } catch (error) {
        console.error('Failed to fetch app data:', error);
        // Optionally, show an error message to the user
    }

    // Then, update the UI and load the step content
    document.querySelectorAll('.stepper-tab').forEach(tab => {
        const step = parseInt(tab.dataset.step, 10);
        tab.classList.remove('active', 'completed');
        if (step === currentStep) {
            tab.classList.add('active');
        } else if (step < currentStep) {
            tab.classList.add('completed');
        }
    });
    
    await loadStepContent(currentStep);

    backBtn.disabled = currentStep === 1;
    nextBtn.textContent = (currentStep === steps.length) ? 'Finish' : 'Next Step';
}

// Navigation Listeners
nextBtn.addEventListener('click', () => {
    if (currentStep < steps.length) {
        currentStep++;
        updateWizardState();
    }
});

backBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateWizardState();
    }
});

stepperEl.addEventListener('click', (e) => {
    const stepButton = e.target.closest('button[data-step]');
    if (stepButton) {
        const stepToGo = parseInt(stepButton.dataset.step, 10);
        currentStep = stepToGo;
        updateWizardState();
    }
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    initStepper();
    updateWizardState();
});
