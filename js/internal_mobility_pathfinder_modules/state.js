// --- STATE ---
export let definedPositionCriteria = null;
export let candidateList = [];
export let isLoading = false;
export let currentSort = 'matchScoreDesc';
export let selectedCandidateForAnalytics = null;

export function setDefinedPositionCriteria(criteria) {
    definedPositionCriteria = criteria;
}

export function setCandidateList(list) {
    candidateList = list;
}

export function setIsLoading(loading) {
    isLoading = loading;
}

export function setCurrentSort(sort) {
    currentSort = sort;
}

export function setSelectedCandidateForAnalytics(candidate) {
    selectedCandidateForAnalytics = candidate;
}
