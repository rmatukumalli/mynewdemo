const skillGapsModule = {
    init: function(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
        const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
        const panelsContainer = contentWrapper.querySelector('.panels-container');

        actionButtonContainer.innerHTML = ``;
        
        panelsContainer.innerHTML = `
            <div class="bg-white w-full h-full rounded-lg shadow-2xl flex flex-col col-span-3 overflow-x-auto"> <!-- Added overflow-x-auto here -->
            <!-- Modal Header -->
            <div class="flex justify-between items-center p-6 border-b">
                <h2 class="text-2xl font-semibold text-gray-800">Skill Gap Analytics: Cadet Pilot</h2>
            </div>

            <!-- Modal Body -->
            <div class="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Column: Analytics & Talent Supply -->
                <div class="flex flex-col gap-8">
                    <div class="bg-gray-50 rounded-lg p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-700 mb-4">Skill Category Overview</h3>
                        <div class="w-full h-80 flex items-center justify-center">
                            <!-- Canvas for the Radar Chart -->
                            <canvas id="skillGapRadarChart"></canvas>
                        </div>
                    </div>
                     <div class="bg-gray-50 rounded-lg p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-700 mb-4">Top Internal Candidates (for Upskilling)</h3>
                         <ul class="space-y-3">
                             <!-- Candidate Item 1 -->
                             <li class="flex items-center justify-between p-3 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                                 <div class="flex items-center">
                                     <img src="https://placehold.co/40x40/E2E8F0/4A5568?text=AV" alt="Avatar for Alice Vance" class="rounded-full mr-4">
                                     <div>
                                         <p class="font-medium">Alice Vance</p>
                                         <p class="text-sm text-gray-600">85% Skill Match</p>
                                     </div>
                                 </div>
                                 <button class="text-sm text-blue-600 hover:underline font-semibold">View Profile</button>
                             </li>
                             <!-- Candidate Item 2 -->
                              <li class="flex items-center justify-between p-3 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                                 <div class="flex items-center">
                                     <img src="https://placehold.co/40x40/E2E8F0/4A5568?text=BM" alt="Avatar for Bob Miller" class="rounded-full mr-4">
                                     <div>
                                         <p class="font-medium">Bob Miller</p>
                                         <p class="text-sm text-gray-600">82% Skill Match</p>
                                     </div>
                                 </div>
                                 <button class="text-sm text-blue-600 hover:underline font-semibold">View Profile</button>
                             </li>
                              <!-- Candidate Item 3 -->
                              <li class="flex items-center justify-between p-3 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                                 <div class="flex items-center">
                                     <img src="https://placehold.co/40x40/E2E8F0/4A5568?text=CJ" alt="Avatar for Chloe Jones" class="rounded-full mr-4">
                                     <div>
                                         <p class="font-medium">Chloe Jones</p>
                                         <p class="text-sm text-gray-600">78% Skill Match</p>
                                     </div>
                                 </div>
                                 <button class="text-sm text-blue-600 hover:underline font-semibold">View Profile</button>
                             </li>
                         </ul>
                     </div>
                </div>
                <!-- Right Column: Top Skill Gaps & External Market -->
                <div class="flex flex-col gap-8">
                    <div class="bg-gray-50 rounded-lg p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-700 mb-4">Top Skill Gaps</h3>
                        <ul class="space-y-4">
                            <!-- Skill Gap Item 1 -->
                            <li class="flex justify-between items-center p-3 bg-white rounded-md border">
                                <div>
                                    <p class="font-medium text-gray-800">Aerodynamics</p>
                                    <p class="text-sm text-gray-500">Required: Expert | Internal Average: Intermediate</p>
                                </div>
                                <span class="text-sm font-bold text-red-500 bg-red-100 px-2 py-1 rounded-full">HIGH GAP</span>
                            </li>
                            <!-- Skill Gap Item 2 -->
                            <li class="flex justify-between items-center p-3 bg-white rounded-md border">
                                <div>
                                    <p class="font-medium text-gray-800">Meteorology</p>
                                    <p class="text-sm text-gray-500">Required: Advanced | Internal Average: Beginner</p>
                                </div>
                                <span class="text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">CRITICAL GAP</span>
                            </li>
                            <!-- Skill Gap Item 3 -->
                            <li class="flex justify-between items-center p-3 bg-white rounded-md border">
                                <div>
                                    <p class="font-medium text-gray-800">Navigation</p>
                                    <p class="text-sm text-gray-500">Required: Advanced | Internal Average: N/A</p>
                                </div>
                                 <span class="text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">CRITICAL GAP</span>
                            </li>
                        </ul>
                    </div>
                     <div class="bg-gray-50 rounded-lg p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-700 mb-4">External Market: <span class="font-bold text-blue-600">Navigation</span></h3>
                         <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                             <div><p class="text-gray-600">Avg. Salary:</p><p class="font-semibold text-lg text-gray-800">$95,000</p></div>
                             <div><p class="text-gray-600">Talent Availability:</p><p class="font-semibold text-lg text-yellow-600">Medium</p></div>
                             <div class="col-span-1 sm:col-span-2"><p class="text-gray-600">Top Locations:</p><p class="font-semibold text-gray-800">Dallas, TX; Phoenix, AZ; Miami, FL</p></div>
                         </div>
                     </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex flex-wrap justify-end items-center gap-4 p-6 border-t bg-gray-50 rounded-b-lg">
                <button class="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600 transition-colors">Create Learning Paths</button>
                <button class="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">Source External Candidates</button>
            </div>
            </div>`;

        function renderRadarChart() {
            const ctx = document.getElementById('skillGapRadarChart').getContext('2d');

            // Proficiency levels mapped to numbers for charting
            // N/A: 0, Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4
            const requiredSkillsData = [4, 3, 4, 3, 2]; // Expert, Advanced, Expert, Advanced, Intermediate
            const internalAverageData = [2, 1, 3, 0, 2]; // Intermediate, Beginner, Advanced, N/A, Intermediate
            
            // Destroy existing chart instance if it exists to prevent duplicates
            if (window.skillChart) {
                window.skillChart.destroy();
            }

            window.skillChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Flight Planning', 'Navigation', 'Aerodynamics', 'Meteorology', 'Crew Resource Management'],
                    datasets: [{
                        label: 'Required Proficiency',
                        data: requiredSkillsData,
                        backgroundColor: 'rgba(59, 130, 246, 0.2)', // Blue
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
                    }, {
                        label: 'Internal Average',
                        data: internalAverageData,
                        backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red
                        borderColor: 'rgba(239, 68, 68, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(239, 68, 68, 1)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            },
                            suggestedMin: 0,
                            suggestedMax: 4,
                            pointLabels: {
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                stepSize: 1,
                                // Display labels for proficiency levels
                                callback: function(value) {
                                    const labels = ['N/A', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
                                    return labels[value] || '';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                             callbacks: {
                                label: function(context) {
                                    const labels = ['N/A', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += labels[context.raw] || 'Unknown';
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
        renderRadarChart();
    }
};

window.skillGapsModule = skillGapsModule;
