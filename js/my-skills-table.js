document.addEventListener('DOMContentLoaded', () => {
    const skillsData = [
        // Certified
        { skillName: 'Airline Transport Pilot License (ATPL)', proficiencyLevel: 'Expert', acquisitionDate: '2023-01-15', verificationStatus: 'Certified', category: 'Certified' },
        { skillName: 'Type Rating: Boeing 737', proficiencyLevel: 'Advanced', acquisitionDate: '2022-11-20', verificationStatus: 'Certified', category: 'Certified' },
        // Verified
        { skillName: 'Crew Resource Management (CRM)', proficiencyLevel: 'Advanced', acquisitionDate: '2023-03-10', verificationStatus: 'Verified by Manager', category: 'Verified' },
        { skillName: 'Flight Planning & Navigation Systems', proficiencyLevel: 'Intermediate', acquisitionDate: '2023-05-01', verificationStatus: 'Verified by Peer', category: 'Verified' },
        { skillName: 'Safety Management Systems (SMS)', proficiencyLevel: 'Advanced', acquisitionDate: '2022-09-01', verificationStatus: 'Verified by Manager\'s Manager', category: 'Verified' },
        // Unverified
        { skillName: 'Aerodynamics Knowledge', proficiencyLevel: 'Expert', acquisitionDate: '2020-06-01', verificationStatus: 'Inferred from Resume', category: 'Unverified' },
        { skillName: 'Meteorology Interpretation', proficiencyLevel: 'Intermediate', acquisitionDate: '2021-02-10', verificationStatus: 'Inferred from Profile', category: 'Unverified' },
        { skillName: 'Aviation Regulations (FAA/EASA)', proficiencyLevel: 'Beginner', acquisitionDate: '2023-08-01', verificationStatus: 'Inferred from Resume', category: 'Unverified' },
        // LMS Acquired
        { skillName: 'Human Factors in Aviation', proficiencyLevel: 'Intermediate', acquisitionDate: '2023-07-20', verificationStatus: 'LMS Course Completion', category: 'LMS Acquired' },
        { skillName: 'Air Traffic Control Procedures', proficiencyLevel: 'Intermediate', acquisitionDate: '2023-04-15', verificationStatus: 'LMS Course Completion', category: 'LMS Acquired' },
        { skillName: 'Emergency Procedures Training', proficiencyLevel: 'Advanced', acquisitionDate: '2023-09-01', verificationStatus: 'LMS Course Completion', category: 'LMS Acquired' }
    ];

    const tableBody = document.getElementById('mySkillsTableBody');
    const searchInput = document.getElementById('mySkillsSearchInput');
    const categoryCountsContainer = document.getElementById('mySkillsCategoryCounts');
    const tableHeaders = document.querySelectorAll('#mySkillsTable th[data-column]');

    let currentSortColumn = null;
    let currentSortDirection = 'asc';

    const verificationIcons = {
        'Certified': 'fas fa-certificate icon-certified',
        'Verified by Manager': 'fas fa-user-check icon-verified',
        'Verified by Peer': 'fas fa-users-cog icon-verified',
        'Verified by Manager\'s Manager': 'fas fa-user-tie icon-verified',
        'Inferred from Resume': 'far fa-file-alt icon-unverified',
        'Inferred from Profile': 'far fa-id-badge icon-unverified',
        'LMS Course Completion': 'fas fa-graduation-cap icon-lms'
    };

    const categoryDisplayNames = {
        'Certified': '<i class="fas fa-certificate icon-certified"></i> Certified Skills',
        'Verified': '<i class="fas fa-user-check icon-verified"></i> Verified Skills',
        'Unverified': '<i class="far fa-file-alt icon-unverified"></i> Unverified Skills',
        'LMS Acquired': '<i class="fas fa-graduation-cap icon-lms"></i> LMS Acquired Skills'
    };

    const categoryExplanations = {
        'Certified': '<i class="fas fa-award explanation-icon"></i> Skills validated by formal certifications or official accreditations.',
        'Verified': '<i class="fas fa-check-circle explanation-icon"></i> Skills confirmed by a manager, peer, or manager\'s manager within the organization.',
        'Unverified': '<i class="fas fa-search explanation-icon"></i> Skills inferred from documents like resumes or profiles, pending formal verification.',
        'LMS Acquired': '<i class="fas fa-book-reader explanation-icon"></i> Skills gained through completion of courses on the Learning Management System.'
    };

    function getCategoryIcon(category) {
        switch (category) {
            case 'Certified': return 'fas fa-certificate icon-certified';
            case 'Verified': return 'fas fa-user-check icon-verified';
            case 'Unverified': return 'far fa-file-alt icon-unverified';
            case 'LMS Acquired': return 'fas fa-graduation-cap icon-lms';
            default: return 'fas fa-question-circle';
        }
    }


    function renderTable(dataToRender) {
        tableBody.innerHTML = '';
        if (!dataToRender || dataToRender.length === 0) {
            const row = tableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 4;
            cell.textContent = 'No skills match your criteria.';
            cell.style.textAlign = 'center';
            return;
        }

        const groupedSkills = dataToRender.reduce((acc, skill) => {
            const category = skill.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(skill);
            return acc;
        }, {});

        const categoryOrder = ['Certified', 'Verified', 'Unverified', 'LMS Acquired'];
        
        categoryOrder.forEach(category => {
            if (groupedSkills[category] && groupedSkills[category].length > 0) {
                const groupHeaderRow = tableBody.insertRow();
                groupHeaderRow.className = 'group-header';
                const groupHeaderCell = groupHeaderRow.insertCell();
                groupHeaderCell.colSpan = 4;
                groupHeaderCell.innerHTML = `<i class="${getCategoryIcon(category)}"></i> ${categoryDisplayNames[category] || category}`;
                
                // Add explanation row
                if (categoryExplanations[category]) {
                    const explanationRow = tableBody.insertRow();
                    explanationRow.className = `category-explanation ${category.toLowerCase().replace(' ', '-')}-explanation`;
                    const explanationCell = explanationRow.insertCell();
                    explanationCell.colSpan = 4;
                    explanationCell.innerHTML = categoryExplanations[category]; // Use innerHTML to render icons
                }

                groupedSkills[category].forEach(skill => {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = skill.skillName;
                    row.insertCell().textContent = skill.proficiencyLevel;
                    row.insertCell().textContent = skill.acquisitionDate;
                    const statusCell = row.insertCell();
                    statusCell.innerHTML = `<i class="${verificationIcons[skill.verificationStatus] || 'fas fa-question-circle'} verification-icon" title="${skill.verificationStatus}"></i> ${skill.verificationStatus}`;
                });
            }
        });
        updateCategoryCounts(dataToRender);
    }

    function updateCategoryCounts(dataForCounts) {
        const counts = dataForCounts.reduce((acc, skill) => {
            acc[skill.category] = (acc[skill.category] || 0) + 1;
            return acc;
        }, {});

        categoryCountsContainer.innerHTML = '';
        for (const category in counts) {
            const countElement = document.createElement('span');
            countElement.innerHTML = `<i class="${getCategoryIcon(category)}"></i> ${category}: ${counts[category]}`;
            categoryCountsContainer.appendChild(countElement);
        }
    }

    function filterAndSortData() {
        let filteredData = skillsData;
        const searchTerm = searchInput.value.toLowerCase();

        if (searchTerm) {
            filteredData = skillsData.filter(skill =>
                skill.skillName.toLowerCase().includes(searchTerm) ||
                skill.proficiencyLevel.toLowerCase().includes(searchTerm) ||
                skill.acquisitionDate.toLowerCase().includes(searchTerm) ||
                skill.verificationStatus.toLowerCase().includes(searchTerm)
            );
        }

        if (currentSortColumn) {
            filteredData.sort((a, b) => {
                const valA = a[currentSortColumn];
                const valB = b[currentSortColumn];
                
                let comparison = 0;
                if (valA > valB) {
                    comparison = 1;
                } else if (valA < valB) {
                    comparison = -1;
                }
                return currentSortDirection === 'desc' ? comparison * -1 : comparison;
            });
        }
        renderTable(filteredData);
    }

    searchInput.addEventListener('input', filterAndSortData);

    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            if (currentSortColumn === column) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = column;
                currentSortDirection = 'asc';
            }
            
            tableHeaders.forEach(th => {
                th.classList.remove('sort-asc', 'sort-desc');
                if (th.dataset.column === currentSortColumn) {
                    th.classList.add(currentSortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
                }
            });
            filterAndSortData();
        });
    });

    // Initial render
    filterAndSortData();
});
