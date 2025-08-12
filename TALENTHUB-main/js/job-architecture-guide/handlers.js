import { state, GUIDE_STEPS, updateGuideState } from './state.js';
import { renderApp } from './render.js';

export const handlers = {
    handleStepperClick: (event) => {
        const stepId = parseInt(event.currentTarget.dataset.stepId, 10);
        if (!isNaN(stepId)) {
            updateGuideState({ currentStep: stepId });
            renderApp();
            // Scroll to top of content for better UX
            document.getElementById('step-content')?.scrollTo(0, 0);
        }
    },

    handleNextStep: () => {
        const currentIndex = GUIDE_STEPS.findIndex(step => step.id === state.currentStep);
        if (currentIndex < GUIDE_STEPS.length - 1) {
            // Automatically mark current step as complete when moving to next
            const newCompletedSteps = new Set(state.completedSteps);
            newCompletedSteps.add(state.currentStep);
            
            updateGuideState({
                currentStep: GUIDE_STEPS[currentIndex + 1].id,
                completedSteps: newCompletedSteps
            });
            renderApp();
            document.getElementById('step-content')?.scrollTo(0, 0);
        }
    },

    handlePrevStep: () => {
        const currentIndex = GUIDE_STEPS.findIndex(step => step.id === state.currentStep);
        if (currentIndex > 0) {
            updateGuideState({ currentStep: GUIDE_STEPS[currentIndex - 1].id });
            renderApp();
            document.getElementById('step-content')?.scrollTo(0, 0);
        }
    },

    handleMarkComplete: () => {
        const newCompletedSteps = new Set(state.completedSteps);
        newCompletedSteps.add(state.currentStep);
        updateGuideState({ completedSteps: newCompletedSteps });
        renderApp(); // Re-render to reflect completion status (e.g., button changes)
    },

    // Centralized function to trigger a full re-render, useful after state changes from other modules
    triggerRender: () => {
        renderApp();
    }
};
