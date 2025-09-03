document.addEventListener('DOMContentLoaded', () => {
    // Check for iframe mode via URL parameter
    const urlParamsForIframe = new URLSearchParams(window.location.search);
    if (urlParamsForIframe.get('embedded') === 'true') {
        document.body.classList.add('iframe-mode');
    }

    const candidateNameHeader = document.getElementById('pageCandidateNameHeader');
    const candidateRole = document.getElementById('pageCandidateRole');
    const candidateTimeInRole = document.getElementById('pageCandidateTimeInRole'); // Added for Time in Role
    const candidateLocation = document.getElementById('pageCandidateLocation');
    const candidatePhoto = document.getElementById('pageCandidatePhoto');
    const benchmarkProfileName = document.getElementById('pageBenchmarkProfileName');
    const pageCandidateName = document.getElementById('pageCandidateName');
    
    const radarChartCanvas = document.getElementById('pageSkillRadarChart'); // Get canvas element
    const summaryTableBody = document.getElementById('pageSkillSummaryTableBody');
    const insightsList = document.getElementById('pageInsightsList');

    const overallMatchScoreValue = document.getElementById('pageOverallMatchScoreValue');
    const overallMatchProgressBar = document.getElementById('pageOverallMatchProgressBar');
    const matchScoreText = document.getElementById('pageMatchScoreText');

    const loadingIndicator = document.getElementById('pageLoadingIndicator');
    const graphPageContent = document.getElementById('graphPageContent');

    let pageChartInstance = null; // Renamed to avoid conflict if this script is ever merged/used elsewhere

    const urlParams = new URLSearchParams(window.location.search);
    const candidateId = urlParams.get('candidateId');

    if (!candidateId) {
        console.error('Candidate ID not found in URL.');
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (graphPageContent) graphPageContent.innerHTML = '<p style="color:red; text-align:center;">Error: Candidate ID is missing in the URL.</p>';
        return;
    }

    if (loadingIndicator) loadingIndicator.style.display = 'block';
    if (graphPageContent) graphPageContent.style.display = 'none';

    // Fetch all candidate data (assuming a structure in sample-data.json)
    // In a real app, sampleCandidatesData might be fetched or available globally
    // For this standalone page, we'll fetch it.
    fetch('./data/sample-data.json')
        .then(response => response.json())
        .then(data => {
            let allCandidates = [];
            if (data.platformCandidates) { // Prioritize the new centralized key
                allCandidates = data.platformCandidates;
            } else if (data.sampleCandidatesData) { 
                allCandidates = data.sampleCandidatesData;
            } else if (data.candidates) { 
                allCandidates = data.candidates;
            } else {
                // Fallback for other potential structures if needed, though platformCandidates should be primary
                const poolCandidates = data.candidatePool?.candidates || data.allPoolCandidates;
                if (poolCandidates) {
                    allCandidates = poolCandidates;
                } else {
                    const intelCandidates = data.skillsIntelligenceView?.sampleCandidatesData;
                    if (intelCandidates) {
                        allCandidates = intelCandidates;
                    } else {
                        console.error('Candidate data array not found in sample-data.json under expected keys (platformCandidates, sampleCandidatesData, candidates, etc.).');
                        if (loadingIndicator) loadingIndicator.style.display = 'none';
                        if (graphPageContent) {
                           graphPageContent.innerHTML = '<p style="color:red; text-align:center;">Error: Could not locate candidate data in the data file.</p>';
                           graphPageContent.style.display = 'block';
                        }
                        return;
                    }
                }
            }
            
            let candidateData = allCandidates.find(c => c.id === candidateId);

            if (loadingIndicator) loadingIndicator.style.display = 'none';
            if (graphPageContent) graphPageContent.style.display = 'block';

            if (!candidateData) {
                console.error(`Candidate data for ID ${candidateId} not found.`);
                graphPageContent.innerHTML = `<p style="color:red; text-align:center;">Error: Could not load data for candidate ${candidateId}.</p>`;
                return;
            }

            // Simulate timeInRole if not present in data source for demonstration
            if (candidateData && typeof candidateData.timeInRole === 'undefined') {
                // Assign a mock value based on candidateId to show variation
                const mockTimes = ["1 year 2 months", "3 years", "8 months", "2 years 5 months"];
                candidateData.timeInRole = mockTimes[candidateId.length % mockTimes.length]; 
            }
            
            populatePageWithData(candidateData);
        })
        .catch(error => {
            console.error('Error fetching candidate data:', error);
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            if (graphPageContent) {
                graphPageContent.innerHTML = `<p style="color:red; text-align:center;">Error loading candidate data. ${error.message}</p>`;
                graphPageContent.style.display = 'block';
            }
        });

    function populatePageWithData(candidateData) {
        if (pageCandidateName) pageCandidateName.textContent = `${candidateData.name || 'N/A'} - Skill Graph`;
        if (candidateNameHeader) candidateNameHeader.textContent = candidateData.name || 'N/A';
        if (candidateRole) candidateRole.textContent = candidateData.role || 'N/A';
        if (candidateTimeInRole) candidateTimeInRole.textContent = `Time in Role: ${candidateData.timeInRole || 'N/A'}`; // Populate Time in Role
        if (candidateLocation) candidateLocation.textContent = candidateData.location || 'N/A';
        if (candidatePhoto) candidatePhoto.src = candidateData.imageUrl || `https://picsum.photos/seed/${candidateData.id}/70/70`;
        
        const currentBenchmarkProfileName = "Software Engineer Level 2 (Benchmark)"; // Mocked
        if (benchmarkProfileName) benchmarkProfileName.textContent = currentBenchmarkProfileName;

        // Added importance to benchmarkSkills
        const benchmarkSkills = [
            { name: "Python", level: 7, importance: "High" }, 
            { name: "JavaScript", level: 8, importance: "High" },
            { name: "System Design", level: 8, importance: "Critical" }, 
            { name: "Cloud (AWS)", level: 6, importance: "Medium" },
            { name: "Agile Methodologies", level: 7, importance: "High" }, 
            { name: "Communication", level: 7, importance: "Critical" }
        ];

        const candidateSkills = candidateData.skills || candidateData.matchedSkills || [];
        const skillLabels = benchmarkSkills.map(s => s.name);
        
        const candidateSkillLevels = skillLabels.map(label => {
            const skill = candidateSkills.find(s => (typeof s === 'string' ? s === label : s.name === label));
            return skill ? (typeof skill === 'object' ? skill.level : Math.floor(Math.random() * 3) + 6) : Math.floor(Math.random() * 5) + 1; // Existing logic for skill level
        });
        const benchmarkSkillLevels = benchmarkSkills.map(s => s.level);

        // Robust chart rendering logic
        function renderPageChart() {
            if (!radarChartCanvas || !radarChartCanvas.offsetParent) {
                requestAnimationFrame(renderPageChart);
                return;
            }
            if (radarChartCanvas.width === 0 || radarChartCanvas.height === 0) {
                const computedStyle = getComputedStyle(radarChartCanvas);
                if (computedStyle.width && computedStyle.width !== 'auto' && computedStyle.width !== '0px') {
                    radarChartCanvas.width = parseInt(computedStyle.width, 10);
                }
                if (computedStyle.height && computedStyle.height !== 'auto' && computedStyle.height !== '0px') {
                    radarChartCanvas.height = parseInt(computedStyle.height, 10);
                }
                if (radarChartCanvas.width === 0 || radarChartCanvas.height === 0) {
                    requestAnimationFrame(renderPageChart);
                    return;
                }
            }
            const ctx = radarChartCanvas.getContext('2d');
            if (!ctx) {
                console.error("Failed to get 2D context from pageSkillRadarChart canvas!");
                return;
            }
            if (pageChartInstance) {
                pageChartInstance.destroy();
            }
            pageChartInstance = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: skillLabels,
                    datasets: [{
                        label: candidateData.name || 'Candidate',
                        data: candidateSkillLevels,
                        fill: true,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgb(54, 162, 235)',
                        pointBackgroundColor: 'rgb(54, 162, 235)',
                    }, {
                        label: 'Benchmark',
                        data: benchmarkSkillLevels,
                        fill: true,
                        backgroundColor: 'rgba(201, 203, 207, 0.2)',
                        borderColor: 'rgb(201, 203, 207)',
                        pointBackgroundColor: 'rgb(201, 203, 207)',
                    }]
                },
                options: {
                    elements: { 
                        line: { borderWidth: 2 },
                        point: {
                            radius: 3, // Default radius
                            hoverRadius: 3 // Keep hover radius same as normal
                        }
                    },
                    scales: { r: { angleLines: { display: true }, suggestedMin: 0, suggestedMax: 10, ticks: { stepSize: 2 } } },
                    responsive: true, 
                    maintainAspectRatio: false, // Set to false if container provides aspect ratio
                    plugins: {
                        tooltip: {
                            enabled: false // Disable tooltips
                        }
                    },
                    interaction: { // Further minimize hover interactions if needed
                        mode: 'point', // Can restrict to 'point'
                        intersect: false // If true, hover only triggers on direct hit
                    }
                }
            });
        }
        requestAnimationFrame(renderPageChart);


        if (summaryTableBody) summaryTableBody.innerHTML = ''; 
        let totalCandidateScore = 0;
        let totalBenchmarkScore = 0;
        let skillsExceedingBenchmark = 0;
        let skillsBelowBenchmarkDetails = []; // Store more details for insights
        let criticalSkillGaps = [];
        let notableStrengths = [];


        benchmarkSkills.forEach(benchSkill => {
            const candSkillObj = candidateSkills.find(s => (typeof s === 'string' ? s === benchSkill.name : s.name === benchSkill.name));
            const candLevel = candSkillObj ? (typeof candSkillObj === 'object' ? candSkillObj.level : (Math.floor(Math.random() * 3) + 6) ) : Math.floor(Math.random() * 5) + 1; // Existing random logic if skill level not present
            const benchLevel = benchSkill.level;
            const importance = benchSkill.importance || "Medium";
            const gap = candLevel - benchLevel;

            totalCandidateScore += candLevel;
            totalBenchmarkScore += benchLevel;

            if (gap >= 0) {
                skillsExceedingBenchmark++;
                 if (gap > 1 && (importance === "Critical" || importance === "High")) {
                    notableStrengths.push({ name: benchSkill.name, candidateLevel: candLevel, benchmarkLevel: benchLevel, importance: importance });
                }
            } else {
                skillsBelowBenchmarkDetails.push({ name: benchSkill.name, gap: gap, importance: importance });
                if (importance === "Critical") {
                    criticalSkillGaps.push({ name: benchSkill.name, gap: gap });
                }
            }

            if (summaryTableBody) {
                const row = summaryTableBody.insertRow();
                row.insertCell().textContent = benchSkill.name;
                row.insertCell().textContent = importance; // Display Importance
                row.insertCell().textContent = candLevel;
                row.insertCell().textContent = benchLevel;
                const gapCell = row.insertCell();
                gapCell.textContent = gap;
                
                gapCell.classList.remove('gap-positive', 'gap-negative', 'gap-neutral', 'gap-critical', 'gap-high-importance'); // Clear previous
                if (gap > 0) gapCell.classList.add('gap-positive');
                else if (gap < 0) {
                    gapCell.classList.add('gap-negative');
                    if (importance === "Critical") gapCell.classList.add('gap-critical');
                    else if (importance === "High") gapCell.classList.add('gap-high-importance');
                } else {
                    gapCell.classList.add('gap-neutral');
                }
            }
        });
        
        const overallMatchPercentage = totalBenchmarkScore > 0 ? Math.round((totalCandidateScore / totalBenchmarkScore) * 100) : 0;
        const cappedMatchPercentage = Math.min(overallMatchPercentage, 100);

        if (overallMatchScoreValue) overallMatchScoreValue.textContent = cappedMatchPercentage + '%';
        if (overallMatchProgressBar) overallMatchProgressBar.style.width = cappedMatchPercentage + '%';
        
        let matchLabel = '';
        if (cappedMatchPercentage >= 90) matchLabel = "Excellent Match";
        else if (cappedMatchPercentage >= 75) matchLabel = "Strong Match";
        else if (cappedMatchPercentage >= 60) matchLabel = "Good Fit, Some Gaps";
        else if (cappedMatchPercentage >= 40) matchLabel = "Potential with Development";
        else matchLabel = "Significant Gaps";

        if (matchScoreText) matchScoreText.innerHTML = `Matches ${cappedMatchPercentage}% of benchmark. <br><strong id="pageQualitativeMatchLabel">${matchLabel}</strong>`;


        if (insightsList) {
            insightsList.innerHTML = ''; // Clear loading
            
            insightsList.insertAdjacentHTML('beforeend', `<li><i class="fas fa-check-circle"></i>Candidate meets or exceeds benchmark in <strong>${skillsExceedingBenchmark}</strong> of ${benchmarkSkills.length} skills.</li>`);

            if (notableStrengths.length > 0) {
                notableStrengths.forEach(strength => {
                    insightsList.insertAdjacentHTML('beforeend', `<li><i class="fas fa-star"></i><strong>Notable Strength:</strong> ${strength.name} (Candidate: ${strength.candidateLevel}, Benchmark: ${strength.benchmarkLevel}). Leverage this.</li>`);
                });
            }

            const skillsBelowBenchmarkNames = skillsBelowBenchmarkDetails.map(s => s.name);
            if (skillsBelowBenchmarkNames.length > 0) {
                insightsList.insertAdjacentHTML('beforeend', `<li><i class="fas fa-exclamation-triangle"></i>Skills requiring improvement: ${skillsBelowBenchmarkNames.join(', ')}.</li>`);
                if (criticalSkillGaps.length > 0) {
                     insightsList.insertAdjacentHTML('beforeend', `<li><i class="fas fa-bomb"></i><strong>Critical Skill Gaps:</strong> ${criticalSkillGaps.map(s => `${s.name} (Gap: ${s.gap})`).join(', ')}. These require careful consideration.</li>`);
                }
                insightsList.insertAdjacentHTML('beforeend', `<li><i class="fas fa-graduation-cap"></i>Consider targeted Skillsoft training paths to address identified gaps.</li>`);
            } else if (notableStrengths.length > 0) {
                insightsList.insertAdjacentHTML('beforeend', `<li><i class="fas fa-thumbs-up"></i>Candidate meets or exceeds all benchmarked skills!</li>`);
            }

            let interviewFocusHTML = '<li><i class="fas fa-search"></i><strong>Interview Focus Areas:</strong><ul>';
            if (criticalSkillGaps.length > 0) {
                criticalSkillGaps.forEach(gap => {
                    interviewFocusHTML += `<li>Probe deeper into <strong>${gap.name}</strong> experience and assess potential for rapid upskilling.</li>`;
                });
            } else if (skillsBelowBenchmarkDetails.some(s => s.importance === "High")) {
                 const highImpGap = skillsBelowBenchmarkDetails.find(s => s.importance === "High");
                 interviewFocusHTML += `<li>Assess <strong>${highImpGap.name}</strong>; while not critical, it's a high importance skill with a gap.</li>`;
            } else {
                interviewFocusHTML += '<li>Candidate profile appears strong against benchmark. Focus on behavioral aspects and role fit.</li>';
            }
            if (notableStrengths.length > 0) {
                 interviewFocusHTML += `<li>Explore how notable strengths like <strong>${notableStrengths.map(s=>s.name).join('/')}</strong> can be leveraged in the role.</li>`;
            }
            interviewFocusHTML += '</ul></li>';
            insightsList.insertAdjacentHTML('beforeend', interviewFocusHTML);
        }
    }
});
