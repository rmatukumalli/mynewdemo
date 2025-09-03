// Make openTab globally accessible for inline onclick handlers
window.openTab = function(evt, tabName) {
    let i, tabcontent, tablinks;

    // Get all elements with class="tab-content" and hide them
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tab-link" and remove the class "active"
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    const currentTabElement = document.getElementById(tabName);
    if (currentTabElement) {
        currentTabElement.style.display = "block";
    }
    
    // If evt is null or undefined, it means the tab was opened programmatically (e.g. by edit button)
    // We need to find the corresponding tab link and make it active.
    if (evt && evt.currentTarget) {
        evt.currentTarget.className += " active";
    } else {
        // Find the button that corresponds to tabName and make it active
        const tabButton = document.querySelector(`.tabs button.tab-link[onclick*="'${tabName}'"]`);
        if (tabButton) {
            tabButton.className += " active";
        }
    }
}

// Optional: Initialize the default tab if needed, though HTML usually handles the first active tab.
// This could be useful if you want to ensure a specific tab is open on page load without inline styles.
// document.addEventListener('DOMContentLoaded', () => {
//     // Example: Open the first tab or a specific tab by default
//     const firstTabButton = document.querySelector('.tabs button.tab-link');
//     if (firstTabButton) {
//         // To get the tabName from the onclick attribute:
//         // const onclickAttr = firstTabButton.getAttribute('onclick');
//         // const tabNameMatch = onclickAttr ? onclickAttr.match(/openTab\(event, '([^']+)'\)/) : null;
//         // if (tabNameMatch && tabNameMatch[1]) {
//         //     openTab(null, tabNameMatch[1]); // Open programmatically
//         // }
//         // Or, if the first tab is always 'existing-skills-tab' and has the 'active' class in HTML:
//         if (document.getElementById('existing-skills-tab') && firstTabButton.classList.contains('active')) {
//             // Already handled by HTML structure and CSS
//         } else if (document.getElementById('existing-skills-tab')) {
//             // openTab(null, 'existing-skills-tab'); // Or trigger its click
//         }
//     }
// });
