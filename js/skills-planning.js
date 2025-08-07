// JavaScript for Skills Planning
document.addEventListener('DOMContentLoaded', function() {
    console.log('Skills Planning page loaded and script running.');

    // Example: Add a dynamic message
    const mainElement = document.querySelector('main');
    if (mainElement) {
        const dynamicMessage = document.createElement('p');
        dynamicMessage.textContent = 'This message was added by skills-planning.js!';
        dynamicMessage.style.color = 'purple'; // Different color
        mainElement.appendChild(dynamicMessage);
    }
});
