// JavaScript for Talent Intelligence
document.addEventListener('DOMContentLoaded', function() {
    console.log('Talent Intelligence page loaded and script running.');

    // Example: Add a dynamic message
    const mainElement = document.querySelector('main');
    if (mainElement) {
        const dynamicMessage = document.createElement('p');
        dynamicMessage.textContent = 'This message was added by talent-intelligence.js!';
        dynamicMessage.style.color = 'green';
        mainElement.appendChild(dynamicMessage);
    }
});
