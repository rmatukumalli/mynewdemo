export function init(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
    const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
    const panelsContainer = contentWrapper.querySelector('.panels-container');

    if (!actionButtonContainer || !panelsContainer) {
        console.error('Required containers not found for review_ai.js');
        return;
    }

    actionButtonContainer.innerHTML = `<button data-action="analyze-architecture" class="bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-md text-sm hover:bg-blue-200 flex items-center gap-1.5">✨ Analyze with AI</button>`;
    
    const renderReviewAI = (reviewData) => {
        panelsContainer.innerHTML = `
            <div class="space-y-4">
                <div class="bg-slate-50 p-4 rounded-lg border">
                    <h4 class="font-bold text-slate-800 mb-2">Overall Scores</h4>
                    <p class="text-sm"><strong>Organizational Completeness Score:</strong> ${reviewData.org_completeness_score || 'N/A'}%</p>
                    <p class="text-sm"><strong>Talent Risk Score:</strong> ${reviewData.talent_risk_score || 'N/A'}</p>
                    <p class="text-sm"><strong>Skill Coverage Score:</strong> ${reviewData.skill_coverage_score || 'N/A'}%</p>
                </div>

                <div class="bg-slate-50 p-4 rounded-lg border">
                    <h4 class="font-bold text-slate-800 mb-2">AI Insights</h4>
                    <ul class="space-y-1 text-sm list-disc pl-5">
                        ${reviewData.ai_insights && reviewData.ai_insights.length > 0 ? 
                            reviewData.ai_insights.map(i => `<li>${i.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('') : 
                            '<li>No AI insights available.</li>'}
                    </ul>
                </div>

                <div class="bg-slate-50 p-4 rounded-lg border">
                    <h4 class="font-bold text-slate-800 mb-2">Alerts & Risks</h4>
                    <p class="text-sm"><strong>Duplication Risks:</strong> ${reviewData.duplication_risks && reviewData.duplication_risks.length > 0 ? reviewData.duplication_risks.join(', ') : 'None'}</p>
                    <p class="text-sm"><strong>Promotion Blockers:</strong> ${reviewData.promotion_blockers && reviewData.promotion_blockers.length > 0 ? reviewData.promotion_blockers.join(', ') : 'None'}</p>
                    <p class="text-sm"><strong>Compliance Flags:</strong> ${reviewData.compliance_flags && reviewData.compliance_flags.length > 0 ? reviewData.compliance_flags.join(', ') : 'None'}</p>
                    <p class="text-sm"><strong>Role Overlap Alerts:</strong> ${reviewData.role_overlap_alerts && reviewData.role_overlap_alerts.length > 0 ? reviewData.role_overlap_alerts.join(', ') : 'None'}</p>
                    <p class="text-sm"><strong>Talent Risks:</strong> ${reviewData.talent_risks && reviewData.talent_risks.length > 0 ? reviewData.talent_risks.join(', ') : 'None'}</p>
                </div>

                <div class="bg-slate-50 p-4 rounded-lg border">
                    <h4 class="font-bold text-slate-800 mb-2">Recommendations</h4>
                    <ul class="space-y-1 text-sm list-disc pl-5">
                        ${reviewData.recommendations && reviewData.recommendations.length > 0 ? 
                            reviewData.recommendations.map(r => `<li>${r}</li>`).join('') : 
                            '<li>No recommendations available.</li>'}
                    </ul>
                </div>
            </div>
        `;
    };

    // Initial render with existing data
    renderReviewAI(appData.review_ai || {});

    // Event listener for AI analysis
    actionButtonContainer.querySelector('[data-action="analyze-architecture"]').addEventListener('click', () => {
        openModal({ title: '✨ Analyze Architecture', content: `<p class="text-sm text-slate-600">The AI will review your entire job architecture for inconsistencies and opportunities.</p>`, onConfirm: async () => {
            try {
                const analysisData = await callAPI('/api/ai/organizational_insights', 'POST', appData);
                appData.review_ai = { ...appData.review_ai, ...analysisData, ai_analysis_triggered: true };
                renderReviewAI(appData.review_ai);
                return true;
            } catch (error) {
                console.error('Error analyzing architecture:', error);
                alert('Failed to analyze architecture. Please try again.');
                return false;
            }
        }});
    });
}
