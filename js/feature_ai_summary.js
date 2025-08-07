function openTab(evt, tabName) {
    // Get all elements with class="tab-content" and hide them
    let tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tab-link" and remove the class "active"
    let tablinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener('DOMContentLoaded', () => {
    // Ensure the first tab is active and its content is displayed by default.
    // This handles the case where the HTML might not have the 'active' class or inline style set correctly initially.
    const firstTabButton = document.querySelector('.tab-navigation button.tab-link');
    const featuresTabContent = document.getElementById('features');

    if (firstTabButton && featuresTabContent) {
        // Hide all tab contents first
        let allTabContents = document.getElementsByClassName("tab-content");
        for (let i = 0; i < allTabContents.length; i++) {
            allTabContents[i].style.display = "none";
        }
        
        // Deactivate all tab links
        let allTabLinks = document.getElementsByClassName("tab-link");
        for (let i = 0; i < allTabLinks.length; i++) {
            allTabLinks[i].className = allTabLinks[i].className.replace(" active", "");
        }

        // Activate the first tab and show its content
        featuresTabContent.style.display = "block";
        // The first button in HTML is for 'features', so we find it and make it active.
        // This assumes the first button in the HTML structure corresponds to the 'features' tab.
        document.querySelector('.tab-navigation button[onclick*="\'features\'"]').classList.add('active');
    }
});
