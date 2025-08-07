let onConfirmCallback = null;
let currentModalInstance = null; // To manage active modal instance

const modal = document.getElementById('modal');

// Utility function to convert snake_case to Title Case
const toTitleCase = (str) => str.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

// Helper to create tag input HTML
function createTagItemHTML(item, fieldId) {
    return `
        <div class="tag-item bg-slate-200 text-slate-700 rounded-lg flex items-center animate-pop-in">
            <input type="text" name="${fieldId}" value="${item}" class="bg-transparent text-sm font-medium focus:outline-none p-2 w-full">
            <button type="button" class="remove-tag-btn p-1 text-slate-500 hover:text-red-500 hover:bg-slate-300 rounded-full mr-1 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
        </div>
    `;
}

// Utility function to generate form HTML, now with tab support
export function getFormHTML(fields) {
    // Check if fields are structured for tabs (is an object, not an array)
    if (typeof fields === 'object' && !Array.isArray(fields) && fields !== null) {
        const tabIds = Object.keys(fields);
        const tabButtons = tabIds.map((tabId, index) => `
            <button type="button" class="tab-button px-4 py-2 text-sm font-semibold rounded-t-lg ${index === 0 ? 'bg-white border-slate-200 border-b-transparent' : 'bg-slate-50 text-slate-500'}" data-tab="${tabId}">
                ${toTitleCase(tabId)}
            </button>
        `).join('');

        const tabContents = tabIds.map((tabId, index) => `
            <div id="tab-content-${tabId}" class="tab-content p-4 border border-slate-200 rounded-b-lg ${index > 0 ? 'hidden' : ''}">
                ${fields[tabId].map(generateFieldHTML).join('')}
            </div>
        `).join('');

        return `
            <div class="tabs-container">
                <div class="tab-buttons flex border-b border-slate-200 -mb-px">
                    ${tabButtons}
                </div>
                <div class="tab-content-container">
                    ${tabContents}
                </div>
            </div>
        `;
    }

    // Fallback for non-tabbed forms
    return fields.map(generateFieldHTML).join('');
}

// Helper function to generate HTML for a single field
function generateFieldHTML(field) {
    let inputHtml = '';
    const commonAttrs = `id="form-${field.id}" name="${field.id}" class="form-input w-full px-3 py-2 bg-slate-100 border-2 border-slate-200 rounded-lg shadow-sm focus:outline-none"`;

    if (field.type === 'select') {
        inputHtml = `<select ${commonAttrs}>
            ${field.options.map(option => `<option value="${option.value}" ${String(field.value) === String(option.value) ? 'selected' : ''}>${option.label}</option>`).join('')}
        </select>`;
    } else if (field.type === 'multi-select') {
        inputHtml = `<div class="array-container grid grid-cols-2 md:grid-cols-3 gap-2" data-field-id="${field.id}">`;
        if (field.value && Array.isArray(field.value)) {
            field.value.forEach(item => {
                inputHtml += createTagItemHTML(item, field.id);
            });
        }
        inputHtml += `</div><button type="button" class="add-tag-btn mt-2 text-sm font-medium text-[#4285F4] hover:text-[#357ae8] flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
            Add Item
        </button>`;
    } else if (field.type === 'textarea') {
        inputHtml = `<textarea ${commonAttrs} rows="${field.rows || 3}">${field.value || ''}</textarea>`;
    } else if (field.type === 'checkbox') {
        inputHtml = `<div class="flex items-center">
                        <input type="checkbox" id="form-${field.id}" name="${field.id}" ${field.value ? 'checked' : ''} class="toggle-checkbox hidden">
                        <label for="form-${field.id}" class="toggle-label"></label>
                     </div>`;
    } else {
        inputHtml = `<input type="${field.type || 'text'}" value="${field.value || ''}" ${commonAttrs}>`;
    }

    return `
        <div class="mb-6">
            <label for="form-${field.id}" class="block text-sm font-semibold text-slate-800 mb-2">${field.label}</label>
            ${inputHtml}
        </div>
    `;
}

export function openModal({ title, content, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) {
    // Store the current modal instance's onConfirm callback
    currentModalInstance = { onConfirm };

    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    modalContainer.className = 'bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform';
    
    modalContainer.innerHTML = `
        <div class="flex justify-between items-center p-5 border-b border-slate-200">
            <h2 class="text-xl font-bold text-slate-800">${title}</h2>
            <button id="closeModalBtn" class="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <div class="p-6 custom-scrollbar overflow-y-auto flex-1">
            ${content}
        </div>
        <div class="flex justify-end items-center p-4 border-t border-slate-200 bg-slate-50/70 rounded-b-2xl">
            <button id="cancelModalBtn" class="text-slate-700 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 transition-colors duration-200 mr-3">${cancelText}</button>
            <button id="saveModalBtn" class="btn-primary bg-[#4285F4] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg hover:bg-[#357ae8] focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50 transition-all duration-200 transform hover:-translate-y-0.5">${confirmText}</button>
        </div>
    `;

    // Clear previous content and append new modal content
    modal.innerHTML = '';
    modal.appendChild(modalContainer);

    // Show the modal and apply enter animation classes
    modal.classList.remove('hidden');
    modal.classList.add('modal-fade-enter');
    requestAnimationFrame(() => {
        modal.classList.add('modal-fade-enter-active');
    });

    // Attach event listeners for the new modal content
    modal.querySelector('#closeModalBtn').addEventListener('click', closeModal);
    modal.querySelector('#cancelModalBtn').addEventListener('click', closeModal);
    modal.querySelector('#saveModalBtn').addEventListener('click', async () => {
        if (currentModalInstance && currentModalInstance.onConfirm) {
            const result = await currentModalInstance.onConfirm();
            if (result !== false) { // Allow onConfirm to return false to keep modal open
                closeModal();
            }
        } else {
            closeModal();
        }
    });

    // Event delegation for add/remove tags and tabs
    modal.addEventListener('click', handleModalClick);
}

export function closeModal() {
    const modalContainer = modal.querySelector('#modal-container');
    if (modalContainer) {
        modalContainer.classList.remove('modal-fade-enter-active');
        modalContainer.classList.add('modal-fade-leave-active');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('modal-fade-enter', 'modal-fade-enter-active', 'modal-fade-leave-active');
            modal.innerHTML = ''; // Clear content
            currentModalInstance = null;
            modal.removeEventListener('click', handleModalClick); // Clean up event listener
        }, 300); // Matches CSS transition duration
    }
}

// Handle clicks within the modal (tags and tabs)
function handleModalClick(e) {
    const tabButton = e.target.closest('.tab-button');
    const removeTagBtn = e.target.closest('.remove-tag-btn');
    const addTagBtn = e.target.closest('.add-tag-btn');

    // Logic for switching tabs
    if (tabButton) {
        const tabId = tabButton.dataset.tab;
        const modalContent = tabButton.closest('.tabs-container');

        // Deactivate all buttons and hide all content
        modalContent.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('bg-white', 'border-slate-200', 'border-b-transparent');
            btn.classList.add('bg-slate-50', 'text-slate-500');
        });
        modalContent.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Activate the clicked tab
        tabButton.classList.add('bg-white', 'border-slate-200', 'border-b-transparent');
        tabButton.classList.remove('bg-slate-50', 'text-slate-500');
        modalContent.querySelector(`#tab-content-${tabId}`).classList.remove('hidden');
    }

    // Logic to remove a tag
    if (removeTagBtn) {
        removeTagBtn.closest('.tag-item').remove();
    }

    // Logic to add a new tag
    if (addTagBtn) {
        const container = addTagBtn.previousElementSibling; // The .array-container
        const fieldId = container.dataset.fieldId;
        container.insertAdjacentHTML('beforeend', createTagItemHTML('', fieldId));
        container.lastElementChild.querySelector('input').focus();
    }
}

// Close modal if the outer backdrop is clicked
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});
