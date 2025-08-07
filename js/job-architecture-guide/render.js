import { state, GUIDE_STEPS, updateGuideState } from './state.js';
import { handlers } from './handlers.js'; // Will be created next, but import for event listeners

// --- DOM Elements ---
const stepperContainer = document.getElementById('stepper-container');
const stepContentContainer = document.getElementById('step-content');
const navigationContainer = document.getElementById('navigation-container');
// const completionMessageContainer = document.getElementById('completion-message'); // If we add a completion message like the original

// --- Icon SVGs (Equivalent to Lucide React icons) ---
// Function to generate SVG for given icon name and classes
export function getSvgIcon(iconName, classes = '') {
    const icons = {
        BookOpen: `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
        Users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
        Target: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
        TrendingUp: `<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>`,
        GitBranch: `<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>`,
        Brain: `<path d="M12 5c-3.7 0-6.84 2.87-7.07 6C4.83 14.16 7 19 12 19c4.27 0 7.33-4.71 7.07-8A7.26 7.26 0 0 0 12 5Z"/><path d="M12 5v14"/><path d="M12 11c1.23-.74 2.8-1.7 4-2A7.26 7.26 0 0 1 12 5"/><path d="M12 11c-1.23-.74-2.8-1.7-4-2A7.26 7.26 0 0 0 12 5"/><path d="M12 13c1.23.74 2.8 1.7 4 2a7.26 7.26 0 0 1-4 4"/><path d="M12 13c-1.23-.74-2.8-1.7-4 2a7.26 7.26 0 0 1-4-4"/>`,
        ChevronRight: `<path d="m9 18 6-6-6-6"/>`,
        ChevronLeft: `<path d="m15 18-6-6 6-6"/>`,
        CheckCircle: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>`,
        Play: `<polygon points="5 3 19 12 5 21 5 3"/>`,
        Lightbulb: `<path d="M15 14c.2-.84.5-1.54.9-2.2-.45-.08-.87-.23-1.2-.4-.72-.34-1.42-.8-1.92-1.44A7.47 7.47 0 0 1 12 5c-3.1 0-5.7 2.3-6.6 5.8C4.5 13.5 4 15.3 4 17a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2c0-1.5-.5-3.1-1-4.9Z"/><path d="M8 22h8"/><path d="M12 19v3"/>`,
        ArrowRight: `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`,
        Star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
        Eye: `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`,
        HelpCircle: `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>`
    };
    const path = icons[iconName] || ''; // Fallback to empty if icon not found
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${iconName.toLowerCase()} ${classes}">${path}</svg>`;
}


// --- Stepper Rendering ---
export function renderStepper() {
    if (!stepperContainer) return;
    let stepperHTML = '';
    GUIDE_STEPS.forEach((step, index) => {
        const stepNumber = index + 1;
        const isActive = state.currentStep === step.id;
        const isCompleted = state.completedSteps.has(step.id);
        
        let statusClass = 'bg-slate-200 text-slate-500'; // Default for future steps
        let icon = `<span class="text-sm font-semibold">${stepNumber}</span>`;

        if (isActive) {
            statusClass = 'bg-blue-500 text-white';
            icon = getSvgIcon('Play', 'w-4 h-4');
        } else if (isCompleted) {
            statusClass = 'bg-green-500 text-white';
            icon = getSvgIcon('CheckCircle', 'w-4 h-4');
        }

        stepperHTML += `
            <div class="flex items-center ${stepNumber < GUIDE_STEPS.length ? 'flex-1' : ''}">
                <button 
                    data-step-id="${step.id}"
                    class="stepper-dot flex flex-col items-center justify-center w-10 h-10 rounded-full ${statusClass} transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Go to step ${stepNumber}: ${step.shortTitle}"
                >
                    ${icon}
                </button>
                <div class="text-center ml-2 mr-2 min-w-[80px] max-w-[120px] ${isActive ? 'text-blue-600 font-semibold' : 'text-slate-600'}">
                    <p class="text-xs truncate" title="${step.shortTitle}">${step.shortTitle}</p>
                </div>
                ${stepNumber < GUIDE_STEPS.length ? '<div class="flex-1 h-0.5 bg-slate-300"></div>' : ''}
            </div>
        `;
    });
    stepperContainer.innerHTML = stepperHTML;

    // Add event listeners to stepper dots
    stepperContainer.querySelectorAll('.stepper-dot').forEach(dot => {
        dot.addEventListener('click', handlers.handleStepperClick);
    });
}

// --- Step Content Rendering ---
export function renderStepContent() {
    if (!stepContentContainer) return;

    const currentStepData = GUIDE_STEPS.find(s => s.id === state.currentStep);
    if (!currentStepData) {
        stepContentContainer.innerHTML = '<p class="text-red-500">Error: Step content not found.</p>';
        return;
    }

    let contentHTML = '';

    if (currentStepData.id === GUIDE_STEPS[GUIDE_STEPS.length - 1].id) { // Last step is "Key Takeaways"
        contentHTML = `
            <div class="flex items-center mb-6">
                <div class="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mr-4 shrink-0">
                    ${getSvgIcon('Star', 'w-6 h-6 text-purple-600')}
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">${currentStepData.title}</h2>
                    <p class="text-gray-600">${currentStepData.subtitle}</p>
                </div>
            </div>
            <div class="prose max-w-none text-gray-800 prose-headings:text-gray-800 prose-strong:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-700">
                ${currentStepData.content.summary}
            </div>
        `;
    } else { // Regular learning steps
        contentHTML = `
            <div class="flex items-center mb-6">
                <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mr-4 shrink-0">
                    <span class="text-xl font-bold text-blue-600">${currentStepData.id}</span>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">${currentStepData.title}</h2>
                    <p class="text-gray-600">${currentStepData.subtitle}</p>
                </div>
            </div>

            <div class="space-y-6">
                <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                    <div class="flex items-start">
                        ${getSvgIcon('Lightbulb', 'w-5 h-5 text-blue-600 mr-3 mt-1 shrink-0')}
                        <div>
                            <h3 class="font-semibold text-blue-800 mb-1">What This Means</h3>
                            <p class="text-blue-700">${currentStepData.content.explanation}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                    <div class="flex items-start">
                        ${getSvgIcon('HelpCircle', 'w-5 h-5 text-green-600 mr-3 mt-1 shrink-0')}
                        <div>
                            <h3 class="font-semibold text-green-800 mb-1">Simple Analogy</h3>
                            <p class="text-green-700">${currentStepData.content.analogy}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="font-semibold text-gray-800 mb-3">Key Points to Remember:</h3>
                    <ul class="space-y-2">
                        ${currentStepData.content.keyPoints.map(point => `
                            <li class="flex items-start">
                                ${getSvgIcon('CheckCircle', 'w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0')}
                                <span class="text-gray-700">${point}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-md">
                    <div class="flex items-start">
                        ${getSvgIcon('Users', 'w-5 h-5 text-purple-600 mr-3 mt-1 shrink-0')}
                        <div>
                            <h3 class="font-semibold text-purple-800 mb-1">Your Role as HR</h3>
                            <p class="text-purple-700">${currentStepData.content.yourRole}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Example Section was here, removed as it's not part of the new guide format -->
        `;
    }
    stepContentContainer.innerHTML = contentHTML;
}

// --- Navigation Rendering ---
export function renderNavigation() {
    if (!navigationContainer) return;

    const isFirstStep = state.currentStep === GUIDE_STEPS[0].id;
    const isLastStep = state.currentStep === GUIDE_STEPS[GUIDE_STEPS.length - 1].id;
    const currentStepData = GUIDE_STEPS.find(s => s.id === state.currentStep);
    const isCurrentStepCompleted = state.completedSteps.has(state.currentStep);

    let prevButtonHTML = `
        <button 
            id="prev-btn" 
            class="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                   ${isFirstStep ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}"
            ${isFirstStep ? 'disabled' : ''}
        >
            ${getSvgIcon('ChevronLeft', 'w-4 h-4 mr-1')}
            Previous
        </button>
    `;

    let nextButtonHTML = `
        <button 
            id="next-btn" 
            class="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors
                   ${isLastStep ? 'bg-slate-400 text-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}"
            ${isLastStep ? 'disabled' : ''}
        >
            Next
            ${getSvgIcon('ChevronRight', 'w-4 h-4 ml-1')}
        </button>
    `;
    
    let markCompleteButtonHTML = '';
    if (!isLastStep && !isCurrentStepCompleted) {
        markCompleteButtonHTML = `
            <button 
                id="mark-complete-btn" 
                class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center transition-colors"
            >
                ${getSvgIcon('CheckCircle', 'w-4 h-4 mr-2')}
                Mark Complete
            </button>
        `;
    }


    navigationContainer.innerHTML = `
        ${prevButtonHTML}
        <div class="flex space-x-3">
            ${markCompleteButtonHTML}
            ${nextButtonHTML}
        </div>
    `;

    // Add event listeners
    if (!isFirstStep) {
        document.getElementById('prev-btn')?.addEventListener('click', handlers.handlePrevStep);
    }
    if (!isLastStep) {
        document.getElementById('next-btn')?.addEventListener('click', handlers.handleNextStep);
    }
    if (markCompleteButtonHTML) {
        document.getElementById('mark-complete-btn')?.addEventListener('click', handlers.handleMarkComplete);
    }
}


// --- Full Application Render ---
export function renderApp() {
    if (!stepperContainer || !stepContentContainer || !navigationContainer) {
        console.error("One or more main containers not found in the DOM. Aborting render.");
        return;
    }
    renderStepper();
    renderStepContent();
    renderNavigation();

    // Optional: Render completion message if all steps are done
    // const allLearningStepsCompleted = GUIDE_STEPS.slice(0, -1).every(step => state.completedSteps.has(step.id));
    // if (completionMessageContainer) {
    //     if (allLearningStepsCompleted && state.currentStep === GUIDE_STEPS[GUIDE_STEPS.length - 1].id) {
    //         completionMessageContainer.innerHTML = `
    //             <div class="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
    //                 ${getSvgIcon('CheckCircle', 'w-12 h-12 text-green-500 mx-auto mb-4')}
    //                 <h3 class="text-xl font-bold text-green-800 mb-2">Congratulations!</h3>
    //                 <p class="text-green-700 mb-4">You've completed the Job Architecture basics guide.</p>
    //                 <a href="job-architecture/index.html" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
    //                     Try the Job Architecture Wizard
    //                 </a>
    //             </div>`;
    //         completionMessageContainer.classList.remove('hidden');
    //     } else {
    //         completionMessageContainer.innerHTML = '';
    //         completionMessageContainer.classList.add('hidden');
    //     }
    // }
}
