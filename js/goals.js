document.addEventListener('DOMContentLoaded', () => {
    const goalsList = document.getElementById('goalsList');
    const addGoalForm = document.getElementById('addGoalForm');
    const saveGoalButton = document.getElementById('saveGoalButton');
    const addGoalModal = $('#addGoalModal'); // jQuery for Bootstrap modal

    let goals = [
        {
            id: 1,
            title: 'Sample Goal: Increase Q3 Sales by 15%',
            description: 'Focus on upselling to existing clients and acquiring new leads through targeted marketing campaigns.',
            owner: 'John Doe',
            dueDate: '2025-09-30',
            status: 'In Progress',
            priority: 'High',
            alignment: ['Increase Market Share'],
            kpis: 'Achieve 15% increase in total sales revenue for Q3 compared to Q2. Secure 5 new enterprise clients.',
            progress: 60
        }
    ];
    let editingGoalId = null;

    function renderGoals() {
        goalsList.innerHTML = ''; // Clear existing goals
        if (goals.length === 0) {
            goalsList.innerHTML = '<p class="text-muted">No goals defined yet. Click "Add New Goal" to get started.</p>';
            return;
        }

        goals.forEach(goal => {
            const goalCard = `
                <div class="card goal-card mb-3" data-id="${goal.id}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">${goal.title}</h5>
                        <span class="badge badge-${getStatusColor(goal.status)}">${goal.status}</span>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Description:</strong> ${goal.description || 'N/A'}</p>
                        <p class="card-text"><strong>Owner:</strong> ${goal.owner}</p>
                        <p class="card-text"><strong>Due Date:</strong> ${goal.dueDate || 'N/A'}</p>
                        <p class="card-text"><strong>Priority:</strong> <span class="badge badge-priority-${goal.priority.toLowerCase()}">${goal.priority}</span></p>
                        <p class="card-text"><strong>KPIs:</strong> ${goal.kpis || 'N/A'}</p>
                        <p class="card-text"><strong>Aligned with:</strong> ${goal.alignment.join(', ') || 'N/A'}</p>
                        <label for="progress-slider-${goal.id}" class="sr-only">Goal Progress</label>
                        <div class="progress mb-2">
                            <div class="progress-bar" role="progressbar" style="width: ${goal.progress}%;" aria-valuenow="${goal.progress}" aria-valuemin="0" aria-valuemax="100">${goal.progress}%</div>
                        </div>
                        <input type="range" class="form-control-range progress-slider" id="progress-slider-${goal.id}" value="${goal.progress}" min="0" max="100" data-goal-id="${goal.id}">
                    </div>
                    <div class="card-footer d-flex justify-content-end">
                        <button class="btn btn-sm btn-outline-secondary mr-2" onclick="window.editGoal(${goal.id})">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="window.deleteGoal(${goal.id})">Delete</button>
                    </div>
                </div>
            `;
            goalsList.insertAdjacentHTML('beforeend', goalCard);
        });
        
        // Add event listeners for progress sliders
        document.querySelectorAll('.progress-slider').forEach(slider => {
            slider.addEventListener('input', handleProgressChange);
        });
    }

    function getStatusColor(status) {
        switch (status) {
            case 'Completed': return 'success';
            case 'In Progress': return 'info';
            case 'On Hold': return 'warning';
            case 'Cancelled': return 'danger';
            case 'Not Started':
            default: return 'secondary';
        }
    }
    
    function handleProgressChange(event) {
        const goalId = parseInt(event.target.dataset.goalId);
        const newProgress = parseInt(event.target.value);
        const goal = goals.find(g => g.id === goalId);
        if (goal) {
            goal.progress = newProgress;
            // Update the progress bar display
            const progressBar = event.target.previousElementSibling.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = `${newProgress}%`;
                progressBar.textContent = `${newProgress}%`;
                progressBar.setAttribute('aria-valuenow', newProgress);
            }
            // Optionally, auto-update status based on progress
            if (newProgress === 100 && goal.status !== 'Completed') {
                goal.status = 'Completed';
            } else if (newProgress > 0 && newProgress < 100 && goal.status === 'Not Started') {
                goal.status = 'In Progress';
            } else if (newProgress === 0 && goal.status !== 'Not Started') {
                 // goal.status = 'Not Started'; // Or keep current status if user manually set it
            }
            renderGoals(); // Re-render to update status badge if changed
        }
    }


    saveGoalButton.addEventListener('click', () => {
        const title = document.getElementById('goalTitle').value.trim();
        const description = document.getElementById('goalDescription').value.trim();
        const owner = document.getElementById('goalOwner').value;
        const dueDate = document.getElementById('goalDueDate').value;
        const status = document.getElementById('goalStatus').value;
        const priority = document.getElementById('goalPriority').value;
        const alignmentOptions = document.getElementById('goalAlignment').selectedOptions;
        const alignment = Array.from(alignmentOptions).map(opt => opt.text);
        const kpis = document.getElementById('goalKPIs').value.trim();

        if (!title) {
            alert('Goal title is required.');
            return;
        }

        if (editingGoalId !== null) {
            // Update existing goal
            const goal = goals.find(g => g.id === editingGoalId);
            if (goal) {
                goal.title = title;
                goal.description = description;
                goal.owner = owner;
                goal.dueDate = dueDate;
                goal.status = status;
                goal.priority = priority;
                goal.alignment = alignment;
                goal.kpis = kpis;
            }
            editingGoalId = null;
        } else {
            // Add new goal
            const newGoal = {
                id: goals.length > 0 ? Math.max(...goals.map(g => g.id)) + 1 : 1,
                title,
                description,
                owner,
                dueDate,
                status,
                priority,
                alignment,
                kpis,
                progress: 0 // New goals start with 0 progress
            };
            goals.push(newGoal);
        }

        addGoalForm.reset();
        addGoalModal.modal('hide');
        renderGoals();
    });

    window.editGoal = (id) => {
        const goal = goals.find(g => g.id === id);
        if (goal) {
            editingGoalId = id;
            document.getElementById('addGoalModalLabel').textContent = 'Edit Goal';
            document.getElementById('goalTitle').value = goal.title;
            document.getElementById('goalDescription').value = goal.description;
            document.getElementById('goalOwner').value = goal.owner; // This might need adjustment if owner IDs are used
            document.getElementById('goalDueDate').value = goal.dueDate;
            document.getElementById('goalStatus').value = goal.status;
            document.getElementById('goalPriority').value = goal.priority;
            document.getElementById('goalKPIs').value = goal.kpis;

            // Set selected options for alignment
            const alignmentSelect = document.getElementById('goalAlignment');
            Array.from(alignmentSelect.options).forEach(option => {
                option.selected = goal.alignment.includes(option.text);
            });
            
            addGoalModal.modal('show');
        }
    };

    window.deleteGoal = (id) => {
        if (confirm('Are you sure you want to delete this goal?')) {
            goals = goals.filter(g => g.id !== id);
            renderGoals();
        }
    };
    
    // Populate employee dropdown (example)
    function populateEmployees() {
        const ownerSelect = document.getElementById('goalOwner');
        // In a real app, fetch this from an API or a shared data source
        const employees = [
            { id: "1", name: "Alice Wonderland" },
            { id: "2", name: "Bob The Builder" },
            { id: "3", name: "Charlie Chaplin" },
            { id: "4", name: "Diana Prince" }
        ];
        
        // Clear existing options except the placeholder
        ownerSelect.innerHTML = '<option selected disabled>Choose...</option>';

        employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.name; // Or emp.id if you prefer to store ID
            option.textContent = emp.name;
            ownerSelect.appendChild(option);
        });
    }

    // Reset modal title when it's closed
    addGoalModal.on('hidden.bs.modal', function () {
        document.getElementById('addGoalModalLabel').textContent = 'Add New Goal';
        addGoalForm.reset();
        editingGoalId = null;
    });

    // Initial render
    populateEmployees();
    renderGoals();
});
