document.addEventListener('DOMContentLoaded', () => {
    const pendingValidationsTableBody = document.querySelector('#pending-validations-table tbody');
    const recentEndorsementsTableBody = document.querySelector('#recent-endorsements-table tbody');

    // Dummy data - in a real application, this would come from a backend
    let pendingValidations = [
        { id: 1, user: 'John Doe', skill: 'Python Programming', submittedBy: 'Self-Assessed', dateSubmitted: '2025-06-10', status: 'Pending Review', details: 'Completed online course and a personal project.' },
        { id: 2, user: 'Jane Smith', skill: 'Agile Methodologies', submittedBy: 'Manager: Bob Johnson', dateSubmitted: '2025-06-09', status: 'Pending Review', details: 'Led two successful sprints as Scrum Master.' }
    ];

    let recentEndorsements = [
        { id: 101, user: 'Alice Brown', skill: 'Cloud Computing (AWS)', endorsedBy: 'Peer: Charlie Green', dateEndorsed: '2025-06-08', status: 'Approved', details: 'Demonstrated strong AWS skills in Project Phoenix.' },
        { id: 102, user: 'David Lee', skill: 'Graphic Design', endorsedBy: 'Client: Eva Williams', dateEndorsed: '2025-06-07', status: 'Approved', details: 'Excellent work on the new branding materials.' }
    ];

    function renderPendingValidationsTable() {
        if (!pendingValidationsTableBody) return;
        pendingValidationsTableBody.innerHTML = ''; // Clear existing rows
        pendingValidations.forEach(item => {
            const row = pendingValidationsTableBody.insertRow();
            row.innerHTML = `
                <td>${item.user}</td>
                <td>${item.skill}</td>
                <td>${item.submittedBy}</td>
                <td>${item.dateSubmitted}</td>
                <td><span class="status-${item.status.toLowerCase().replace(/\s+/g, '-')}">${item.status}</span></td>
                <td>
                    <button class="approve-btn" data-id="${item.id}" data-type="validation">Approve</button>
                    <button class="reject-btn" data-id="${item.id}" data-type="validation">Reject</button>
                    <button class="view-details-btn" data-id="${item.id}" data-type="validation">Details</button>
                </td>
            `;
        });
        addEventListenersToValidationButtons();
    }

    function renderRecentEndorsementsTable() {
        if (!recentEndorsementsTableBody) return;
        recentEndorsementsTableBody.innerHTML = ''; // Clear existing rows
        recentEndorsements.forEach(item => {
            const row = recentEndorsementsTableBody.insertRow();
            row.innerHTML = `
                <td>${item.user}</td>
                <td>${item.skill}</td>
                <td>${item.endorsedBy}</td>
                <td>${item.dateEndorsed}</td>
                <td><span class="status-${item.status.toLowerCase().replace(/\s+/g, '-')}">${item.status}</span></td>
                <td>
                    <button class="view-details-btn" data-id="${item.id}" data-type="endorsement">Details</button>
                    <button class="flag-btn" data-id="${item.id}" data-type="endorsement">Flag</button>
                </td>
            `;
        });
        addEventListenersToEndorsementButtons();
    }

    function handleValidationAction(id, action) {
        const item = pendingValidations.find(v => v.id === id);
        if (!item) return;

        switch (action) {
            case 'approve':
                item.status = 'Approved';
                console.log(`Validation ID ${id} approved.`);
                // Move to an "approved" list or simply update status
                // For now, we'll filter it out from pending
                pendingValidations = pendingValidations.filter(v => v.id !== id);
                // Potentially add to a different list/table for approved items
                break;
            case 'reject':
                const reason = prompt('Reason for rejection (optional):');
                item.status = 'Rejected';
                console.log(`Validation ID ${id} rejected. Reason: ${reason || 'N/A'}`);
                pendingValidations = pendingValidations.filter(v => v.id !== id);
                // Potentially add to a different list/table for rejected items
                break;
            case 'details':
                alert(`Details for Validation ID ${id}:\nUser: ${item.user}\nSkill: ${item.skill}\nSubmitted By: ${item.submittedBy}\nDate: ${item.dateSubmitted}\nDetails: ${item.details || 'No additional details provided.'}`);
                break;
        }
        renderPendingValidationsTable();
        // API call to backend would happen here
    }

    function handleEndorsementAction(id, action) {
        const item = recentEndorsements.find(e => e.id === id);
        if (!item) return;

        switch (action) {
            case 'details':
                alert(`Details for Endorsement ID ${id}:\nUser: ${item.user}\nSkill: ${item.skill}\nEndorsed By: ${item.endorsedBy}\nDate: ${item.dateEndorsed}\nDetails: ${item.details || 'No additional details provided.'}`);
                break;
            case 'flag':
                if (confirm('Are you sure you want to flag this endorsement for review?')) {
                    item.status = 'Flagged for Review';
                    console.log(`Endorsement ID ${id} flagged.`);
                    // API call to backend
                }
                break;
        }
        renderRecentEndorsementsTable();
    }


    function addEventListenersToValidationButtons() {
        document.querySelectorAll('#pending-validations-table .approve-btn').forEach(button => {
            button.addEventListener('click', (e) => handleValidationAction(parseInt(e.target.dataset.id), 'approve'));
        });
        document.querySelectorAll('#pending-validations-table .reject-btn').forEach(button => {
            button.addEventListener('click', (e) => handleValidationAction(parseInt(e.target.dataset.id), 'reject'));
        });
        document.querySelectorAll('#pending-validations-table .view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => handleValidationAction(parseInt(e.target.dataset.id), 'details'));
        });
    }

    function addEventListenersToEndorsementButtons() {
        document.querySelectorAll('#recent-endorsements-table .view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => handleEndorsementAction(parseInt(e.target.dataset.id), 'details'));
        });
        document.querySelectorAll('#recent-endorsements-table .flag-btn').forEach(button => {
            button.addEventListener('click', (e) => handleEndorsementAction(parseInt(e.target.dataset.id), 'flag'));
        });
    }

    // Initial setup
    if (pendingValidationsTableBody) {
        renderPendingValidationsTable();
    } else {
        console.error("Pending validations table body not found.");
    }

    if (recentEndorsementsTableBody) {
        renderRecentEndorsementsTable();
    } else {
        console.error("Recent endorsements table body not found.");
    }
    
    // Logout functionality (assuming admin-auth.js handles the actual logout)
    const logoutButton = document.getElementById('admin-logout-button');
    if (logoutButton) {
        // admin-auth.js should already handle the click event for logout
    }
});
