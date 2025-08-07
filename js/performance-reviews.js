document.addEventListener('DOMContentLoaded', () => {
    // Modals (using jQuery for Bootstrap)
    const initiateReviewCycleModal = $('#initiateReviewCycleModal');
    const viewReviewFormModal = $('#viewReviewFormModal');

    // Forms & Buttons
    const initiateReviewCycleForm = document.getElementById('initiateReviewCycleForm');
    const saveReviewCycleButton = document.getElementById('saveReviewCycleButton');
    const performanceReviewForm = document.getElementById('performanceReviewForm');
    const submitReviewButton = document.getElementById('submitReviewButton');
    const saveDraftReviewButton = document.getElementById('saveDraftReviewButton');
    const conductReviewButton = document.getElementById('conductReviewButton'); // Button to open the review form

    // Display Areas
    const reviewCyclesList = document.getElementById('reviewCyclesList');
    const myReviewsList = document.getElementById('myReviewsList');
    const goalAlignmentSection = document.getElementById('goalAlignmentSection');
    const reviewEmployeeSelect = document.getElementById('reviewEmployee');

    // Sample Data (replace with actual data fetching in a real application)
    let reviewCycles = [
        {
            id: 1,
            name: 'Annual Review 2025 (Standard)',
            startDate: '2025-01-01',
            endDate: '2025-12-31',
            template: 'standard',
            participants: 'All Employees', // Could be an array of IDs or a descriptive string
            status: 'Active',
            progress: 40 // Percentage
        }
    ];

    let performanceReviews = [
        {
            id: 1,
            employeeId: 'emp_currentUser', // Assuming a way to identify the current user
            employeeName: 'Current User Name', // Will be set based on logged-in user
            reviewer: 'Jane Manager',
            reviewCycleId: 1,
            reviewCycleName: 'Q2 2025 Performance Review',
            period: 'Q2 2025',
            status: 'Completed', // Draft, Submitted, Completed, Acknowledged
            goalAchievementComments: 'Met most Q2 goals effectively.',
            competencyTeamwork: 4,
            competencyCommunication: 5,
            skillsComments: 'Excellent team player and communicator.',
            developmentAreas: 'Further develop project management skills.',
            trainingNeeds: 'Advanced Project Management Course.',
            overallRating: 4,
            overallComments: 'Strong performance this quarter. Keep up the good work.',
            // Mock goals for this review
            goals: [
                { title: 'Complete Project Alpha', progress: 100, status: 'Completed' },
                { title: 'Onboard 2 new clients', progress: 80, status: 'In Progress' }
            ]
        }
    ];
    
    const employees = [
        { id: "emp_1", name: "Alice Wonderland", department: "Engineering" },
        { id: "emp_2", name: "Bob The Builder", department: "Construction" },
        { id: "emp_3", name: "Charlie Chaplin", department: "Entertainment" },
        { id: "emp_4", name: "Diana Prince", department: "Justice League" },
        { id: "emp_currentUser", name: "Raj Matukumalli" } // Example current user
    ];


    // --- Render Functions ---
    function renderReviewCycles() {
        reviewCyclesList.innerHTML = '';
        if (reviewCycles.length === 0) {
            reviewCyclesList.innerHTML = '<p class="text-muted">No active review cycles.</p>';
            return;
        }
        reviewCycles.forEach(cycle => {
            const cycleCard = `
                <div class="card review-cycle-card mb-3" data-cycle-id="${cycle.id}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        ${cycle.name}
                        <span class="badge badge-${cycle.status === 'Active' ? 'success' : 'secondary'}">${cycle.status}</span>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Period:</strong> ${cycle.startDate} to ${cycle.endDate}</p>
                        <p class="card-text"><strong>Participants:</strong> ${cycle.participants}</p>
                        <div class="progress" style="height: 20px;">
                            <div class="progress-bar bg-info" role="progressbar" style="width: ${cycle.progress}%;" aria-valuenow="${cycle.progress}" aria-valuemin="0" aria-valuemax="100">${cycle.progress}% Complete</div>
                        </div>
                    </div>
                    <div class="card-footer text-right">
                        <button class="btn btn-sm btn-outline-primary" onclick="window.viewCycleDetails(${cycle.id})">View Details</button>
                    </div>
                </div>
            `;
            reviewCyclesList.insertAdjacentHTML('beforeend', cycleCard);
        });
    }

    function renderMyReviews() {
        myReviewsList.innerHTML = '';
        // Filter reviews for the current user (mocked here)
        const currentUserReviews = performanceReviews.filter(r => r.employeeId === 'emp_currentUser');

        if (currentUserReviews.length === 0) {
            myReviewsList.innerHTML = '<p class="text-muted">You have no performance reviews yet.</p>';
            return;
        }
        currentUserReviews.forEach(review => {
            const reviewCard = `
                <div class="card my-review-summary-card mb-3" data-review-id="${review.id}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        ${review.reviewCycleName}
                        <span class="badge badge-${getReviewStatusBadge(review.status)}">${review.status}</span>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Reviewer:</strong> ${review.reviewer}</p>
                        <p class="card-text"><strong>Overall Rating:</strong> ${review.overallRating}/5</p>
                    </div>
                    <div class="card-footer text-right">
                        <button class="btn btn-sm btn-outline-info" onclick="window.viewMyReviewDetails(${review.id})">View Full Review</button>
                    </div>
                </div>
            `;
            myReviewsList.insertAdjacentHTML('beforeend', reviewCard);
        });
    }

    function getReviewStatusBadge(status) {
        switch (status.toLowerCase()) {
            case 'completed': return 'primary';
            case 'submitted': return 'success';
            case 'draft': return 'warning';
            default: return 'secondary';
        }
    }
    
    function populateEmployeeDropdown(selectElement, selectedEmployeeId = null) {
        selectElement.innerHTML = '<option selected disabled>Choose employee...</option>';
        employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.id;
            option.textContent = emp.name;
            if (emp.id === selectedEmployeeId) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    function populateParticipantsDropdown() {
        const participantsSelect = document.getElementById('participants');
        participantsSelect.innerHTML = `
            <option value="all">All Employees</option>
            <option value="dept_sales">Sales Department</option>
            <option value="dept_engineering">Engineering Department</option>
        `; // Basic groups
        employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = `emp_${emp.id}`;
            option.textContent = emp.name;
            participantsSelect.appendChild(option);
        });
    }


    // --- Event Handlers ---
    if (saveReviewCycleButton) {
        saveReviewCycleButton.addEventListener('click', () => {
            const cycleName = document.getElementById('cycleName').value.trim();
            const startDate = document.getElementById('cycleStartDate').value;
            const endDate = document.getElementById('cycleEndDate').value;
            const template = document.getElementById('reviewTemplate').value;
            const participantsOptions = document.getElementById('participants').selectedOptions;
            const participants = Array.from(participantsOptions).map(opt => opt.text).join(', '); // Simplified

            if (!cycleName || !startDate || !endDate) {
                alert('Please fill in all required fields for the review cycle.');
                return;
            }

            const newCycle = {
                id: reviewCycles.length > 0 ? Math.max(...reviewCycles.map(c => c.id)) + 1 : 1,
                name: cycleName,
                startDate,
                endDate,
                template,
                participants,
                status: 'Active',
                progress: 0
            };
            reviewCycles.push(newCycle);
            if (reviewCyclesList) renderReviewCycles(); // Check if list exists
            if (initiateReviewCycleForm) initiateReviewCycleForm.reset();
            initiateReviewCycleModal.modal('hide');
            alert('New review cycle initiated successfully!');
        });
    }
    
    if (reviewEmployeeSelect) {
        reviewEmployeeSelect.addEventListener('change', (event) => {
            const selectedEmployeeId = event.target.value;
            loadEmployeeDataForReview(selectedEmployeeId);
        });
    }

    function loadEmployeeDataForReview(employeeId) {
        const employee = employees.find(e => e.id === employeeId);
        if (!employee) {
            if (goalAlignmentSection) goalAlignmentSection.innerHTML = '<p class="text-muted">Select an employee to see their goals.</p>';
            const reviewPeriodEl = document.getElementById('reviewPeriod');
            if (reviewPeriodEl) reviewPeriodEl.value = '';
            return;
        }

        // Mock: Set review period based on current cycle or default
        const reviewPeriodEl = document.getElementById('reviewPeriod');
        if (reviewPeriodEl) reviewPeriodEl.value = reviewCycles.length > 0 ? reviewCycles[0].name : 'Current Review Period';


        // Mock: Fetch employee's goals (replace with actual data from goals.js or backend)
        const employeeGoals = [
            { title: `Complete ${employee.name}'s Project X`, progress: 75, status: 'In Progress' },
            { title: `Improve ${employee.name}'s Skill Y`, progress: 50, status: 'In Progress' }
        ];

        if (goalAlignmentSection) {
            goalAlignmentSection.innerHTML = '<h5>Associated Goals:</h5>';
            if (employeeGoals.length > 0) {
                const ul = document.createElement('ul');
                ul.className = 'list-unstyled';
                employeeGoals.forEach(goal => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${goal.title}</strong> (Status: ${goal.status})
                        <div class="progress mt-1 mb-2" style="height: 10px;">
                            <div class="progress-bar" role="progressbar" style="width: ${goal.progress}%;" aria-valuenow="${goal.progress}" aria-valuemin="0" aria-valuemax="100">${goal.progress}%</div>
                        </div>
                    `;
                    ul.appendChild(li);
                });
                goalAlignmentSection.appendChild(ul);
            } else {
                goalAlignmentSection.innerHTML += '<p class="text-muted">No specific goals found for this employee in the current period.</p>';
            }
        }
    }
    
    if (submitReviewButton) {
        submitReviewButton.addEventListener('click', () => handleReviewFormSubmit('Submitted'));
    }
    if (saveDraftReviewButton) {
        saveDraftReviewButton.addEventListener('click', () => handleReviewFormSubmit('Draft'));
    }

    function handleReviewFormSubmit(status) {
        const employeeId = document.getElementById('reviewEmployee')?.value;
        const overallRating = document.getElementById('overallRating')?.value;
        const overallComments = document.getElementById('overallComments')?.value.trim();

        if (!employeeId || !overallRating || !overallComments) {
            alert('Please select an employee and fill in overall rating and comments.');
            return;
        }
        
        // In a real app, collect all form data
        const reviewData = {
            id: performanceReviews.length > 0 ? Math.max(...performanceReviews.map(r => r.id)) + 1 : 1,
            employeeId,
            employeeName: employees.find(e => e.id === employeeId)?.name || 'N/A',
            reviewer: 'Current Manager', // Mock
            reviewCycleName: document.getElementById('reviewPeriod')?.value || 'Ad-hoc Review',
            period: document.getElementById('reviewPeriod')?.value || 'N/A',
            status: status,
            goalAchievementComments: document.getElementById('goalAchievementComments')?.value.trim(),
            competencyTeamwork: document.getElementById('competencyTeamwork')?.value,
            competencyCommunication: document.getElementById('competencyCommunication')?.value,
            skillsComments: document.getElementById('skillsComments')?.value.trim(),
            developmentAreas: document.getElementById('developmentAreas')?.value.trim(),
            trainingNeeds: document.getElementById('trainingNeeds')?.value.trim(),
            overallRating: overallRating,
            overallComments: overallComments,
            goals: [] // Populate if needed
        };

        // Check if editing or new
        const existingReviewIndex = performanceReviews.findIndex(r => r.employeeId === employeeId && r.period === reviewData.period); // Simple check
        if (existingReviewIndex > -1 && status === 'Submitted') { // Overwrite if submitting
            performanceReviews[existingReviewIndex] = reviewData;
        } else if (existingReviewIndex > -1 && status === 'Draft') { // Update draft
             performanceReviews[existingReviewIndex] = {...performanceReviews[existingReviewIndex], ...reviewData, status: 'Draft'};
        }
        else {
            performanceReviews.push(reviewData);
        }
        
        alert(`Review ${status.toLowerCase()} successfully!`);
        if (performanceReviewForm) performanceReviewForm.reset();
        viewReviewFormModal.modal('hide');
        if (myReviewsList) renderMyReviews(); // Update list if current user's review was affected
        if (reviewCyclesList) renderReviewCycles(); // Update progress if applicable
    }

    // --- Global Functions (for onclick handlers in HTML) ---
    window.viewCycleDetails = (cycleId) => {
        const cycle = reviewCycles.find(c => c.id === cycleId);
        if (cycle) {
            // For now, just log. In future, could show a detailed view or list of reviews in this cycle.
            console.log('Viewing details for cycle:', cycle);
            alert(`Details for ${cycle.name}:\nStart: ${cycle.startDate}\nEnd: ${cycle.endDate}\nParticipants: ${cycle.participants}\nProgress: ${cycle.progress}%`);
        }
    };

    window.viewMyReviewDetails = (reviewId) => {
        const review = performanceReviews.find(r => r.id === reviewId);
        if (review) {
            const modalLabel = document.getElementById('viewReviewFormModalLabel');
            if (modalLabel) modalLabel.textContent = `Details for ${review.reviewCycleName}`;
            
            if (reviewEmployeeSelect) {
                populateEmployeeDropdown(reviewEmployeeSelect, review.employeeId);
                reviewEmployeeSelect.disabled = true; // Disable selection when viewing
            }
            
            const reviewPeriodEl = document.getElementById('reviewPeriod');
            if (reviewPeriodEl) reviewPeriodEl.value = review.period;
            
            const goalAchievementCommentsEl = document.getElementById('goalAchievementComments');
            if (goalAchievementCommentsEl) goalAchievementCommentsEl.value = review.goalAchievementComments;

            const competencyTeamworkEl = document.getElementById('competencyTeamwork');
            if (competencyTeamworkEl) competencyTeamworkEl.value = review.competencyTeamwork;

            const competencyCommunicationEl = document.getElementById('competencyCommunication');
            if (competencyCommunicationEl) competencyCommunicationEl.value = review.competencyCommunication;

            const skillsCommentsEl = document.getElementById('skillsComments');
            if (skillsCommentsEl) skillsCommentsEl.value = review.skillsComments;

            const developmentAreasEl = document.getElementById('developmentAreas');
            if (developmentAreasEl) developmentAreasEl.value = review.developmentAreas;

            const trainingNeedsEl = document.getElementById('trainingNeeds');
            if (trainingNeedsEl) trainingNeedsEl.value = review.trainingNeeds;

            const overallRatingEl = document.getElementById('overallRating');
            if (overallRatingEl) overallRatingEl.value = review.overallRating;

            const overallCommentsEl = document.getElementById('overallComments');
            if (overallCommentsEl) overallCommentsEl.value = review.overallComments;


            // Load goals for this specific review
            if (goalAlignmentSection) {
                goalAlignmentSection.innerHTML = '<h5>Associated Goals:</h5>';
                if (review.goals && review.goals.length > 0) {
                    const ul = document.createElement('ul');
                    ul.className = 'list-unstyled';
                    review.goals.forEach(goal => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <strong>${goal.title}</strong> (Status: ${goal.status})
                            <div class="progress mt-1 mb-2" style="height: 10px;">
                                <div class="progress-bar" role="progressbar" style="width: ${goal.progress}%;" aria-valuenow="${goal.progress}" aria-valuemin="0" aria-valuemax="100">${goal.progress}%</div>
                            </div>
                        `;
                        ul.appendChild(li);
                    });
                    goalAlignmentSection.appendChild(ul);
                } else {
                    goalAlignmentSection.innerHTML += '<p class="text-muted">No specific goals were linked to this review.</p>';
                }
            }
            
            // Adjust buttons for view mode
            if (submitReviewButton) submitReviewButton.style.display = 'none';
            if (saveDraftReviewButton) saveDraftReviewButton.style.display = 'none';
            
            viewReviewFormModal.modal('show');
        }
    };
    
    // Reset modal when "Conduct/View Review" is clicked or modal is closed
    function resetReviewFormModal() {
        const modalLabel = document.getElementById('viewReviewFormModalLabel');
        if (modalLabel) modalLabel.textContent = 'Performance Review Form';
        if (performanceReviewForm) performanceReviewForm.reset();
        if (reviewEmployeeSelect) {
            reviewEmployeeSelect.disabled = false;
            populateEmployeeDropdown(reviewEmployeeSelect); // Repopulate and set to default
        }
        if (goalAlignmentSection) goalAlignmentSection.innerHTML = '<p class="text-muted">Employee goals and progress will appear here.</p>';
        const reviewPeriodEl = document.getElementById('reviewPeriod');
        if (reviewPeriodEl) reviewPeriodEl.value = ''; // Clear period
        if (submitReviewButton) submitReviewButton.style.display = 'inline-block';
        if (saveDraftReviewButton) saveDraftReviewButton.style.display = 'inline-block';
    }

    if (conductReviewButton) {
        conductReviewButton.addEventListener('click', resetReviewFormModal);
    }
    viewReviewFormModal.on('hidden.bs.modal', resetReviewFormModal);


    // --- Initial Setup ---
    if (reviewEmployeeSelect) populateEmployeeDropdown(reviewEmployeeSelect);
    const participantsSelect = document.getElementById('participants');
    if (participantsSelect) populateParticipantsDropdown();
    if (reviewCyclesList) renderReviewCycles();
    if (myReviewsList) renderMyReviews();
    
    // Set current user name for "My Performance Reviews" section (mock)
    const currentUser = employees.find(e => e.id === 'emp_currentUser');
    if (currentUser) {
        performanceReviews.forEach(review => {
            if (review.employeeId === 'emp_currentUser') {
                review.employeeName = currentUser.name;
            }
        });
        const myReviewsHeader = document.querySelector('#myReviewsList')?.previousElementSibling;
        if (myReviewsHeader) {
            myReviewsHeader.textContent = `${currentUser.name}'s Performance Reviews`;
        }
    }

});
