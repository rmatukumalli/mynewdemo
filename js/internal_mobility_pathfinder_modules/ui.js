import * as dom from './domElements.js';
import * as state from './state.js';
import { mockAnalyticsStructure as sectionTemplate } from './mockData.js'; // Renamed for clarity
import { sortCandidates } from './utils.js';

export function displayCandidateResults() {
    dom.resultsContainer.innerHTML = '';
    dom.loadingState.classList.add('hidden');
    dom.step2ResultsSection.classList.remove('hidden');
    dom.step3AnalyticsSection.classList.add('hidden');

    const sortedCandidates = sortCandidates(state.candidateList, state.currentSort);

    if (sortedCandidates.length === 0) {
        dom.resultsContainer.appendChild(dom.resultsPlaceholder);
        dom.resultsPlaceholder.classList.remove('hidden');
        return;
    }
    dom.resultsPlaceholder.classList.add('hidden');

    sortedCandidates.forEach(candidate => {
        const initials = candidate.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const photoEl = candidate.photoUrl
            ? `<img class="candidate-photo-initials" src="${candidate.photoUrl}" alt="Photo of ${candidate.name}">`
            : `<div class="candidate-photo-initials"><span>${initials}</span></div>`;

        const cardElement = document.createElement('div');
        cardElement.className = 'candidate-card';
        cardElement.dataset.candidateId = candidate.id;

        cardElement.innerHTML = `
            <div class="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div class="flex-shrink-0 w-full sm:w-auto flex sm:flex-col items-center justify-between sm:justify-start space-x-4 sm:space-x-0 sm:space-y-4">
                    ${photoEl}
                    <div class="text-center match-score-display">
                        <div class="score">${candidate.matchScore}%</div>
                        <div class="label">Match Score</div>
                    </div>
                </div>
                <div class="flex-grow border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6 w-full">
                    <h3 class="text-lg font-semibold text-slate-900">${candidate.name}</h3>
                    <p class="text-sm text-slate-600">${candidate.currentTitle}</p>
                    <p class="text-sm text-slate-500">${candidate.department} &bull; ${candidate.experience} years experience</p>
                    ${candidate.matchedSkills.length > 0 ? `
                    <div class="mt-4">
                        <h4 class="text-sm font-medium text-slate-800">Matched Skills:</h4>
                        <div class="flex flex-wrap mt-1">
                            ${candidate.matchedSkills.map(skill => `<span class="tag skill-tag-matched">${skill}</span>`).join('')}
                        </div>
                    </div>` : ''}
                    ${candidate.missingSkills.length > 0 ? `
                    <div class="mt-3">
                        <h4 class="text-sm font-medium text-slate-800">Potential Gaps:</h4>
                        <div class="flex flex-wrap mt-1">
                            ${candidate.missingSkills.map(skill => `<span class="tag skill-tag-gap">${skill}</span>`).join('')}
                        </div>
                    </div>` : ''}
                    <div class="mt-6 flex items-center space-x-3">
                        <button data-candidate-id="${candidate.id}" class="view-analytics-btn rounded-md px-3 py-2 text-sm font-semibold shadow-sm">View Analytics</button>
                        <button class="action-button-secondary rounded-md px-3 py-2 text-sm font-semibold shadow-sm">Initiate Outreach</button>
                    </div>
                </div>
            </div>`;

        dom.resultsContainer.appendChild(cardElement);

        const viewAnalyticsBtn = cardElement.querySelector('.view-analytics-btn');
        if(viewAnalyticsBtn) {
            viewAnalyticsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedId = e.currentTarget.dataset.candidateId;
                const selectedCandidate = state.candidateList.find(c => c.id === selectedId);
                if (selectedCandidate) {
                    state.setSelectedCandidateForAnalytics(selectedCandidate);
                    renderAnalytics(selectedCandidate);
                }
            });
        }
    });
}

function getStatusColorClasses(status) {
    switch (status) {
        case 'good': return { text: 'text-green-700', bg: 'bg-green-100', border: 'border-green-500', bar: 'bg-green-600' };
        case 'warning': return { text: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-500', bar: 'bg-yellow-500' };
        case 'critical': return { text: 'text-red-700', bg: 'bg-red-100', border: 'border-red-500', bar: 'bg-red-600' };
        case 'neutral':
        default: return { text: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-500', bar: 'bg-blue-600' };
    }
}


export function renderAnalytics(candidate) {
    dom.analyticsContainer.innerHTML = '';
    dom.analyticsPlaceholder.classList.add('hidden');

    const analyticsData = candidate.analytics || {};
    const mainHeaderData = analyticsData.mainHeader || {};
    const candidateName = mainHeaderData.candidateName || candidate.name;
    const positionTitle = mainHeaderData.positionTitle || state.definedPositionCriteria?.title || "N/A";

    let dashboardHeaderHtml = `
        <header class="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-200">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 class="text-3xl font-bold text-slate-900">Match Analytics Dashboard</h1>
                    <p class="text-slate-600 mt-2">Internal Candidate: <strong>${candidateName}</strong> &bull; Position: <strong>${positionTitle}</strong></p>
                </div>
                <div class="flex space-x-3 mt-4 sm:mt-0">
                    <button class="action-button-primary flex items-center justify-center px-4 py-2 rounded-lg shadow-sm">
                        Recommend
                    </button>
                    <button class="action-button-secondary flex items-center justify-center px-4 py-2 rounded-lg shadow-sm">
                        Schedule Interview
                    </button>
                </div>
            </div>
        </header>
        <main id="dashboard-accordion-container">
    `;
    dom.analyticsContainer.insertAdjacentHTML('beforeend', dashboardHeaderHtml);

    const accordionContainerEl = document.createElement('div');

    const sectionDisplayTitles = {
        "overview": "🎯 Match Overview",
        "profile": "👤 Candidate Profile",
        "skills": "🔧 Skills Analysis",
        "marketIntelligence": "📊 Market Intelligence",
        "risk": "⚖️ Risk & Readiness",
        "fit": "🌐 Organizational Fit",
        "developmentPathway": "📈 Development Pathway",
        "bias": "🔍 Bias & Compliance",
        "actions": "📋 Action Items",
        "insights": "📊 Analytics & Insights"
    };

    const sectionIcons = {
        "overview": "target", "profile": "user", "skills": "trending-up",
        "risk": "alert-triangle", "fit": "users", "bias": "shield",
        "actions": "clock", "marketIntelligence": "bar-chart-2",
        "developmentPathway": "git-pull-request-arrow", "insights": "activity"
    };

    let sectionIndex = 0;
    for (const sectionKey in sectionTemplate) { // Iterate using template to ensure all sections appear
        if (sectionKey === "mainHeader") continue; // Skip mainHeader as it's already used

        const sectionData = analyticsData[sectionKey] || sectionTemplate[sectionKey]; // Use candidate's data or fallback to empty template structure
        const displayTitle = sectionDisplayTitles[sectionKey] || sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        const iconName = sectionIcons[sectionKey] || "info";
        const isExpanded = true; // Changed to always true to expand all accordions by default

        let sectionHtml = `
            <div class="card-section bg-slate-50 border-2 rounded-xl mb-4 border-slate-200">
                <div class="card-header flex items-center justify-between cursor-pointer p-4" data-section="${sectionKey}">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="${iconName}" class="w-6 h-6 text-slate-700"></i>
                        <h2 class="text-lg font-semibold text-slate-800">${displayTitle.replace(/[\🎯👤🔧📊⚖️🌐📈🔍📋]/g, '').trim()}</h2>
                    </div>
                    <i data-lucide="${isExpanded ? 'chevron-down' : 'chevron-right'}" class="w-5 h-5 chevron-icon transition-transform transform text-slate-600"></i>
                </div>
                <div class="accordion-content ${isExpanded ? 'expanded' : ''} px-4 pb-4">
                    <div class="mt-4 space-y-4">`;

        // Specific rendering logic for each section based on its new structure
        if (sectionKey === "overview" && sectionData.metricCards) {
            sectionHtml += `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">`;
            (sectionData.metricCards || []).forEach(metric => {
                const colors = getStatusColorClasses(metric.status);
                sectionHtml += `<div class="metric-card bg-white p-4 rounded-lg border ${colors.border} shadow-sm">
                                    <div class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${colors.text} ${colors.bg} mb-2">${metric.title}</div>
                                    <div class="text-3xl font-bold text-slate-900">${metric.value || 'N/A'}</div>
                                    <div class="text-sm text-slate-600 mt-1">${metric.subtitle || ''}</div>
                                </div>`;
            });
            sectionHtml += `</div>`;
            if (sectionData.topStrengthsAlignment && sectionData.topStrengthsAlignment.length > 0) {
                sectionHtml += `<div class="mt-4 p-4 bg-white rounded-lg border border-slate-200"><h4 class="font-semibold text-slate-800 mb-2">Top Strengths Alignment</h4><div class="space-y-2">`;
                sectionData.topStrengthsAlignment.forEach(strengthItem => {
                    sectionHtml += `<div class="flex justify-between text-sm"><span class="text-slate-700">${strengthItem.strength}</span><span class="font-medium text-blue-600">${strengthItem.alignment}</span></div>`;
                });
                sectionHtml += `</div></div>`;
            }
             if (sectionData.criticalGapIndicator) {
                sectionHtml += `<div class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-300 text-yellow-700 text-sm"><strong>Critical Gap:</strong> ${sectionData.criticalGapIndicator}</div>`;
            }
        } else if (sectionKey === "profile" && sectionData.metricCards) {
            sectionHtml += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">`;
            (sectionData.metricCards || []).forEach(metric => {
                const colors = getStatusColorClasses(metric.status);
                sectionHtml += `<div class="metric-card bg-white p-4 rounded-lg border ${colors.border} shadow-sm">
                                    <div class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${colors.text} ${colors.bg} mb-2">${metric.title}</div>
                                    <div class="text-xl font-bold text-slate-900">${metric.value || 'N/A'}</div>
                                    <div class="text-sm text-slate-600 mt-1">${metric.subtitle || ''}</div>
                                </div>`;
            });
            sectionHtml += `</div>`;
        } else if (sectionKey === "skills" && (sectionData.technicalSkillsMatch || sectionData.skillGapsDevelopment)) {
            sectionHtml += `<div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">`;
            if (sectionData.technicalSkillsMatch && sectionData.technicalSkillsMatch.length > 0) {
                sectionHtml += `<div class="bg-white p-4 rounded-lg border border-slate-200"><h4 class="font-semibold text-slate-800 mb-3">Technical Skills Match</h4><div class="space-y-3">`;
                sectionData.technicalSkillsMatch.forEach(skill => {
                    const colors = getStatusColorClasses(skill.status);
                    sectionHtml += `<div>
                                        <div class="flex justify-between mb-1">
                                            <span class="text-sm text-slate-700">${skill.skillName}</span>
                                            <span class="text-sm ${colors.text} font-semibold">${skill.skillLevel} (${skill.matchPercentage}%)</span>
                                        </div>
                                        <div class="w-full bg-slate-200 rounded-full h-2.5">
                                            <div class="${colors.bar} h-2.5 rounded-full" style="width: ${skill.matchPercentage}%"></div>
                                        </div>
                                    </div>`;
                });
                sectionHtml += `</div></div>`;
            }
            if (sectionData.skillGapsDevelopment && sectionData.skillGapsDevelopment.length > 0) {
                sectionHtml += `<div class="bg-white p-4 rounded-lg border border-slate-200"><h4 class="font-semibold text-slate-800 mb-3">Skill Gaps & Development</h4><div class="space-y-2">`;
                sectionData.skillGapsDevelopment.forEach(gap => {
                    const icon = gap.status === 'good' ? 'check-circle' : 'alert-triangle';
                    const iconColors = getStatusColorClasses(gap.status);
                    sectionHtml += `<div class="flex items-center space-x-2">
                                        <i data-lucide="${icon}" class="w-4 h-4 ${iconColors.text}"></i>
                                        <span class="text-sm text-slate-700">${gap.description}</span>
                                    </div>`;
                });
                sectionHtml += `</div></div>`;
            }
            sectionHtml += `</div>`;
        } else if (sectionKey === "fit" && (sectionData.culturalAlignment || sectionData.networkAnalysis)) {
            sectionHtml += `<div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">`;
            if (sectionData.culturalAlignment && sectionData.culturalAlignment.length > 0) {
                sectionHtml += `<div class="bg-white p-4 rounded-lg border border-slate-200"><h4 class="font-semibold text-slate-800 mb-3">Cultural Alignment</h4><div class="space-y-2">`;
                sectionData.culturalAlignment.forEach(item => {
                    sectionHtml += `<div class="flex justify-between text-sm"><span class="text-slate-700">${item.trait}</span><span class="font-medium text-blue-600">${item.rating}</span></div>`;
                });
                sectionHtml += `</div></div>`;
            }
            if (sectionData.networkAnalysis && sectionData.networkAnalysis.length > 0) {
                sectionHtml += `<div class="bg-white p-4 rounded-lg border border-slate-200"><h4 class="font-semibold text-slate-800 mb-3">Network Analysis</h4><div class="space-y-2">`;
                sectionData.networkAnalysis.forEach(item => {
                    sectionHtml += `<div class="flex justify-between text-sm"><span class="text-slate-700">${item.metric}</span><span class="font-medium text-slate-800">${item.value}</span></div>`;
                });
                sectionHtml += `</div></div>`;
            }
            sectionHtml += `</div>`;
        } else if (sectionKey === "actions" && (sectionData.immediateNextSteps || sectionData.timelineMilestones)) {
            sectionHtml += `<div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">`;
            if (sectionData.immediateNextSteps && sectionData.immediateNextSteps.length > 0) {
                sectionHtml += `<div class="bg-white p-4 rounded-lg border border-slate-200"><h4 class="font-semibold text-slate-800 mb-3">Immediate Next Steps</h4><div class="space-y-3">`;
                sectionData.immediateNextSteps.forEach((step, idx) => {
                    sectionHtml += `<div class="flex items-center space-x-3">
                                        <input id="action_task_${sectionKey}_${idx}" type="checkbox" ${step.isChecked ? 'checked' : ''} class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                        <label for="action_task_${sectionKey}_${idx}" class="text-sm text-slate-700">${step.task}</label>
                                    </div>`;
                });
                sectionHtml += `</div></div>`;
            }
            if (sectionData.timelineMilestones && sectionData.timelineMilestones.length > 0) {
                sectionHtml += `<div class="bg-white p-4 rounded-lg border border-slate-200"><h4 class="font-semibold text-slate-800 mb-3">Timeline & Milestones</h4><div class="space-y-2">`;
                sectionData.timelineMilestones.forEach(item => {
                    sectionHtml += `<div class="flex justify-between text-sm"><span class="text-slate-700">${item.milestone}</span><span class="font-medium text-slate-800">${item.date}</span></div>`;
                });
                sectionHtml += `</div></div>`;
            }
            sectionHtml += `</div>`;
        }
        // Generic fallback for sections with metricCards array (risk, bias, marketIntelligence, developmentPathway, insights)
        else if (sectionData.metricCards && Array.isArray(sectionData.metricCards)) {
            const cols = sectionData.metricCards.length >= 3 ? 'md:grid-cols-3' : (sectionData.metricCards.length === 2 ? 'md:grid-cols-2' : 'grid-cols-1');
            sectionHtml += `<div class="grid grid-cols-1 ${cols} gap-4">`;
            sectionData.metricCards.forEach(metric => {
                const colors = getStatusColorClasses(metric.status);
                sectionHtml += `<div class="metric-card bg-white p-4 rounded-lg border ${colors.border} shadow-sm">
                                    <div class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${colors.text} ${colors.bg} mb-2">${metric.title}</div>
                                    <div class="text-2xl font-bold text-slate-900">${metric.value || 'N/A'}</div>
                                    <div class="text-sm text-slate-600 mt-1">${metric.subtitle || ''}</div>
                                </div>`;
            });
            sectionHtml += `</div>`;
        } else {
             sectionHtml += `<div class="text-sm text-slate-500 italic">Data for this section is not available in the required format.</div>`;
        }


        sectionHtml += `</div></div></div>`;
        accordionContainerEl.insertAdjacentHTML('beforeend', sectionHtml);
        sectionIndex++;
    }

    dom.analyticsContainer.appendChild(accordionContainerEl);
    dom.analyticsContainer.insertAdjacentHTML('beforeend', `</main>`);

    const headers = dom.analyticsContainer.querySelectorAll('.card-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const iconEl = header.querySelector('.chevron-icon');
            const isCurrentlyExpanded = content.classList.contains('expanded');

            content.classList.toggle('expanded');
            iconEl.setAttribute('data-lucide', isCurrentlyExpanded ? 'chevron-right' : 'chevron-down');
            if (typeof lucide !== 'undefined') lucide.createIcons(); // Re-render specific icon
        });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons(); // Initial render for all icons

    dom.step1PositionDefinitionSection.classList.add('hidden');
    dom.step2ResultsSection.classList.add('hidden');
    dom.step3AnalyticsSection.classList.remove('hidden');
    dom.backToResultsBtn.classList.remove('hidden');
}
