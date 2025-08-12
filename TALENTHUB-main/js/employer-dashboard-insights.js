document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements for Workforce Insights
    const totalEmployeesElement = document.getElementById('total-employees');
    const avgRoleFitElement = document.getElementById('avg-role-fit');
    const internalMobilityReadinessElement = document.getElementById('internal-mobility-readiness');
    const criticalSkillGapsListElement = document.getElementById('critical-skill-gaps-list');
    const keyCompetenciesChartElement = document.getElementById('key-competencies-chart');

    // DOM Elements for Open Opportunities Overview
    const totalOpenRolesElement = document.getElementById('total-open-roles');
    const openRolesByDepartmentListElement = document.getElementById('open-roles-by-department-list');
    const inDemandSkillsListElement = document.getElementById('in-demand-skills-list');

    // DOM Elements for Enterprise Talent Alignment
    const skillMatchDistributionListElement = document.getElementById('skill-match-distribution-list');
    const mostCommonStrengthsListElement = document.getElementById('most-common-strengths-list');
    const mostCommonDevAreasListElement = document.getElementById('most-common-dev-areas-list');
    const topInternalPipelineRolesListElement = document.getElementById('top-internal-pipeline-roles-list');
    const overallInternalFillPotentialElement = document.getElementById('overall-internal-fill-potential');


    async function loadDashboardData() {
        try {
            const response = await fetch('/data/sample-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            populateWorkforceInsights(data.platformCandidates);
            populateOpenOpportunities(data.opportunities);
            populateEnterpriseTalentAlignment(data.platformCandidates, data.opportunities);

        } catch (error) {
            console.error("Failed to load employer dashboard data:", error);
            // Display error messages in the UI
            if (totalEmployeesElement) totalEmployeesElement.textContent = 'Error';
            if (avgRoleFitElement) avgRoleFitElement.textContent = 'Error';
            if (internalMobilityReadinessElement) internalMobilityReadinessElement.textContent = 'Error';
            if (criticalSkillGapsListElement) criticalSkillGapsListElement.innerHTML = '<li>Error loading data</li>';
            if (totalOpenRolesElement) totalOpenRolesElement.textContent = 'Error';
            if (openRolesByDepartmentListElement) openRolesByDepartmentListElement.innerHTML = '<li>Error loading data</li>';
            if (inDemandSkillsListElement) inDemandSkillsListElement.innerHTML = '<li>Error loading data</li>';
            // if (candidatePipelineListElement) candidatePipelineListElement.innerHTML = '<li>Error loading data</li>'; // Removed
            if (skillMatchDistributionListElement) skillMatchDistributionListElement.innerHTML = '<li>Error loading data</li>';
            if (mostCommonStrengthsListElement) mostCommonStrengthsListElement.innerHTML = '<li>Error loading data</li>';
            if (mostCommonDevAreasListElement) mostCommonDevAreasListElement.innerHTML = '<li>Error loading data</li>';
            if (topInternalPipelineRolesListElement) topInternalPipelineRolesListElement.innerHTML = '<li>Error loading data</li>';
            if (overallInternalFillPotentialElement) overallInternalFillPotentialElement.textContent = 'Error';
        }
    }

    function populateWorkforceInsights(candidates) {
        if (!candidates || candidates.length === 0) {
            if (totalEmployeesElement) totalEmployeesElement.textContent = '0';
            if (avgRoleFitElement) avgRoleFitElement.textContent = 'N/A';
            if (internalMobilityReadinessElement) internalMobilityReadinessElement.textContent = 'N/A';
            if (criticalSkillGapsListElement) criticalSkillGapsListElement.innerHTML = '<li>No candidate data</li>';
            if (keyCompetenciesChartElement) keyCompetenciesChartElement.innerHTML = '<div class="skill-bar"><span class="skill-name">No competency data</span></div>';
            return;
        }

        // Total Employees - Displaying a representative larger number for demo purposes
        if (totalEmployeesElement) totalEmployeesElement.textContent = '750'; 

        // Average Role Fit (calculated from actual data)
        let totalMatchPercent = 0;
        let candidatesWithMatchPercent = 0;
        candidates.forEach(candidate => {
            if (typeof candidate.matchPercent === 'number') {
                totalMatchPercent += candidate.matchPercent;
                candidatesWithMatchPercent++;
            }
        });
        if (avgRoleFitElement) {
            avgRoleFitElement.textContent = candidatesWithMatchPercent > 0 
                ? `${Math.round(totalMatchPercent / candidatesWithMatchPercent)}%` 
                : 'N/A';
        }

        // Internal Mobility Readiness
        const readyToApplyCount = candidates.filter(c => c.readyToApply === true).length;
        if (internalMobilityReadinessElement) {
            internalMobilityReadinessElement.textContent = candidates.length > 0
                ? `${Math.round((readyToApplyCount / candidates.length) * 100)}%`
                : 'N/A';
        }
        
        // Top Critical Skill Gaps
        if (criticalSkillGapsListElement) {
            const skillGapCounts = {};
            candidates.forEach(candidate => {
                if (candidate.missingSkills) {
                    candidate.missingSkills.forEach(skill => {
                        if (skill.severity === 'critical') {
                            skillGapCounts[skill.name] = (skillGapCounts[skill.name] || 0) + 1;
                        }
                    });
                }
            });
            const sortedGaps = Object.entries(skillGapCounts).sort(([,a],[,b]) => b-a).slice(0, 5); // Top 5
            criticalSkillGapsListElement.innerHTML = '';
            if (sortedGaps.length > 0) {
                sortedGaps.forEach(([skillName, count]) => {
                    const li = document.createElement('li');
                    li.textContent = `${skillName} (Gap in ${count} employees)`;
                    li.classList.add('interactive-item');
                    li.addEventListener('click', () => console.log(`Clicked critical skill gap: ${skillName}`));
                    criticalSkillGapsListElement.appendChild(li);
                });
            } else {
                criticalSkillGapsListElement.innerHTML = '<li>No critical skill gaps identified.</li>';
            }
        }

        // Key Competencies (Organization-wide)
        if (keyCompetenciesChartElement) {
            const competencyCounts = {};
            candidates.forEach(candidate => {
                if (candidate.skills) {
                    candidate.skills.forEach(skill => {
                        competencyCounts[skill.name] = (competencyCounts[skill.name] || 0) + 1;
                    });
                }
            });
            // Get top 5 competencies
            const sortedCompetencies = Object.entries(competencyCounts)
                .sort(([,a],[,b]) => b-a)
                .slice(0, 5);

            keyCompetenciesChartElement.innerHTML = ''; // Clear placeholder/previous
            if (sortedCompetencies.length > 0) {
                sortedCompetencies.forEach(([name, rawCount]) => {
                    // For demo, assign a high percentage, e.g., 70-95%
                    // This isn't a real percentage of employees *having* it as a top skill,
                    // but rather an illustrative "strength" percentage for that competency.
                    const illustrativePercentage = Math.floor(Math.random() * (95 - 70 + 1)) + 70;

                    const skillBarDiv = document.createElement('div');
                    skillBarDiv.classList.add('skill-bar');
                    
                    const skillNameSpan = document.createElement('span');
                    skillNameSpan.classList.add('skill-name');
                    skillNameSpan.textContent = name;
                    
                    const barContainerDiv = document.createElement('div');
                    barContainerDiv.classList.add('bar-container');
                    const barDiv = document.createElement('div');
                    barDiv.classList.add('bar');
                    barDiv.style.width = `${illustrativePercentage}%`;
                    // Optional: Vary bar color based on name or index for more visual appeal
                    // barDiv.style.backgroundColor = `hsl(${ (sortedCompetencies.indexOf(sortedCompetencies.find(sc => sc[0] === name)) * 60) % 360 }, 70%, 50%)`;
                    barContainerDiv.appendChild(barDiv);
                    
                    const skillValueSpan = document.createElement('span');
                    skillValueSpan.classList.add('skill-value');
                    skillValueSpan.textContent = `${illustrativePercentage}%`;
                    
                    skillBarDiv.appendChild(skillNameSpan);
                    skillBarDiv.appendChild(barContainerDiv);
                    skillBarDiv.appendChild(skillValueSpan);
                    keyCompetenciesChartElement.appendChild(skillBarDiv);
                });
            } else {
                keyCompetenciesChartElement.innerHTML = '<div class="skill-bar"><span class="skill-name">No competency data available.</span></div>';
            }
        }
    }

    function populateOpenOpportunities(opportunities) {
        if (!opportunities || opportunities.length === 0) {
            if (totalOpenRolesElement) totalOpenRolesElement.textContent = '0';
            if (openRolesByDepartmentListElement) openRolesByDepartmentListElement.innerHTML = '<li>No open opportunities</li>';
            if (inDemandSkillsListElement) inDemandSkillsListElement.innerHTML = '<li>No skill data for open roles</li>';
            return;
        }

        // Total Open Roles
        if (totalOpenRolesElement) totalOpenRolesElement.textContent = opportunities.length;

        // Open Roles by Department
        if (openRolesByDepartmentListElement) {
            const rolesByDept = {};
            opportunities.forEach(opp => {
                rolesByDept[opp.department] = (rolesByDept[opp.department] || 0) + 1;
            });
            openRolesByDepartmentListElement.innerHTML = '';
            Object.entries(rolesByDept).sort(([,a],[,b]) => b-a).forEach(([dept, count]) => {
                const li = document.createElement('li');
                li.textContent = `${dept}: ${count} open roles`;
                li.classList.add('interactive-item');
                li.addEventListener('click', () => console.log(`Clicked department: ${dept}`));
                openRolesByDepartmentListElement.appendChild(li);
            });
        }

        // Most In-Demand Skills
        if (inDemandSkillsListElement) {
            const skillCounts = {};
            opportunities.forEach(opp => {
                if (opp.requiredSkills) {
                    opp.requiredSkills.forEach(skill => {
                        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                    });
                }
            });
            const sortedSkills = Object.entries(skillCounts).sort(([,a],[,b]) => b-a).slice(0, 5); // Top 5
            inDemandSkillsListElement.innerHTML = '';
            if (sortedSkills.length > 0) {
                sortedSkills.forEach(([skillName, count]) => {
                    const li = document.createElement('li');
                    li.textContent = `${skillName} (Required in ${count} roles)`;
                    li.classList.add('interactive-item');
                    li.addEventListener('click', () => console.log(`Clicked in-demand skill: ${skillName}`));
                    inDemandSkillsListElement.appendChild(li);
                });
            } else {
                inDemandSkillsListElement.innerHTML = '<li>No specific skills listed for open roles.</li>';
            }
        }
    }

    // populateCandidatePipeline function is removed

    loadDashboardData();

    function populateEnterpriseTalentAlignment(candidates, opportunities) {
        if (!candidates || candidates.length === 0) {
            if (skillMatchDistributionListElement) skillMatchDistributionListElement.innerHTML = '<li>No candidate data</li>';
            if (mostCommonStrengthsListElement) mostCommonStrengthsListElement.innerHTML = '<li>No candidate data</li>';
            if (mostCommonDevAreasListElement) mostCommonDevAreasListElement.innerHTML = '<li>No candidate data</li>';
            if (topInternalPipelineRolesListElement) topInternalPipelineRolesListElement.innerHTML = '<li>No candidate/opportunity data</li>';
            if (overallInternalFillPotentialElement) overallInternalFillPotentialElement.textContent = 'N/A';
            return;
        }

        // Skill Match Distribution
        if (skillMatchDistributionListElement) {
            const distribution = {
                '0-20%': 0, '21-40%': 0, '41-60%': 0, '61-80%': 0, '81-100%': 0, 'N/A': 0
            };
            candidates.forEach(c => {
                if (typeof c.matchPercent === 'number') {
                    if (c.matchPercent <= 20) distribution['0-20%']++;
                    else if (c.matchPercent <= 40) distribution['21-40%']++;
                    else if (c.matchPercent <= 60) distribution['41-60%']++;
                    else if (c.matchPercent <= 80) distribution['61-80%']++;
                    else distribution['81-100%']++;
                } else {
                    distribution['N/A']++;
                }
            });
            skillMatchDistributionListElement.innerHTML = '';
            Object.entries(distribution).forEach(([range, count]) => {
                if (count > 0) {
                    const li = document.createElement('li');
                    const percentage = ((count / candidates.length) * 100).toFixed(1);
                    li.textContent = `${range}: ${count} employees (${percentage}%)`;
                    // This list is less likely to be interactive per item, but could be.
                    skillMatchDistributionListElement.appendChild(li);
                }
            });
        }

        // Most Common Strengths
        if (mostCommonStrengthsListElement) {
            const skillCounts = {};
            candidates.forEach(c => {
                if (c.skills) {
                    c.skills.forEach(skill => {
                        skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1;
                    });
                }
            });
            const sortedStrengths = Object.entries(skillCounts).sort(([,a],[,b]) => b-a).slice(0, 5);
            mostCommonStrengthsListElement.innerHTML = '';
            if (sortedStrengths.length > 0) {
                sortedStrengths.forEach(([skillName, count]) => {
                    const li = document.createElement('li');
                    li.textContent = `${skillName} (Present in ${count} employees)`;
                    li.classList.add('interactive-item');
                    li.addEventListener('click', () => console.log(`Clicked common strength: ${skillName}`));
                    mostCommonStrengthsListElement.appendChild(li);
                });
            } else {
                mostCommonStrengthsListElement.innerHTML = '<li>No common strengths identified.</li>';
            }
        }

        // Most Common Development Areas (All Severities)
        if (mostCommonDevAreasListElement) {
            const missingSkillCounts = {};
            candidates.forEach(c => {
                if (c.missingSkills) {
                    c.missingSkills.forEach(skill => {
                        missingSkillCounts[skill.name] = (missingSkillCounts[skill.name] || 0) + 1;
                    });
                }
            });
            const sortedDevAreas = Object.entries(missingSkillCounts).sort(([,a],[,b]) => b-a).slice(0, 5);
            mostCommonDevAreasListElement.innerHTML = '';
            if (sortedDevAreas.length > 0) {
                sortedDevAreas.forEach(([skillName, count]) => {
                    const li = document.createElement('li');
                    li.textContent = `${skillName} (Missing in ${count} employees)`;
                    li.classList.add('interactive-item');
                    li.addEventListener('click', () => console.log(`Clicked common dev area: ${skillName}`));
                    mostCommonDevAreasListElement.appendChild(li);
                });
            } else {
                mostCommonDevAreasListElement.innerHTML = '<li>No common development areas identified.</li>';
            }
        }
        
        // Internal Mobility & Opportunity Alignment
        if (opportunities && opportunities.length > 0) {
            const opportunityMatchData = opportunities.map(opp => {
                let strongInternalCandidates = 0;
                if (opp.requiredSkills && opp.requiredSkills.length > 0) {
                    candidates.forEach(candidate => {
                        if (candidate.skills && candidate.readyToApply) {
                            const candidateSkillNames = candidate.skills.map(s => s.name);
                            const matchedCount = opp.requiredSkills.filter(reqSkill => candidateSkillNames.includes(reqSkill)).length;
                            // Define "strong match" as matching at least 75% of required skills for simplicity
                            if ((matchedCount / opp.requiredSkills.length) >= 0.75) {
                                strongInternalCandidates++;
                            }
                        }
                    });
                }
                return { title: opp.title, department: opp.department, strongInternalCandidates };
            });

            // Top Roles with Strong Internal Pipelines
            if (topInternalPipelineRolesListElement) {
                const sortedRoles = opportunityMatchData.sort((a,b) => b.strongInternalCandidates - a.strongInternalCandidates).slice(0, 5);
                topInternalPipelineRolesListElement.innerHTML = '';
                if (sortedRoles.some(r => r.strongInternalCandidates > 0)) {
                    sortedRoles.forEach(role => {
                        if (role.strongInternalCandidates > 0) {
                            const li = document.createElement('li');
                            li.textContent = `${role.title} (${role.department}) - ${role.strongInternalCandidates} strong internal candidate(s)`;
                            li.classList.add('interactive-item');
                            li.addEventListener('click', () => console.log(`Clicked pipeline role: ${role.title}`));
                            topInternalPipelineRolesListElement.appendChild(li);
                        }
                    });
                } else {
                    topInternalPipelineRolesListElement.innerHTML = '<li>No open roles with strong internal candidate matches found.</li>';
                }
            }

            // Overall Internal Fill Potential
            if (overallInternalFillPotentialElement) {
                const rolesWithAtLeastOneStrongCandidate = opportunityMatchData.filter(r => r.strongInternalCandidates > 0).length;
                const potentialPercentage = opportunities.length > 0 ? Math.round((rolesWithAtLeastOneStrongCandidate / opportunities.length) * 100) : 0;
                overallInternalFillPotentialElement.textContent = `${potentialPercentage}%`;
            }

        } else {
            if (topInternalPipelineRolesListElement) topInternalPipelineRolesListElement.innerHTML = '<li>No open opportunities to analyze.</li>';
            if (overallInternalFillPotentialElement) overallInternalFillPotentialElement.textContent = 'N/A';
        }
    }

    // populateHiringSnapshot and createDonutChart functions are removed.
});
