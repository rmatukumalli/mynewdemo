import { renderStepper } from './components/stepper.js';
import { renderStepContent } from './components/stepContent.js';
import { renderNavigation } from './components/navigation.js';

// --- DOM ELEMENT REFERENCES ---
const stepperContainer = document.getElementById('stepper-container');
const stepContentContainer = document.getElementById('step-content'); // Renamed to avoid conflict
const navigationContainer = document.getElementById('navigation-container');

// --- RENDER CYCLE ---
export function renderApp(state, STEPS, handlers) {
    renderStepper(stepperContainer, state, STEPS, handlers.goToStep);
    renderStepContent(stepContentContainer, state, STEPS, handlers.openModal, handlers.deleteItem);
    renderNavigation(navigationContainer, state, STEPS, handlers.prevStep, handlers.nextStep);
}
