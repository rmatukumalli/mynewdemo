// js/profile.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Profile page JavaScript loaded.');

    // Connect button functionality (Example, adapt if your buttons are different)
    // The example HTML had "Connect", "Message", "More".
    // For an internal profile, these might be "View Activity", "Share Profile", etc.
    // Let's assume the first primary button is the one to make interactive for demo.
    const primaryActionBtn = document.querySelector('.profile-card .action-buttons .btn-primary');
    if (primaryActionBtn) {
        const originalText = primaryActionBtn.textContent;
        let isPending = false;

        primaryActionBtn.addEventListener('click', function() {
            if (!isPending) {
                this.textContent = 'Processing...'; // Or some other feedback
                this.style.background = '#6c757d'; // A neutral "pending" color
                isPending = true;
                // Simulate an action
                setTimeout(() => {
                    this.textContent = originalText; // Revert or change to a "Completed" state
                    this.style.background = '#0a66c2'; // Revert to original primary color
                    isPending = false;
                    // alert("Action completed!"); // Optional: notify user
                }, 1500);
            }
        });
    }


    // Animate skill tags on hover
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            // Ensure transition is defined in CSS for smoothness, or add here:
            // this.style.transition = 'all 0.2s ease'; 
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Smooth scroll-in animation for sections
    const sections = document.querySelectorAll('.main-content .section, .sidebar .section');
    
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.setProperty('display', 'block', 'important');
        section.style.setProperty('opacity', '1', 'important');
        section.style.setProperty('transform', 'translateY(0)', 'important');
        // section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'; // Transition might not be needed if always visible
        // observer.observe(section); // Keep observer disabled
    });

    // Fallback for browsers that might not trigger IntersectionObserver immediately or for above-the-fold content
    // This is a simplified version of the timeout-based animation from the example.
    // The IntersectionObserver is generally preferred.
    // setTimeout(() => {
    //     sections.forEach((section, index) => {
    //         // Check if already animated by IntersectionObserver
    //         if (section.style.opacity === '0') { 
    //             setTimeout(() => {
    //                 section.style.opacity = '1';
    //                 section.style.transform = 'translateY(0)';
    //             }, index * 100); // Stagger animation
    //         }
    //     });
    // }, 100);
});
