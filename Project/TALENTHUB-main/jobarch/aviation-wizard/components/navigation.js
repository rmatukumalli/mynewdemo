export const renderNavigation = (container, state, STEPS, prevStepFn, nextStepFn) => {
    const isFirstStep = state.currentStep === 1;
    const isLastStep = state.currentStep === STEPS.length;

    container.innerHTML = `
        <button id="prev-step-btn" ${isFirstStep ? 'disabled' : ''} class="px-6 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
        ${isLastStep ?
            `<button id="finish-btn" class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Finish & Save</button>` :
            `<button id="next-step-btn" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Next</button>`
        }
    `;

    if (!isFirstStep) {
        document.getElementById('prev-step-btn').addEventListener('click', prevStepFn);
    }
    if (!isLastStep) {
        document.getElementById('next-step-btn').addEventListener('click', nextStepFn);
    } else {
        // Add event listener for finish button if needed, e.g., for saving data
        // document.getElementById('finish-btn').addEventListener('click', () => console.log('Finish clicked'));
    }
};
