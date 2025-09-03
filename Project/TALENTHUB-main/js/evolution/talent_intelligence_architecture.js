// JavaScript for talent_intelligence_architecture.html
document.addEventListener('DOMContentLoaded', function() {
    console.log('Talent Intelligence Architecture page loaded and script running.');

    // Example: Smooth scroll for navigation links if any are added to the page
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Example: Add a dynamic element or interaction
    const mainContent = document.querySelector('.container');
    if (mainContent) {
        const dynamicMessage = document.createElement('p');
        dynamicMessage.textContent = 'This message is dynamically added by JavaScript.';
        dynamicMessage.style.textAlign = 'center';
        dynamicMessage.style.marginTop = '20px';
        dynamicMessage.style.color = '#0779e4';
        // mainContent.appendChild(dynamicMessage); // Uncomment to add the message
    }

    // Further interactivity can be added here, for example:
    // - Event listeners for buttons or interactive elements
    // - Fetching data from an API to display dynamic content
    // - Manipulating the DOM based on user actions
});
