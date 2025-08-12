import * as dom from './domElements.js';
import * as state from './state.js';
import { mockEmployees, mockPositionFormData } from './mockData.js';
import { getTagsFromContainer, calculateMatch, addTagToContainer } from './utils.js';
import { displayCandidateResults } from './ui.js';

function handleDefinePositionFormSubmit(event) {
    event.preventDefault();
    state.setIsLoading(true);
    dom.step1PositionDefinitionSection.classList.add('hidden');
    dom.step2ResultsSection.classList.remove('hidden');
    dom.step3AnalyticsSection.classList.add('hidden');
    dom.resultsPlaceholder.classList.add('hidden');
    dom.resultsContainer.innerHTML = '';
    dom.loadingState.classList.remove('hidden');
    dom.resultsContainer.appendChild(dom.loadingState);

    const hardSkills = getTagsFromContainer(dom.hardSkillsContainer);
    const softSkills = getTagsFromContainer(dom.softSkillsContainer);

    if (!dom.jobTitleInput.value.trim()) {
        alert("Please enter a Job Title.");
        dom.jobTitleInput.focus();
        dom.loadingState.classList.add('hidden');
        dom.resultsPlaceholder.classList.remove('hidden');
        dom.resultsContainer.appendChild(dom.resultsPlaceholder);
        state.setIsLoading(false);
        return;
    }

    const newDefinedPositionCriteria = {
        title: dom.jobTitleInput.value.trim(),
        department: dom.departmentSelect.value,
        location: dom.locationSelect.value,
        hardSkills,
        softSkills,
        experience: parseInt(dom.experienceInput.value) || 0,
        performance: dom.performanceSelect.value,
        tenure: parseInt(dom.tenureInput.value) || 0
    };
    state.setDefinedPositionCriteria(newDefinedPositionCriteria);

    setTimeout(() => {
        const newCandidateList = mockEmployees.map(emp => calculateMatch(emp, state.definedPositionCriteria))
                                          .filter(emp => emp.matchScore > 0);
        state.setCandidateList(newCandidateList);
        displayCandidateResults();
        state.setIsLoading(false);
    }, 1500);
}

function handleSortByChange(event) {
    state.setCurrentSort(event.target.value);
    displayCandidateResults();
}

function handleSearchPosition() {
    const searchTerm = dom.searchJobTitleReqIdInput.value.trim();
    if (!searchTerm) {
        alert("Please enter a Job Title or Requisition ID to search.");
        dom.searchJobTitleReqIdInput.focus();
        return;
    }
    console.log(`Searching for position: ${searchTerm}`);
    alert(`Search functionality for "${searchTerm}" is not fully implemented in this mock. \nPlease define the role manually or use the "Find Matching Employees" button with a manually defined role.`);
    if (searchTerm.toLowerCase() === 'r12345') {
        dom.jobTitleInput.value = "Senior iOS Engineer (R12345)";
        dom.departmentSelect.value = "Software Engineering";
        dom.hardSkillsContainer.querySelectorAll('.tag').forEach(t => t.remove());
        addTagToContainer("Swift", dom.hardSkillsContainer);
        addTagToContainer("API Design", dom.hardSkillsContainer);
        dom.softSkillsContainer.querySelectorAll('.tag').forEach(t => t.remove());
        addTagToContainer("Communication", dom.softSkillsContainer);
        dom.experienceInput.value = 5;
    }
}

function handleBackToResults() {
    dom.step1PositionDefinitionSection.classList.add('hidden');
    dom.step3AnalyticsSection.classList.add('hidden');
    dom.step2ResultsSection.classList.remove('hidden');
    dom.backToResultsBtn.classList.add('hidden');
    dom.analyticsPlaceholder.classList.remove('hidden');
    state.setSelectedCandidateForAnalytics(null);
}

function handleBackToStep1() {
    dom.step2ResultsSection.classList.add('hidden');
    dom.step3AnalyticsSection.classList.add('hidden');
    dom.step1PositionDefinitionSection.classList.remove('hidden');
    // Optionally reset form fields or state related to step 1 if needed
    // For now, just navigating back.
}

export function loadMockPositionDataIntoForm() {
    dom.searchJobTitleReqIdInput.value = mockPositionFormData.searchQuery;
    dom.jobTitleInput.value = mockPositionFormData.title;
    dom.departmentSelect.value = mockPositionFormData.department;
    dom.locationSelect.value = mockPositionFormData.location;
    dom.experienceInput.value = mockPositionFormData.experience;
    dom.performanceSelect.value = mockPositionFormData.performance;
    dom.tenureInput.value = mockPositionFormData.tenure;

    dom.hardSkillsContainer.querySelectorAll('.tag').forEach(t => t.remove());
    mockPositionFormData.hardSkills.forEach(skill => addTagToContainer(skill, dom.hardSkillsContainer));

    dom.softSkillsContainer.querySelectorAll('.tag').forEach(t => t.remove());
    mockPositionFormData.softSkills.forEach(skill => addTagToContainer(skill, dom.softSkillsContainer));

    console.log("Mock position data loaded into the form.");
}


export function initializeEventListeners() {
    if (dom.definePositionForm) {
        dom.definePositionForm.addEventListener('submit', handleDefinePositionFormSubmit);
    }
    if (dom.sortBySelect) {
        dom.sortBySelect.addEventListener('change', handleSortByChange);
    }
    if (dom.searchPositionBtn) {
        dom.searchPositionBtn.addEventListener('click', handleSearchPosition);
    }
    if (dom.backToResultsBtn) {
        dom.backToResultsBtn.addEventListener('click', handleBackToResults);
    }
    if (dom.loadMockDataBtn) {
        dom.loadMockDataBtn.addEventListener('click', loadMockPositionDataIntoForm);
    }
    if (dom.backToStep1Btn) {
        dom.backToStep1Btn.addEventListener('click', handleBackToStep1);
    }
}
