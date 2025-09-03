const jobLevelsModule = {
    init: async function(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper, navigation) {
        this.navigation = navigation;
        const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
        const panelsContainer = contentWrapper.querySelector('.panels-container');

        // Data is now loaded from appData, no need for individual fetches or mock data here
        // try {
        //     const [businessUnitsData, departmentsData, roleGroupsData, jobLevelsData] = await Promise.all([
        //         fetch('/job-architecture/data/mock-business-units.json').then(res => res.json()),
        //         fetch('/job-architecture/data/mock-departments.json').then(res => res.json()),
        //         fetch('/job-architecture/data/mock-role-groups.json').then(res => res.json()),
        //         fetch('/job-architecture/data/mock-job-levels.json').then(res => res.json())
        //     ]);

        //     appData.business_units = businessUnitsData;
        //     appData.departments = departmentsData;
        //     appData.role_groups = roleGroupsData;
        //     appData.job_levels = jobLevelsData.map(jl => ({
        //         ...jl,
        //         role_level: jl.role_level || 'Individual Contributor', // Default value if not present
        //         skill_level: jl.skill_level || 'Intermediate' // Default value if not present
        //     }));

        // } catch (error) {
        //     console.error('Error loading mock data:', error);
        //     // Fallback to empty arrays if data loading fails
        //     appData.business_units = [];
        //     appData.departments = [];
        //     appData.role_groups = [];
        //     appData.job_levels = [];
        // }

        actionButtonContainer.innerHTML = `<button data-action="add-jl" class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-700">Add Job Level</button>`;
        
        const searchBar = contentWrapper.querySelector('#search-bar');
        const buFilter = contentWrapper.querySelector('#bu-filter');
        const deptFilter = contentWrapper.querySelector('#dept-filter');
        const rgFilter = contentWrapper.querySelector('#rg-filter');
        const paginationContainer = contentWrapper.querySelector('#pagination-container');

        if (!searchBar || !buFilter || !deptFilter || !rgFilter || !paginationContainer) {
            console.error("One or more UI elements for filtering or pagination were not found.");
            return;
        }

        let currentPage = 1;
        const rowsPerPage = 10;
        let currentSortColumn = 'role_group_id'; // Default sort column
        let currentSortDirection = 'asc'; // Default sort direction

        function populateFilters(selectedBu = '', selectedDept = '') {
            // Populate Business Unit filter
            buFilter.innerHTML = '<option value="">All Business Units</option>';
            appData.business_units.forEach(bu => {
                buFilter.innerHTML += `<option value="${bu.id}" ${bu.id === selectedBu ? 'selected' : ''}>${bu.unit_name}</option>`;
            });

            // Populate Department filter based on selected Business Unit
            deptFilter.innerHTML = '<option value="">All Departments</option>';
            let filteredDepartments = appData.departments;
            if (selectedBu) {
                filteredDepartments = appData.departments.filter(dept => dept.unit === selectedBu);
            }
            filteredDepartments.forEach(dept => {
                deptFilter.innerHTML += `<option value="${dept.id}" ${dept.id === selectedDept ? 'selected' : ''}>${dept.department_name}</option>`;
            });

            // Populate Role Group filter based on selected Department
            rgFilter.innerHTML = '<option value="">All Role Groups</option>';
            let filteredRoleGroups = appData.role_groups;
            if (selectedDept) {
                filteredRoleGroups = appData.role_groups.filter(rg => rg.department_id === selectedDept);
            }
            filteredRoleGroups.forEach(rg => {
                rgFilter.innerHTML += `<option value="${rg.id}">${rg.group_name}</option>`;
            });
        }

        function renderTable(sortColumn = currentSortColumn, sortDirection = currentSortDirection) {
            const searchTerm = searchBar.value.toLowerCase();
            const selectedBu = buFilter.value;
            const selectedDept = deptFilter.value;
            const selectedRg = rgFilter.value;

            currentSortColumn = sortColumn;
            currentSortDirection = sortDirection;

            let filteredLevels = appData.job_levels.filter(jl => {
                const roleGroup = appData.role_groups.find(rg => rg.id === jl.role_group_id);
                const department = appData.departments.find(d => d.id === roleGroup?.department_id);
                const businessUnit = appData.business_units.find(bu => bu.id === department?.unit);

                const matchesSearch = jl.level_name.toLowerCase().includes(searchTerm) ||
                                      jl.key_responsibilities.toLowerCase().includes(searchTerm) ||
                                      jl.role_level.toLowerCase().includes(searchTerm) ||
                                      jl.skill_level.toLowerCase().includes(searchTerm);
                const matchesBu = !selectedBu || businessUnit?.id === selectedBu;
                const matchesDept = !selectedDept || department?.id === selectedDept;
                const matchesRg = !selectedRg || roleGroup?.id === selectedRg;

                return matchesSearch && matchesBu && matchesDept && matchesRg;
            });

            // Group by category (IC, M, S, E)
            const categorizedLevels = {
                'IC': [],
                'M': [],
                'S': [],
                'E': []
            };

            filteredLevels.forEach(jl => {
                let levelPrefix;
                if (jl.level_number.startsWith('IC')) {
                    levelPrefix = 'IC';
                } else if (jl.level_number.startsWith('M')) {
                    levelPrefix = 'M';
                } else if (jl.level_number.startsWith('S')) {
                    levelPrefix = 'S';
                } else if (jl.level_number.startsWith('E')) {
                    levelPrefix = 'E';
                }
                
                if (levelPrefix && categorizedLevels[levelPrefix]) {
                    categorizedLevels[levelPrefix].push(jl);
                }
            });

            let finalFilteredLevels = [];
            const tempCategorizedLevels = {
                'IC': [...categorizedLevels['IC']],
                'M': [...categorizedLevels['M']],
                'S': [...categorizedLevels['S']],
                'E': [...categorizedLevels['E']]
            };

            // Step 1: Ensure at least one from each category if available
            const categoriesOrder = ['IC', 'M', 'S', 'E'];
            categoriesOrder.forEach(category => {
                if (tempCategorizedLevels[category].length > 0) {
                    finalFilteredLevels.push(tempCategorizedLevels[category].shift());
                }
            });

            // Step 2: Fill the remaining slots up to rowsPerPage (10)
            // Prioritize by cycling through categories to maintain balance
            let categoryIndex = 0;
            while (finalFilteredLevels.length < rowsPerPage) {
                let addedThisRound = false;
                for (let i = 0; i < categoriesOrder.length; i++) {
                    const category = categoriesOrder[categoryIndex];
                    if (tempCategorizedLevels[category].length > 0 && finalFilteredLevels.length < rowsPerPage) {
                        finalFilteredLevels.push(tempCategorizedLevels[category].shift());
                        addedThisRound = true;
                    }
                    categoryIndex = (categoryIndex + 1) % categoriesOrder.length;
                }
                // If no roles were added in a full round, it means all categories are exhausted
                if (!addedThisRound) {
                    break;
                }
            }
            
            // Helper to extract numeric values from strings (e.g., "$50,000 - $70,000" or "10%")
            const extractNumericValue = (str) => {
                if (typeof str !== 'string') return str;
                const numbers = str.match(/(\d[\d,\.]*)/g); // Matches numbers with commas or periods
                if (numbers && numbers.length > 0) {
                    // Take the first number found and parse it, removing commas
                    return parseFloat(numbers[0].replace(/,/g, ''));
                }
                return NaN; // Return NaN if no number is found
            };

            // Apply custom sorting: "Pilots" first, then by Level Number
            finalFilteredLevels.sort((a, b) => {
                const roleGroupA = appData.role_groups.find(rg => rg.id === a.role_group_id)?.group_name || '';
                const roleGroupB = appData.role_groups.find(rg => rg.id === b.role_group_id)?.group_name || '';

                // Prioritize "Pilots" role group
                if (roleGroupA === 'Pilots' && roleGroupB !== 'Pilots') {
                    return -1;
                }
                if (roleGroupA !== 'Pilots' && roleGroupB === 'Pilots') {
                    return 1;
                }

                // If both are "Pilots" or neither are "Pilots", sort by Level Number
                const extractParts = (s) => {
                    const match = s.match(/([A-Z]+)(\d+)/);
                    return match ? [match[1], parseInt(match[2])] : [s, 0];
                };
                const [prefixA, numA] = extractParts(a.level_number);
                const [prefixB, numB] = extractParts(b.level_number);

                if (prefixA !== prefixB) {
                    return prefixA.localeCompare(prefixB);
                }
                return numA - numB;
            });

            const totalPages = Math.ceil(finalFilteredLevels.length / rowsPerPage); // Recalculate total pages based on the new filtered set
            const paginatedLevels = finalFilteredLevels.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

            let tableHTML = `
                <div class="mb-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
                    <p class="font-semibold mb-1">Job Level Legend:</p>
                    <ul class="list-disc list-inside">
                        <li><strong>IC:</strong> Individual Contributor</li>
                        <li><strong>M:</strong> Manager</li>
                        <li><strong>E:</strong> Executive</li>
                        <li><strong>S:</strong> Support</li>
                    </ul>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="border-b border-slate-200 bg-slate-50">
                            <tr class="text-xs">
                                <th class="p-2 font-semibold" data-sort-by="role_group_id">Role Group ${currentSortColumn === 'role_group_id' ? (currentSortDirection === 'asc' ? '&#9650;' : '&#9660;') : ''}</th>
                                <th class="p-2 font-semibold" data-sort-by="level_name">Level Name ${currentSortColumn === 'level_name' ? (currentSortDirection === 'asc' ? '&#9650;' : '&#9660;') : ''}</th>
                                <th class="p-2 font-semibold" data-sort-by="level_number">Level Number ${currentSortColumn === 'level_number' ? (currentSortDirection === 'asc' ? '&#9650;' : '&#9660;') : ''}</th>
                                <th class="p-2 font-semibold" data-sort-by="role_level">Role Level ${currentSortColumn === 'role_level' ? (currentSortDirection === 'asc' ? '&#9650;' : '&#9660;') : ''}</th>
                                <th class="p-2 font-semibold" data-sort-by="skill_level">Skill Level ${currentSortColumn === 'skill_level' ? (currentSortDirection === 'asc' ? '&#9650;' : '&#9660;') : ''}</th>
                                <th class="p-2 font-semibold" data-sort-by="salary_range">Salary Range ${currentSortColumn === 'salary_range' ? (currentSortDirection === 'asc' ? '&#9650;' : '&#9660;') : ''}</th>
                                <th class="p-2 font-semibold" data-sort-by="bonus_potential">Bonus Potential ${currentSortColumn === 'bonus_potential' ? (currentSortDirection === 'asc' ? '&#9650;' : '&#9660;') : ''}</th>
                                <th class="p-2 font-semibold" data-sort-by="key_responsibilities">Key Responsibilities ${currentSortColumn === 'key_responsibilities' ? (currentSortDirection === 'asc' ? '&#9650;' : '&#9660;') : ''}</th>
                                <th class="p-2 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${paginatedLevels.map(jl => `
                                <tr class="border-b border-slate-200">
                                    <td class="p-2">${appData.role_groups.find(rg => rg.id === jl.role_group_id)?.group_name || ''}</td>
                                    <td class="p-2 font-medium text-slate-800">${jl.level_name}</td>
                                    <td class="p-2">${jl.level_number}</td>
                                    <td class="p-2">${jl.role_level}</td>
                                    <td class="p-2">${jl.skill_level}</td>
                                    <td class="p-2">${jl.salary_range}</td>
                                    <td class="p-2">${jl.bonus_potential}</td>
                                    <td class="p-2">${jl.key_responsibilities}</td>
                                    <td class="p-2 flex gap-3 justify-end">
                                        <button data-action="edit-jl" data-id="${jl.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                                        <button data-action="delete-jl" data-id="${jl.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
                                        <button data-action="career-path" data-id="${jl.id}" class="text-slate-500 hover:text-green-600 font-medium">Career Path</button>
                                    </td>
                                </tr>
                            `).join('') || `<tr><td colspan="9" class="text-center p-4 text-slate-400">No job levels found.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            `;
            panelsContainer.innerHTML = tableHTML;
            renderPagination(totalPages);

            // Add event listeners to sortable headers
            panelsContainer.querySelectorAll('th[data-sort-by]').forEach(header => {
                header.addEventListener('click', () => {
                    const sortBy = header.dataset.sortBy;
                    let newSortDirection = 'asc';
                    if (currentSortColumn === sortBy) {
                        newSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
                    }
                    renderTable(sortBy, newSortDirection);
                });
            });
        }

        function renderPagination(totalPages) {
            paginationContainer.innerHTML = '';
            if (totalPages <= 1) return;

            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.className = `px-3 py-1 border rounded-md text-sm ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-white'}`;
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    renderTable();
                });
                paginationContainer.appendChild(pageButton);
            }
        }

        populateFilters();
        renderTable();

        searchBar.addEventListener('input', () => {
            currentPage = 1;
            renderTable();
        });
        buFilter.addEventListener('change', () => {
            currentPage = 1;
            const selectedBu = buFilter.value;
            populateFilters(selectedBu); // Repopulate departments and role groups based on new BU
            renderTable();
        });
        deptFilter.addEventListener('change', () => {
            currentPage = 1;
            const selectedBu = buFilter.value; // Keep the selected BU
            const selectedDept = deptFilter.value;
            populateFilters(selectedBu, selectedDept); // Repopulate role groups based on new Department
            renderTable();
        });
        rgFilter.addEventListener('change', () => {
            currentPage = 1;
            renderTable();
        });

        // Event listeners for this step
        actionButtonContainer.querySelector('[data-action="add-jl"]').addEventListener('click', () => {
            openModal({
                title: 'Add Job Level',
                tabs: [
                    {
                        title: 'General',
                        content: getFormHTML({
                            'general': [
                                { label: 'Role Group', id: 'role_group_id', type: 'select', options: appData.role_groups.map(rg => ({ value: rg.id, label: rg.group_name })) },
                                { label: 'Level Name', id: 'level_name' },
                                { label: 'Level Number', id: 'level_number' },
                                { label: 'Role Level', id: 'role_level', type: 'select', options: [{value: 'Individual Contributor', label: 'Individual Contributor'}, {value: 'Manager', label: 'Manager'}, {value: 'Executive', label: 'Executive'}, {value: 'Support', label: 'Support'}] },
                                { label: 'Skill Level', id: 'skill_level', type: 'select', options: [{value: 'Beginner', label: 'Beginner'}, {value: 'Intermediate', label: 'Intermediate'}, {value: 'Advanced', label: 'Advanced'}, {value: 'Expert', label: 'Expert'}] },
                                { label: 'Salary Range', id: 'salary_range' },
                                { label: 'Bonus Potential', id: 'bonus_potential' },
                                { label: 'Key Responsibilities', id: 'key_responsibilities' },
                            ]
                        })
                    }
                ],
                onConfirm: async () => {
                const role_group_id = document.getElementById('form-role_group_id').value;
                const level_name = document.getElementById('form-level_name').value;
                const level_number = document.getElementById('form-level_number').value;
                const role_level = document.getElementById('form-role_level').value;
                const skill_level = document.getElementById('form-skill_level').value;
                const salary_range = document.getElementById('form-salary_range').value;
                const bonus_potential = document.getElementById('form-bonus_potential').value;
                const key_responsibilities = document.getElementById('form-key_responsibilities').value;
                if(!level_name || !level_number) return false;
                
                // Mock API call
                console.log('Adding job level:', { role_group_id, level_name, level_number, role_level, skill_level, salary_range, bonus_potential, key_responsibilities });
                appData.job_levels.push({
                    id: `jl_${Date.now()}`, // Simple unique ID
                    role_group_id, level_name, level_number, role_level, skill_level, salary_range, bonus_potential, key_responsibilities
                });
                updateWizardState();
                return true;
            }});
        });

        panelsContainer.querySelectorAll('[data-action="edit-jl"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                let item = appData.job_levels.find(jl => jl.id === id);
                openModal({
                    title: 'Edit Job Level',
                    tabs: [
                        {
                            title: 'General',
                            content: getFormHTML({
                                'general': [
                                    { label: 'Role Group', id: 'role_group_id', type: 'select', options: appData.role_groups.map(rg => ({ value: rg.id, label: rg.group_name })), value: item.role_group_id },
                                    { label: 'Level Name', id: 'level_name', value: item.level_name },
                                    { label: 'Level Number', id: 'level_number', value: item.level_number },
                                    { label: 'Role Level', id: 'role_level', type: 'select', options: [{value: 'Individual Contributor', label: 'Individual Contributor'}, {value: 'Manager', label: 'Manager'}, {value: 'Executive', label: 'Executive'}, {value: 'Support', label: 'Support'}], value: item.role_level },
                                    { label: 'Skill Level', id: 'skill_level', type: 'select', options: [{value: 'Beginner', label: 'Beginner'}, {value: 'Intermediate', label: 'Intermediate'}, {value: 'Advanced', label: 'Advanced'}, {value: 'Expert', label: 'Expert'}], value: item.skill_level },
                                    { label: 'Salary Range', id: 'salary_range', value: item.salary_range },
                                    { label: 'Bonus Potential', id: 'bonus_potential', value: item.bonus_potential },
                                    { label: 'Key Responsibilities', id: 'key_responsibilities', value: item.key_responsibilities },
                                ]
                            }, item)
                        }
                    ],
                    onConfirm: async () => {
                    item.role_group_id = document.getElementById('form-role_group_id').value;
                    item.level_name = document.getElementById('form-level_name').value;
                    item.level_number = document.getElementById('form-level_number').value;
                    item.role_level = document.getElementById('form-role_level').value;
                    item.skill_level = document.getElementById('form-skill_level').value;
                    item.salary_range = document.getElementById('form-salary_range').value;
                    item.bonus_potential = document.getElementById('form-bonus_potential').value;
                    item.key_responsibilities = document.getElementById('form-key_responsibilities').value;
                    
                    // Mock API call
                    console.log('Updating job level:', item);
                    updateWizardState();
                    return true;
                }});
            });
        });

        panelsContainer.querySelectorAll('[data-action="delete-jl"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                openModal({
                    title: 'Confirm Delete',
                    tabs: [
                        {
                            title: 'Confirmation',
                            content: '<p>Are you sure you want to delete this job level?</p>'
                        }
                    ],
                    onConfirm: async () => {
                        // Mock API call
                        console.log('Deleting job level with id:', id);
                        appData.job_levels = appData.job_levels.filter(jl => jl.id !== id);
                        updateWizardState();
                        return true;
                    }
                });
            });
        });

        panelsContainer.querySelectorAll('[data-action="career-path"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const jobLevel = appData.job_levels.find(jl => jl.id === id);
                
                // Store the selected job level in a globally accessible place
                // so that the career-paths module can access it.
                appData.selectedJobLevel = jobLevel;

                // Navigate to the career paths step
                const navigation = this.navigation;
                if (navigation && typeof navigation.navigateToStep === 'function') {
                    const careerPathStep = 9; // The ID for the career-paths step
                    navigation.navigateToStep(careerPathStep);
                } else {
                    console.error('Navigation function is not available.');
                }
            });
        });
    }
};

window.jobLevelsModule = jobLevelsModule;
