// js/requisitions.js
document.addEventListener('DOMContentLoaded', function() {
    const createNewJobBtn = document.getElementById('createNewJobBtn');
    const manualJobCreationModal = document.getElementById('manualJobCreationModal');
    const closeJobModalBtn = document.getElementById('closeJobModalBtn');
    const manualJobForm = document.getElementById('manualJobForm');
    const syncWithAtsBtn = document.getElementById('syncWithAtsBtn');
    const atsSyncStatus = document.getElementById('atsSyncStatus');

    if (createNewJobBtn && manualJobCreationModal) {
        createNewJobBtn.addEventListener('click', () => {
            manualJobCreationModal.style.display = 'block';
        });
    }

    if (closeJobModalBtn && manualJobCreationModal) {
        closeJobModalBtn.addEventListener('click', () => {
            manualJobCreationModal.style.display = 'none';
        });
    }

    if (manualJobCreationModal) {
        // Close modal if clicked outside of the modal content
        window.addEventListener('click', (event) => {
            if (event.target == manualJobCreationModal) {
                manualJobCreationModal.style.display = 'none';
            }
        });
    }

    if (manualJobForm) {
        manualJobForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            const jobData = Object.fromEntries(formData.entries());
            console.log('Manual job form submitted. Data:', jobData);
            alert('New job posting created (simulated). See console for data.');
            this.reset();
            if (manualJobCreationModal) manualJobCreationModal.style.display = 'none';
            
            // Simulate adding the new job to the table
            const tableBody = document.getElementById('jobPostingsTableBody');
            if (tableBody) {
                const newRowHtml = `
                    <tr>
                        <td>${jobData.jobTitle || 'N/A'}</td>
                        <td><span class="status-badge status-pending">Pending</span></td>
                        <td>0</td>
                        <td>Manual</td>
                        <td>${jobData.jobVisibility || 'N/A'}</td>
                        <td>${new Date().toISOString().split('T')[0]}</td>
                        <td>
                            <button class="btn-secondary btn-small"><i class="fas fa-edit"></i> Edit</button>
                            <button class="btn-danger btn-small"><i class="fas fa-trash"></i> Delete</button>
                            <button class="btn-info btn-small"><i class="fas fa-eye"></i> View</button>
                            <button class="btn-primary btn-small"><i class="fas fa-bullhorn"></i> Post to Boards</button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('afterbegin', newRowHtml);
            }
        });
    }

    if (syncWithAtsBtn && atsSyncStatus) {
        syncWithAtsBtn.addEventListener('click', () => {
            atsSyncStatus.innerHTML = '<p><i class="fas fa-sync-alt fa-spin"></i> Simulating ATS Synchronization with iCIMS... Fetching jobs...</p>';
            atsSyncStatus.style.display = 'block';
            
            setTimeout(() => {
                atsSyncStatus.innerHTML = '<p><i class="fas fa-check-circle" style="color: green;"></i> Synchronization complete. 2 new jobs imported from iCIMS (simulated).</p>';
                const tableBody = document.getElementById('jobPostingsTableBody');
                if (tableBody) {
                    const importedJob1 = `
                        <tr>
                            <td>iCIMS Imported Job - Software Engineer</td>
                            <td><span class="status-badge status-new">New</span></td>
                            <td>0</td>
                            <td>iCIMS</td>
                            <td>All Users</td>
                            <td>${new Date().toISOString().split('T')[0]}</td>
                            <td>
                                <button class="btn-secondary btn-small"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn-danger btn-small"><i class="fas fa-trash"></i> Delete</button>
                                <button class="btn-info btn-small"><i class="fas fa-eye"></i> View</button>
                                <button class="btn-primary btn-small"><i class="fas fa-bullhorn"></i> Post to Boards</button>
                            </td>
                        </tr>`;
                    const importedJob2 = `
                        <tr>
                            <td>iCIMS Imported Job - Product Manager</td>
                            <td><span class="status-badge status-new">New</span></td>
                            <td>0</td>
                            <td>iCIMS</td>
                            <td>Internal Only</td>
                            <td>${new Date().toISOString().split('T')[0]}</td>
                            <td>
                                <button class="btn-secondary btn-small"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn-danger btn-small"><i class="fas fa-trash"></i> Delete</button>
                                <button class="btn-info btn-small"><i class="fas fa-eye"></i> View</button>
                                <button class="btn-primary btn-small"><i class="fas fa-bullhorn"></i> Post to Boards</button>
                            </td>
                        </tr>`;
                    tableBody.insertAdjacentHTML('afterbegin', importedJob2);
                    tableBody.insertAdjacentHTML('afterbegin', importedJob1);
                }
            }, 2500);
            
            setTimeout(() => {
                atsSyncStatus.style.display = 'none';
            }, 5000);
        });
    }
});
