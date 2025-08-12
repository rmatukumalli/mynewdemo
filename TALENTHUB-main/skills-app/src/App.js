document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/v1/skills/ontology';
    const ontologyContainer = document.getElementById('ontology-container');
    const modal = document.getElementById('form-modal');
    const form = document.getElementById('ontology-form');
    const formTitle = document.getElementById('form-title');
    const skillsBehaviorsSection = document.getElementById('skills-behaviors-section');
    
    const editIdInput = document.getElementById('edit-id');
    const editTypeInput = document.getElementById('edit-type');
    const parentIdInput = document.getElementById('parent-id');
    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const skillsInput = document.getElementById('skills');
    const behaviorsInput = document.getElementById('behaviors');

    const showModal = () => modal.style.display = 'flex';
    const hideModal = () => modal.style.display = 'none';

    const fetchAndRenderOntology = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const capabilities = await response.json();
            
            ontologyContainer.innerHTML = ''; // Clear existing tree
            const ul = document.createElement('ul');
            capabilities.forEach(cap => {
                ul.appendChild(createOntologyNode(cap, 'capability'));
            });
            ontologyContainer.appendChild(ul);
        } catch (error) {
            console.error('Failed to fetch ontology:', error);
            ontologyContainer.innerHTML = '<p>Error loading ontology. Please try again later.</p>';
        }
    };

    const createOntologyNode = (item, type) => {
        const li = document.createElement('li');
        li.className = `ontology-item ${type}`;
        li.innerHTML = `
            <div class="item-header">
                <span class="item-name">${item.name}</span>
                <div class="item-actions">
                    <button class="add-child-btn" title="Add Child">➕</button>
                    <button class="edit-btn" title="Edit">✏️</button>
                    <button class="delete-btn" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="item-details">
                <p>${item.description || ''}</p>
                ${type === 'competency' ? `
                    <div><strong>Skills:</strong> ${item.skills.join(', ') || 'None'}</div>
                    <div><strong>Behaviors:</strong> ${item.behaviors.join(', ') || 'None'}</div>
                ` : ''}
            </div>
        `;

        const childrenUl = document.createElement('ul');
        if (item.competencies && item.competencies.length > 0) {
            item.competencies.forEach(comp => {
                childrenUl.appendChild(createOntologyNode(comp, 'competency'));
            });
        }
        li.appendChild(childrenUl);

        // Add event listeners
        li.querySelector('.add-child-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const childType = getChildType(type);
            if (childType) {
                openAddForm(childType, item.id);
            } else {
                alert('Cannot add children to this item type.');
            }
        });
        li.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openEditForm(item, type);
        });
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteItem(item.id, type);
        });

        return li;
    };

    const getChildType = (parentType) => {
        const hierarchy = { capability: 'competency', competency: 'skill', skill: 'behavior' };
        return hierarchy[parentType];
    };

    const openAddForm = (type, parentIdValue) => {
        form.reset();
        formTitle.textContent = `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        editIdInput.value = '';
        editTypeInput.value = type;
        parentIdInput.value = parentIdValue;
        skillsBehaviorsSection.style.display = type === 'competency' ? 'block' : 'none';
        showModal();
    };

    const openEditForm = (item, type) => {
        form.reset();
        formTitle.textContent = `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        editIdInput.value = item.id;
        editTypeInput.value = type;
        parentIdInput.value = ''; // Not needed for edit
        nameInput.value = item.name;
        descriptionInput.value = item.description || '';
        
        if (type === 'competency') {
            skillsInput.value = item.skills.join(', ');
            behaviorsInput.value = item.behaviors.join(', ');
            skillsBehaviorsSection.style.display = 'block';
        } else {
            skillsBehaviorsSection.style.display = 'none';
        }
        showModal();
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const id = editIdInput.value;
        const type = editTypeInput.value;
        const isEdit = !!id;

        const payload = {
            name: nameInput.value,
            description: descriptionInput.value,
            type: type,
        };

        if (!isEdit) {
            payload.parent_id = parentIdInput.value;
        }
        
        if (type === 'competency') {
            payload.skills = skillsInput.value.split(',').map(s => s.trim()).filter(Boolean);
            payload.behaviors = behaviorsInput.value.split(',').map(b => b.trim()).filter(Boolean);
        }

        const url = isEdit ? `${apiUrl}/${id}` : apiUrl;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            hideModal();
            fetchAndRenderOntology();
        } catch (error) {
            console.error('Failed to save item:', error);
            alert('Failed to save item. Check console for details.');
        }
    };

    const deleteItem = async (id, type) => {
        if (!confirm(`Are you sure you want to delete this ${type}? This will also delete all its children.`)) {
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/${id}?type=${type}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            fetchAndRenderOntology();
        } catch (error) {
            console.error('Failed to delete item:', error);
            alert('Failed to delete item. Check console for details.');
        }
    };

    // Initial Load
    fetchAndRenderOntology();

    // Modal and Form Event Listeners
    document.getElementById('add-capability-btn').addEventListener('click', () => openAddForm('capability', null));
    document.querySelector('.close-btn').addEventListener('click', hideModal);
    document.getElementById('cancel-btn').addEventListener('click', hideModal);
    form.addEventListener('submit', handleFormSubmit);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
});
