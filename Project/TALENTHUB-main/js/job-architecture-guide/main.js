import { state, GUIDE_STEPS, updateGuideState, loadGuideState } from './state.js';
import { handlers } from './handlers.js';
import { renderApp } from './render.js';

// --- INITIALIZATION & URL PARAMETER HANDLING (if any) ---
document.addEventListener('DOMContentLoaded', () => {
    // Load saved state from localStorage (if any)
    loadGuideState();
    
    // Handle URL parameters (e.g., to jump to a specific step)
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get('step');
    let initialStepId = state.currentStep; // Default to current state's step or 1 (from state.js)

    if (stepParam) {
        const parsedStepId = parseInt(stepParam, 10);
        // Validate if the stepId from param is a valid step ID in GUIDE_STEPS
        if (!isNaN(parsedStepId) && GUIDE_STEPS.some(step => step.id === parsedStepId)) {
            initialStepId = parsedStepId;
        } else {
            console.warn(`Invalid 'step' parameter in URL: ${stepParam}. It does not correspond to a valid step ID.`);
        }
    }
    
    // Update state with the determined initial step (either from localStorage or URL param)
    updateGuideState({ currentStep: initialStepId });

    // Initial render of the application
    handlers.triggerRender(); // This will call renderApp()

    // Clean URL: remove 'step' param after processing to avoid issues on refresh/navigation
    // but only if it was actually present and used.
    if (params.has('step')) {
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.delete('step');
        const newUrl = `${window.location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}${window.location.hash}`;
        window.history.replaceState({}, document.title, newUrl);
    }
});
