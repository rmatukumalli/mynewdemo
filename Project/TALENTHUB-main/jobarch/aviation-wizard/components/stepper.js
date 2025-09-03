import { getIcon } from '../state.js';

export const renderStepper = (container, state, STEPS, goToStepFn) => {
    container.innerHTML = STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = state.currentStep > stepNumber;
        const isActive = state.currentStep === stepNumber;
        // const canNavigate = stepNumber < state.currentStep; // Old logic
        const canNavigate = true; // New: Always allow navigation via stepper click
        
        let classes = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-colors ";
        if (isCompleted) {
            classes += 'bg-green-500';
        } else if (isActive) {
            classes += 'bg-blue-600';
        } else {
            classes += 'bg-gray-300';
        }

        let stepElementHTML = `
            <div class="flex items-center flex-shrink-0 ${canNavigate ? 'cursor-pointer' : ''}" ${canNavigate ? `data-step-to-navigate="${stepNumber}"` : ''}>
                <div class="${classes}">
                    ${isCompleted ? getIcon('Check') : stepNumber}
                </div>
                <span class="ml-3 font-semibold ${isActive ? 'text-blue-600' : 'text-gray-600'}">${step}</span>
            </div>
        `;
        if (index < STEPS.length - 1) {
            stepElementHTML += '<div class="flex-1 h-1 mx-4 bg-gray-200 rounded-full"></div>';
        }
        return stepElementHTML;
    }).join('');

    // Add event listeners for clickable steps
    container.querySelectorAll('[data-step-to-navigate]').forEach(el => {
        el.addEventListener('click', (e) => {
            const stepNum = parseInt(e.currentTarget.dataset.stepToNavigate);
            if (!isNaN(stepNum)) {
                goToStepFn(stepNum);
            }
        });
    });
};
