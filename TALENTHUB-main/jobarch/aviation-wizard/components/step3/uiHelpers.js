// aviation-wizard/components/step3/uiHelpers.js
import { getIcon } from '../../state.js';

export const SkillPill = (type) => {
    const baseClasses = 'text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full whitespace-nowrap';
    const typeStyles = {
        'Specialist Skill': 'bg-green-100 text-green-800',
        'Tool & Technology': 'bg-yellow-100 text-yellow-800',
        'AI Suggested': 'bg-purple-100 text-purple-800', // Added for consistency with jobDetailsRenderer
        // Add other types if necessary
    };
    const titleAttribute = type === 'Specialist Skill' ? 'title="Specialist Skill: Considered essential for success in this role."' : '';
    return `<span class="${baseClasses} ${typeStyles[type] || 'bg-gray-100 text-gray-800'}" ${titleAttribute}>${type}</span>`;
};

export const AccordionItem = (title, children, badgeCount, isOpen = false, accordionId) => {
    // Note: The original comment about ChevronUp/Down and getIcon is preserved.
    // If getIcon doesn't have 'ChevronUp' and 'ChevronDown' specifically,
    // this might need adjustment or those icons added to state.js.
    // Assuming getIcon can handle these or similar (e.g., 'ChevronDown' and 'ChevronUp' might be 'chevron-down', 'chevron-up')
    // For now, using the logic as it was.
    return `
        <div class="border-b">
            <button data-accordion-id="${accordionId}" class="accordion-toggle w-full flex justify-between items-center p-4 text-left hover:bg-gray-50">
                <span class="font-semibold text-gray-700">${title}</span>
                <div class="flex items-center">
                    <span class="text-sm bg-gray-200 text-gray-600 font-medium mr-2 px-2 py-0.5 rounded-full">${badgeCount} Skills</span>
                    <span class="accordion-chevron">${getIcon(isOpen ? 'ChevronDown' : 'ChevronUp')}</span> 
                </div>
            </button>
            <div class="accordion-content ${isOpen ? '' : 'hidden'} bg-gray-50">
                ${children}
            </div>
        </div>
    `;
};
