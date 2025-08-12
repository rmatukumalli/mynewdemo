// JavaScript for Role Architecture
document.addEventListener('DOMContentLoaded', function() {
    console.log('Role Architecture page loaded and script running.');

    // Example: Add a dynamic message
    const mainElement = document.querySelector('main');
    if (mainElement) {
        const dynamicMessage = document.createElement('p');
        dynamicMessage.textContent = 'This message was added by role-architecture.js!';
        dynamicMessage.style.color = 'blue'; // Different color
        mainElement.appendChild(dynamicMessage);
    }
});
