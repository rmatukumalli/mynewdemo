export function openModal({ title, tabs, onConfirm, extraButtons = [] }) {
    const modal = document.getElementById('modal');
    modal.classList.add('modal-dialog'); // Add modal-dialog class to the modal itself

    const tabHeaders = tabs.map((tab, index) => `
        <button class="tab-link px-4 py-2 text-sm font-medium ${index === 0 ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}" data-tab="tab-panel-${index}">${tab.title}</button>
    `).join('');

    const tabPanels = tabs.map((tab, index) => `
        <div id="tab-panel-${index}" class="tab-content p-4 ${index > 0 ? 'hidden' : ''}">
            ${tab.content}
        </div>
    `).join('');

    modal.innerHTML = `
        <div class="modal-content-wrapper relative bg-white rounded-lg shadow-xl w-full mx-4 my-8 overflow-hidden flex flex-col">
            <div class="flex justify-between items-center p-6 pb-4">
                <h2 class="text-lg font-bold text-slate-800">${title}</h2>
                <button id="close-modal-btn" class="text-slate-500 hover:text-slate-800">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div class="border-b border-slate-200 px-6">
                <nav class="-mb-px flex gap-4">
                    ${tabHeaders}
                </nav>
            </div>
            <div class="modal-body p-6 flex-1 overflow-y-auto">${tabPanels}</div>
            <div class="modal-footer mt-6 flex justify-between items-center p-6 pt-4">
                <div>
                    ${extraButtons.map(btn => `<button id="${btn.id}" class="${btn.classes}">${btn.text}</button>`).join('')}
                </div>
                <div class="flex justify-end gap-3">
                    <button id="cancel-modal-btn" class="border border-slate-300 bg-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-slate-50">Cancel</button>
                    <button id="confirm-modal-btn" class="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700">Confirm</button>
                </div>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');

    const closeModal = () => modal.classList.add('hidden');

    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);
    document.getElementById('confirm-modal-btn').addEventListener('click', async () => {
        if (await onConfirm()) {
            closeModal();
        }
    });

    extraButtons.forEach(btn => {
        document.getElementById(btn.id).addEventListener('click', btn.onClick);
    });

    const tabLinks = modal.querySelectorAll('.tab-link');
    const tabContents = modal.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.dataset.tab;

            tabLinks.forEach(l => {
                l.classList.remove('border-blue-600', 'text-blue-600');
                l.classList.add('text-slate-500', 'hover:text-slate-700');
            });
            link.classList.add('border-blue-600', 'text-blue-600');
            link.classList.remove('text-slate-500', 'hover:text-slate-700');

            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });
}

export function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

export function getFormHTML(sections, item = {}) {
    return Object.entries(sections).map(([key, fields]) => `
        <fieldset class="mb-4">
            <legend class="font-bold text-slate-700 mb-2">${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</legend>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${fields.map(field => `
                    <div class="${field.type === 'textarea' || field.type === 'checkbox' ? 'sm:col-span-2' : ''}">
                        <label for="form-${field.id}" class="block text-sm font-medium text-slate-600 mb-1">${field.label}</label>
                        ${field.type === 'select' ? `
                            <select id="form-${field.id}" class="w-full p-2 border border-slate-300 rounded-md">
                                ${field.options.map(opt => `<option value="${opt.value}" ${item[field.id] === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                            </select>
                        ` : field.type === 'textarea' ? `
                            <textarea id="form-${field.id}" rows="${field.rows || 3}" class="w-full p-2 border border-slate-300 rounded-md">${item[field.id] || ''}</textarea>
                        ` : field.type === 'checkbox' ? `
                            <input type="checkbox" id="form-${field.id}" ${item[field.id] ? 'checked' : ''} class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                        ` : `
                            <input type="text" id="form-${field.id}" value="${item[field.id] || ''}" class="w-full p-2 border border-slate-300 rounded-md">
                        `}
                    </div>
                `).join('')}
            </div>
        </fieldset>
    `).join('');
}
