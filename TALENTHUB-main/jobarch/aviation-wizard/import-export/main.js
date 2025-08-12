document.addEventListener('DOMContentLoaded', () => {
    const csvFileInput = document.getElementById('csv-file-input');
    const importButton = document.getElementById('import-button');
    const importStatusDiv = document.getElementById('import-status');
    const tabsContainer = document.querySelector('.tabs-container');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const importedDataTable = document.getElementById('imported-data-table');
    const globalFilterInput = document.getElementById('global-filter-input');
    const tableRowCountSpan = document.getElementById('table-row-count');


    // Data summary count elements
    const jobFamiliesCountSpan = document.getElementById('job-families-count');
    const jobProfilesCountSpan = document.getElementById('job-profiles-count');
    const jobLevelsCountSpan = document.getElementById('job-levels-count');
    const roleGroupsCountSpan = document.getElementById('role-groups-count');
    const roleLevelsCountSpan = document.getElementById('role-levels-count');
    const roleGroupSkillsCountSpan = document.getElementById('role-group-skills-count');
    const roleLevelSkillsCountSpan = document.getElementById('role-level-skills-count');

    let allJobRecords = []; // To store all parsed records
    let currentSortColumn = null;
    let currentSortDirection = 'asc'; // 'asc' or 'desc'
    let headersFromLastParse = []; // Store headers for re-rendering empty table


    // Function to simulate pre-loading and processing the sample CSV
    async function preloadAndProcessSampleData() {
        showStatus('Loading pre-selected sample data...', 'info');
        csvFileInput.disabled = true; 
        importButton.disabled = true; 

        try {
            const response = await fetch('../../sample_job_architecture_rich.csv');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} while fetching sample CSV.`);
            }
            const csvContent = await response.text();
            
            const { summaryCounts, records, headers } = processCsvData(csvContent); // Removed errors from destructuring
            allJobRecords = records; 
            headersFromLastParse = headers;


            displayImportSummary(summaryCounts);
            renderTable(headers, allJobRecords); 
            showStatus('Sample job architecture data loaded and processed successfully!', 'success');
            tabsContainer.style.display = 'block'; 
            
            const fileNameDisplay = document.createElement('p');
            fileNameDisplay.textContent = "Loaded: sample_job_architecture_rich.csv (25 records)"; // Simplified message
            fileNameDisplay.style.marginTop = "10px";
            fileNameDisplay.style.fontStyle = "italic";
            csvFileInput.parentNode.insertBefore(fileNameDisplay, csvFileInput.nextSibling);
            csvFileInput.style.display = 'none'; 
            document.querySelector('label[for="csv-file-input"]').style.display = 'none'; 

        } catch (error) {
            console.error("Error pre-loading sample CSV:", error);
            showStatus(`Error loading sample data: ${error.message}`, 'error');
            csvFileInput.disabled = false; 
            importButton.disabled = false;
        }
    }


    // Event listeners for manual upload
    csvFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type === "text/csv" || file.name.endsWith('.csv')) {
                importStatusDiv.textContent = `File selected: ${file.name}`;
                importStatusDiv.className = 'status-message';
                tabsContainer.style.display = 'none'; // Hide tabs if new file selected
            } else {
                importStatusDiv.textContent = 'Error: Please select a valid CSV file.';
                importStatusDiv.className = 'status-message error';
                csvFileInput.value = ''; 
            }
        }
    });

    importButton.addEventListener('click', () => {
        if (!csvFileInput.files || csvFileInput.files.length === 0) {
            showStatus('Error: No file selected. Please upload a CSV file.', 'error');
            return;
        }

        const file = csvFileInput.files[0];
        if (!(file.type === "text/csv" || file.name.endsWith('.csv'))) {
            showStatus('Error: Invalid file type. Please upload a CSV file.', 'error');
            return;
        }

        showStatus('Processing file...', 'info');
        importButton.disabled = true;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const csvContent = event.target.result;
                const { summaryCounts, records, headers } = processCsvData(csvContent); // Removed errors
                allJobRecords = records;
                headersFromLastParse = headers;

                displayImportSummary(summaryCounts);
                renderTable(headers, allJobRecords);
                showStatus('Data imported and processed successfully!', 'success');
                tabsContainer.style.display = 'block'; 
            } catch (error) {
                console.error("Error processing CSV:", error);
                showStatus(`Error processing CSV: ${error.message}`, 'error');
                tabsContainer.style.display = 'none';
            } finally {
                importButton.disabled = false;
            }
        };
        reader.onerror = () => {
            showStatus('Error reading file.', 'error');
            importButton.disabled = false;
        };
        reader.readAsText(file);
    });

    function showStatus(message, type) {
        importStatusDiv.textContent = message;
        importStatusDiv.className = `status-message ${type}`; 
    }

    function processCsvData(csvContent) {
        const lines = csvContent.split(/\r\n|\n/).filter(line => line.trim() !== ''); 
        
        if (lines.length < 1) {
             throw new Error("CSV file is empty or does not contain a header row.");
        }
        
        const headers = lines[0].split(',').map(header => header.trim().replace(/^"|"$/g, '')); 
        const records = [];
        headersFromLastParse = headers;

        if (lines.length < 2 && lines[0].trim() !== '') { 
            // No data rows, but header exists. Return empty records but valid headers.
        }

        const summaryData = {
            jobFamilies: new Set(),
            jobProfiles: new Set(),
            jobLevels: new Set(),
            roleGroups: new Set(),
            roleLevels: new Set(),
            roleGroupSkills: new Set(),
            roleLevelSkills: new Set()
        };
        
        const findIndex = (name) => headers.findIndex(h => h.toLowerCase() === name.toLowerCase());
        const jobFamilyCol = headers[findIndex("Job Family")];
        const jobProfileCol = headers[findIndex("Job Profile")];
        const jobLevelCol = headers[findIndex("Job Level")];
        const roleGroupCol = headers[findIndex("Role Group")];
        const roleLevelNameCol = headers[findIndex("Role Level Name")];
        const roleGroupSkillsCol = headers[findIndex("Role Group Skills")];
        const roleLevelSkillsCol = headers[findIndex("Role Level Skills")];

        for (let i = 1; i < lines.length; i++) {
            const values = [];
            let currentVal = '';
            let inQuotes = false;
            for (let char of lines[i]) {
                if (char === '"' && (currentVal.length === 0 || currentVal.slice(-1) !== '\\')) { 
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(currentVal.trim());
                    currentVal = '';
                } else {
                    currentVal += char;
                }
            }
            values.push(currentVal.trim()); 

            if (values.length !== headers.length) {
                console.warn(`Row ${i + 1}: Incorrect number of columns. Expected ${headers.length}, found ${values.length}. Skipping.`);
                continue; 
            }
            
            const record = {};
            headers.forEach((header, index) => {
                record[header] = values[index] ? values[index].replace(/^"|"$/g, '') : ''; 
            });
            
            records.push(record);

            if (record[jobFamilyCol]) summaryData.jobFamilies.add(record[jobFamilyCol]);
            if (record[jobProfileCol]) summaryData.jobProfiles.add(record[jobProfileCol]);
            if (record[jobLevelCol]) summaryData.jobLevels.add(record[jobLevelCol]);
            if (record[roleGroupCol]) summaryData.roleGroups.add(record[roleGroupCol]);
            
            if (record[roleLevelNameCol]) {
                summaryData.roleLevels.add(record[roleLevelNameCol]);
            } else if (record[roleGroupCol] && record[jobLevelCol]) {
                summaryData.roleLevels.add(`${record[roleGroupCol]} ${record[jobLevelCol]}`);
            }

            if (record[roleGroupSkillsCol]) {
                record[roleGroupSkillsCol].split(';').map(s => s.trim()).filter(s => s).forEach(skill => summaryData.roleGroupSkills.add(skill));
            }
            if (record[roleLevelSkillsCol]) {
                record[roleLevelSkillsCol].split(';').map(s => s.trim()).filter(s => s).forEach(skill => summaryData.roleLevelSkills.add(skill));
            }
        }
        
        const summaryCounts = {
            jobFamilies: summaryData.jobFamilies.size,
            jobProfiles: summaryData.jobProfiles.size,
            jobLevels: summaryData.jobLevels.size,
            roleGroups: summaryData.roleGroups.size,
            roleLevels: summaryData.roleLevels.size,
            roleGroupSkills: summaryData.roleGroupSkills.size,
            roleLevelSkills: summaryData.roleLevelSkills.size
        };
        return { summaryCounts, records, headers }; // Removed errors from return
    }

    function displayImportSummary(summary) {
        if (!summary) return;
        jobFamiliesCountSpan.textContent = summary.jobFamilies || 0;
        jobProfilesCountSpan.textContent = summary.jobProfiles || 0;
        jobLevelsCountSpan.textContent = summary.jobLevels || 0;
        roleGroupsCountSpan.textContent = summary.roleGroups || 0;
        roleLevelsCountSpan.textContent = summary.roleLevels || 0;
        roleGroupSkillsCountSpan.textContent = summary.roleGroupSkills || 0;
        roleLevelSkillsCountSpan.textContent = summary.roleLevelSkills || 0;
    }

    function renderTable(headers, dataRows) {
        const tableHead = importedDataTable.querySelector('thead');
        const tableBody = importedDataTable.querySelector('tbody');

        tableHead.innerHTML = '';
        tableBody.innerHTML = '';
        
        const displayHeaders = headers && headers.length > 0 ? headers : headersFromLastParse;

        if (!displayHeaders || displayHeaders.length === 0) {
            tableRowCountSpan.textContent = 'No header information available to display table.';
            return;
        }
        
        const headerRow = tableHead.insertRow();
        displayHeaders.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.dataset.column = headerText;
            const icon = document.createElement('span');
            icon.classList.add('sort-icon');
            if (headerText === currentSortColumn) {
                icon.textContent = currentSortDirection === 'asc' ? ' ▲' : ' ▼';
            }
            th.appendChild(icon);
            th.addEventListener('click', () => sortTable(headerText));
            headerRow.appendChild(th);
        });

        if (!dataRows || dataRows.length === 0) {
            tableRowCountSpan.textContent = 'No data to display in table.';
             const emptyRow = tableBody.insertRow();
             const cell = emptyRow.insertCell();
             cell.colSpan = displayHeaders.length;
             cell.textContent = 'No records match the current criteria or no data loaded.';
             cell.style.textAlign = 'center';
            return;
        }

        dataRows.forEach(rowObj => {
            const row = tableBody.insertRow();
            displayHeaders.forEach(header => {
                const cell = row.insertCell();
                cell.textContent = rowObj[header] || ''; 
            });
        });
        updateTableRowCount(dataRows.length);
    }
    
    function updateTableRowCount(count) {
        tableRowCountSpan.textContent = `Showing ${count} record${count === 1 ? '' : 's'}`;
    }

    function sortTable(columnKey) {
        const newSortDirection = (columnKey === currentSortColumn && currentSortDirection === 'asc') ? 'desc' : 'asc';
        currentSortColumn = columnKey;
        currentSortDirection = newSortDirection;

        allJobRecords.sort((a, b) => {
            let valA = a[columnKey] || '';
            let valB = b[columnKey] || '';

            const numA = parseFloat(valA);
            const numB = parseFloat(valB);

            if (!isNaN(numA) && !isNaN(numB)) {
                valA = numA;
                valB = numB;
            } else {
                valA = String(valA).toLowerCase();
                valB = String(valB).toLowerCase();
            }

            if (valA < valB) {
                return currentSortDirection === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return currentSortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
        applyFiltersAndRender(); 
    }

    function applyFiltersAndRender() {
        const filterText = globalFilterInput.value.toLowerCase().trim();
        let filteredRecords = allJobRecords;

        if (filterText) {
            filteredRecords = allJobRecords.filter(record => {
                return Object.values(record).some(value => 
                    String(value).toLowerCase().includes(filterText)
                );
            });
        }
        renderTable(headersFromLastParse, filteredRecords);
    }

    globalFilterInput.addEventListener('input', applyFiltersAndRender);

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const targetTabId = button.getAttribute('data-tab');
            document.getElementById(targetTabId).classList.add('active');
        });
    });

    preloadAndProcessSampleData();

});
