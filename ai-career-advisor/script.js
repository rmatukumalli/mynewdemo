const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', () => sendMessage());
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

window.addEventListener('load', () => {
    appendMessage('Alex', 'Welcome to the AI Career Advisor!');
    setTimeout(() => {
        appendMessage('Alex', 'Based on your profile, I see you are a Developer. Is that correct?', ['Yes, I am a Developer', 'No, that\'s not right']);
    }, 1000);
});

function sendMessage(message) {
    const userMessage = message || userInput.value;
    if (userMessage.trim() === '') return;

    appendMessage('User', userMessage);
    userInput.value = '';

    showTypingIndicator();

    // Simulate bot response
    setTimeout(() => {
        hideTypingIndicator();
        getBotResponse(userMessage);
    }, 1500);
}

function appendMessage(sender, message, buttons = []) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender.toLowerCase() + '-message');
    
    const senderElement = document.createElement('strong');
    senderElement.innerText = sender;
    
    const messageText = document.createElement('div');
    if (sender === 'Alex') {
        messageText.innerHTML = message;
    } else {
        messageText.innerText = message;
    }

    if (sender === 'User') {
        messageElement.appendChild(messageText);
    } else {
        messageElement.appendChild(senderElement);
        messageElement.appendChild(messageText);
    }


    if (buttons.length > 0) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttons.forEach(buttonText => {
            const button = document.createElement('button');
            button.innerText = buttonText;
            button.addEventListener('click', () => {
                sendMessage(buttonText);
            });
            buttonContainer.appendChild(button);
        });
        messageElement.appendChild(buttonContainer);
    }

    chatBox.appendChild(messageElement);

    // Add click event listeners to skill tags if they exist
    if (messageElement.querySelector('.recommendation-container')) {
        const skillTags = messageElement.querySelectorAll('.skill-tag');
        skillTags.forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
            });
        });
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
    typingIndicator.innerHTML = `
        <strong>Alex</strong>
        <span></span>
        <span></span>
        <span></span>
    `;
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        chatBox.removeChild(typingIndicator);
    }
}

function getBotResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();
    let botMessage = '';

    if (lowerCaseMessage.includes('yes, i am a developer')) {
        document.getElementById('current-role').innerText = 'Developer';
        appendMessage('Alex', 'Great! What are your career aspirations? Here are some potential next steps:', ['Senior Developer', 'Tech Lead', 'Solutions Architect']);
    } else if (lowerCaseMessage.includes('senior developer')) {
        confetti();
        document.getElementById('aspirational-role').innerText = 'Senior Developer';
        const skillGapList = document.getElementById('skill-gap-list');
        skillGapList.innerHTML = `
            <li><strong>Advanced JavaScript:</strong> Deepen your knowledge of closures, async programming, and performance optimization.</li>
            <li><strong>System Design:</strong> Learn to design scalable and resilient systems.</li>
            <li><strong>Cloud Computing:</strong> Understand cloud platforms like AWS, Azure, or GCP.</li>
        `;
        const skills = ['Advanced JavaScript', 'System Design', 'Cloud Computing'];
        const skillTags = skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
        const recommendationHTML = `
            <div class="recommendation-container">
                <h4>Recommendation: Upskill with these advanced courses</h4>
                <div class="skill-tags">
                    ${skillTags}
                </div>
            </div>
        `;
        appendMessage('Alex', recommendationHTML);
        appendMessage('Alex', '', ['Enroll Now']);
    } else if (lowerCaseMessage.includes('tech lead')) {
        confetti();
        document.getElementById('aspirational-role').innerText = 'Tech Lead';
        const skillGapList = document.getElementById('skill-gap-list');
        skillGapList.innerHTML = `
            <li><strong>Leadership & Mentoring:</strong> Guide and support team members.</li>
            <li><strong>Project Management:</strong> Learn agile methodologies and tools like Jira.</li>
            <li><strong>Code Review & Quality Assurance:</strong> Ensure code quality and maintainability.</li>
        `;
        botMessage = 'To become a Tech Lead, you should focus on leadership, project management, and code quality. Here are some recommended courses:';
        const courses = [
            'Agile Crash Course: Agile Project Management, Agile Delivery',
            'Leadership: Practical Leadership Skills',
            'Software Development Processes and Methodologies'
        ];
        const courseList = courses.map(course => `<li>${course}</li>`).join('');
        const courseHTML = `
            <div class="course-container">
                <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Leadership Course">
                <div class="course-content">
                    <p>${botMessage}</p>
                    <ul>${courseList}</ul>
                </div>
            </div>
        `;
        appendMessage('Alex', courseHTML);
        appendMessage('Alex', '', ['Enroll Now']);
    } else if (lowerCaseMessage.includes('solutions architect')) {
        confetti();
        document.getElementById('aspirational-role').innerText = 'Solutions Architect';
        const skillGapList = document.getElementById('skill-gap-list');
        skillGapList.innerHTML = `
            <li><strong>Cloud Architecture:</strong> Deep understanding of cloud services and architecture patterns.</li>
            <li><strong>Enterprise Architecture:</strong> Knowledge of TOGAF or other frameworks.</li>
            <li><strong>Communication & Stakeholder Management:</strong> Effectively communicate with technical and non-technical audiences.</li>
        `;
        botMessage = 'To become a Solutions Architect, you should focus on cloud architecture, enterprise architecture, and communication skills. Here are some recommended courses:';
        const courses = [
            'AWS Certified Solutions Architect - Associate',
            'Enterprise Architecture Foundations',
            'Communicating with Confidence'
        ];
        const courseList = courses.map(course => `<li>${course}</li>`).join('');
        const courseHTML = `
            <div class="course-container">
                <img src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Architecture Course">
                <div class="course-content">
                    <p>${botMessage}</p>
                    <ul>${courseList}</ul>
                </div>
            </div>
        `;
        appendMessage('Alex', courseHTML);
        appendMessage('Alex', '', ['Enroll Now']);
    } else if (lowerCaseMessage.includes('no, that\'s not right')) {
        botMessage = 'Please contact your administrator to resolve this issue.';
        appendMessage('Alex', botMessage);
    } else if (lowerCaseMessage.includes('enroll now')) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        botMessage = 'You have been successfully enrolled in the recommended courses.';
        appendMessage('Alex', botMessage);
    } else {
        botMessage = "I'm sorry, I'm not sure how to respond to that. Could you please ask me about career advice?";
        appendMessage('Alex', botMessage);
    }
}
