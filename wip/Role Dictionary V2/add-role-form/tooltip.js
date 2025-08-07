document.addEventListener('DOMContentLoaded', () => {
    const tooltipData = {};

    // Fetch tooltips.json
    fetch('/RoleDictionary/Role%20Dictionary%20V2/add-role-form/tooltips.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            Object.assign(tooltipData, data);
            initializeTooltips();
        })
        .catch(error => {
            console.error('Error loading tooltips.json:', error);
        });

    function initializeTooltips() {
        const infoIcons = document.querySelectorAll('.info-icon');
        let currentTooltip = null;

        infoIcons.forEach(icon => {
            icon.addEventListener('mouseenter', (event) => {
                const tooltipKey = icon.dataset.tooltipKey;
                const tooltipText = tooltipData[tooltipKey];

                if (tooltipText) {
                    // Remove existing tooltip if any
                    if (currentTooltip) {
                        currentTooltip.remove();
                    }

                    // Create tooltip element
                    currentTooltip = document.createElement('div');
                    currentTooltip.classList.add('tooltip');
                    currentTooltip.textContent = tooltipText;
                    document.body.appendChild(currentTooltip);

                    // Position the tooltip
                    const iconRect = icon.getBoundingClientRect();
                    currentTooltip.style.left = `${iconRect.left + window.scrollX + iconRect.width / 2}px`;
                    currentTooltip.style.top = `${iconRect.top + window.scrollY - currentTooltip.offsetHeight - 10}px`; // 10px above icon
                    currentTooltip.style.transform = 'translateX(-50%)'; // Center horizontally

                    // Add active class to show tooltip with transition
                    setTimeout(() => {
                        currentTooltip.classList.add('active');
                    }, 10); // Small delay to allow CSS transition
                }
            });

            icon.addEventListener('mouseleave', () => {
                if (currentTooltip) {
                    currentTooltip.remove();
                    currentTooltip = null;
                }
            });

            // Handle click for touch devices (optional, for accessibility)
            icon.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent click from propagating to document
                const tooltipKey = icon.dataset.tooltipKey;
                const tooltipText = tooltipData[tooltipKey];

                if (tooltipText) {
                    if (currentTooltip && currentTooltip.dataset.tooltipKey === tooltipKey) {
                        // If clicking the same icon, hide tooltip
                        currentTooltip.remove();
                        currentTooltip = null;
                    } else {
                        // Remove existing tooltip if any
                        if (currentTooltip) {
                            currentTooltip.remove();
                        }

                        // Create tooltip element
                        currentTooltip = document.createElement('div');
                        currentTooltip.classList.add('tooltip');
                        currentTooltip.textContent = tooltipText;
                        currentTooltip.dataset.tooltipKey = tooltipKey; // Store key to identify
                        document.body.appendChild(currentTooltip);

                        // Position the tooltip
                        const iconRect = icon.getBoundingClientRect();
                        currentTooltip.style.left = `${iconRect.left + window.scrollX + iconRect.width / 2}px`;
                        currentTooltip.style.top = `${iconRect.top + window.scrollY - currentTooltip.offsetHeight - 10}px`;
                        currentTooltip.style.transform = 'translateX(-50%)';

                        // Add active class to show tooltip with transition
                        setTimeout(() => {
                            currentTooltip.classList.add('active');
                        }, 10); // Small delay to allow CSS transition
                    }
                }
            });
        });

        // Hide tooltip if clicking anywhere else on touch devices
        document.addEventListener('click', (event) => {
            if (currentTooltip && !event.target.closest('.info-icon')) {
                currentTooltip.remove();
                currentTooltip = null;
            }
        });
    }
});
