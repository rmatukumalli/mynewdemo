// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Mobile filter toggle
const mobileFilterBtn = document.getElementById('mobileFilterBtn');
const filterSidebar = document.getElementById('filterSidebar');
const closeFilterBtn = document.getElementById('closeFilterBtn');
const filterBackdrop = document.getElementById('filterBackdrop');

if (mobileFilterBtn && filterSidebar && closeFilterBtn && filterBackdrop) {
    mobileFilterBtn.addEventListener('click', () => {
        filterSidebar.classList.add('open');
        filterBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden'; 
    });

    const closeFilters = () => {
        filterSidebar.classList.remove('open');
        filterBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    };
    closeFilterBtn.addEventListener('click', closeFilters);
    filterBackdrop.addEventListener('click', closeFilters);
}

// Collapsible filter sections
const filterSectionHeaders = document.querySelectorAll('.filter-section-header');
filterSectionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        header.classList.toggle('open');
        content.classList.toggle('open');
        // If you want only one section open at a time, uncomment below:
        // filterSectionHeaders.forEach(otherHeader => {
        //     if (otherHeader !== header && otherHeader.classList.contains('open')) {
        //         otherHeader.classList.remove('open');
        //         otherHeader.nextElementSibling.classList.remove('open');
        //     }
        // });
    });
    // Optionally, open the first few sections by default
    // if (header.parentElement.querySelector('h3')?.textContent.includes('Job Category') || 
    //     header.parentElement.querySelector('h3')?.textContent.includes('Job Type')) {
    //     header.click();
    // }
});

// Set current year in footer (if element exists)
const currentYearElem = document.getElementById('currentYear');
if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
}

console.log("Akara Airlines Careers Prototype Loaded. Search and filters are for demonstration purposes.");

document.addEventListener('DOMContentLoaded', () => {
    // Chatbot Functionality
    const chatbotToggleButton = document.getElementById('chatbotToggleButton');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const closeChatbotButton = document.getElementById('closeChatbotButton');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendChatButton = document.getElementById('sendChatButton');

    if (chatbotToggleButton && chatbotContainer && closeChatbotButton && chatMessages && chatInput && sendChatButton) {
        chatbotToggleButton.addEventListener('click', () => {
            chatbotContainer.classList.toggle('hidden');
            if (!chatbotContainer.classList.contains('hidden')) {
                chatInput.focus();
            }
        });

        closeChatbotButton.addEventListener('click', () => {
            chatbotContainer.classList.add('hidden');
        });

        const addMessageToChat = (content, sender, isHtml = false) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('flex');
            if (sender === 'user') {
                messageDiv.classList.add('justify-end');
            }

            const messageBubble = document.createElement('div');
            messageBubble.classList.add('p-3', 'rounded-lg', 'text-sm');
            if (sender === 'user') {
                messageBubble.classList.add('bg-akara-red', 'text-white', 'max-w-xs');
            } else {
                messageBubble.classList.add('bg-gray-200', 'text-gray-800', 'max-w-md'); // Bot messages can be wider
            }

            if (isHtml) {
                messageBubble.innerHTML = content;
            } else {
                messageBubble.textContent = content;
            }
            
            messageDiv.appendChild(messageBubble);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
        };
        
        const handleOptionClick = (option) => {
            let userMessageText = '';
            let botResponseText = '';

            switch (option) {
                case 'browse_jobs':
                    userMessageText = "✈️ Browse Job Openings";
                    botResponseText = "Great! You can see all our job openings on the main careers page. Use the search and filters to narrow down your options!";
                    // Potentially redirect or highlight search section
                    // window.location.href = 'akara-careers.html#search-section'; // Example redirect
                    break;
                case 'upload_resume':
                    userMessageText = "📝 Upload My Resume";
                    // Updated botResponseText to include a button
                    botResponseText = `Excellent! On the job details page, you'll find an 'Upload Resume & Match' button. This will help you see how your skills align!<br><button onclick="window.location.href='akara-job-detail.html'" class="mt-2 p-2 bg-akara-blue text-white text-xs rounded hover:bg-akara-blue-dark transition-colors duration-150 shadow-sm">View Example Job Detail Page</button>`;
                    addMessageToChat(userMessageText, 'user');
                    setTimeout(() => {
                        addMessageToChat(botResponseText, 'bot', true); // Pass true for isHtml
                    }, 600);
                    return; // Return early as we've handled this specific response
                case 'match_skills':
                    userMessageText = "💡 See Jobs That Match My Skills";
                    botResponseText = "Smart move! After uploading your resume on a job detail page, we'll show you a skill match. You can also browse jobs by category.";
                    break;
                case 'ask_question':
                    userMessageText = "❓ Ask a Question";
                    botResponseText = "Sure, I'm here to help! Please type your question below.";
                    chatInput.focus(); // Focus on input for user to type
                    addMessageToChat(userMessageText, 'user');
                    addMessageToChat(botResponseText, 'bot', false); // isHtml is false here
                    return; // Don't proceed to generic bot response
            }

            addMessageToChat(userMessageText, 'user');
            setTimeout(() => {
                addMessageToChat(botResponseText, 'bot', false); // isHtml is false for other standard text responses
            }, 600);
        };


        const handleSendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                addMessageToChat(message, 'user', false);
            chatInput.value = '';
            // Simulate bot response for typed messages
            setTimeout(() => {
                let botResponse = "Thanks for your message! I'm still learning. How else can I assist you with Akara Airlines careers?";
                if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                    botResponse = "Hello again! What can I help you with now?";
                } else if (message.toLowerCase().includes('salary') || message.toLowerCase().includes('pay')) {
                    botResponse = "Salary information is typically discussed during the interview process. You can ask the recruiter for more details.";
                } else if (message.toLowerCase().includes('benefits')) {
                    botResponse = "Akara Airlines offers a comprehensive benefits package! You can find more details on our 'Life at Akara' page or ask during your interview.";
                } else if (message.toLowerCase().includes('remote') || message.toLowerCase().includes('work from home')) {
                    botResponse = "We have various roles, some of which are remote or hybrid. You can filter for 'Remote jobs only' on the main search page.";
                }
                addMessageToChat(botResponse, 'bot', false);
            }, 1000);
        }
    };

    sendChatButton.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Add event listeners to initial option buttons
    // This needs to be done carefully as the initial message is part of the static HTML.
    // We'll use event delegation on the chatMessages container.
    chatMessages.addEventListener('click', (event) => {
        const targetButton = event.target.closest('.chatbot-option-button');
        if (targetButton && targetButton.dataset.option) {
            handleOptionClick(targetButton.dataset.option);
            // Optionally, disable or hide the initial options after one is clicked
            // const initialOptionsContainer = targetButton.closest('.space-y-1.5');
            // if (initialOptionsContainer) {
            //     initialOptionsContainer.style.display = 'none'; 
            // }
        }
    });
}
});
