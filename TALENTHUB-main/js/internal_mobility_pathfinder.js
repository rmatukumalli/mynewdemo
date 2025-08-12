import * as dom from './internal_mobility_pathfinder_modules/domElements.js';
import { setupTagInput } from './internal_mobility_pathfinder_modules/utils.js';
import { initializeEventListeners, loadMockPositionDataIntoForm } from './internal_mobility_pathfinder_modules/eventHandlers.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- INITIALIZATION ---
    if (dom.hardSkillsContainer && dom.hardSkillsInput) {
        setupTagInput(dom.hardSkillsContainer, dom.hardSkillsInput);
    }
    if (dom.softSkillsContainer && dom.softSkillsInput) {
        setupTagInput(dom.softSkillsContainer, dom.softSkillsInput);
    }

    initializeEventListeners();
    loadMockPositionDataIntoForm(); // Load mock data by default

    // Initial UI State
    if (dom.step1PositionDefinitionSection) dom.step1PositionDefinitionSection.classList.remove('hidden');
    if (dom.step2ResultsSection) dom.step2ResultsSection.classList.add('hidden');
    if (dom.step3AnalyticsSection) dom.step3AnalyticsSection.classList.add('hidden');
    if (dom.resultsPlaceholder) dom.resultsPlaceholder.classList.remove('hidden');
    if (dom.analyticsPlaceholder) dom.analyticsPlaceholder.classList.remove('hidden');
    if (dom.backToResultsBtn) dom.backToResultsBtn.classList.add('hidden');
});
