function updateJourneyTimeline(currentContentId) {
    let currentStepIndex = -1;
    journeyMap.forEach((step, index) => {
        if (step.contentId === currentContentId) {
            currentStepIndex = index;
        }
    });

    journeyMap.forEach((step, index) => {
        const timelineElement = document.getElementById(step.timelineId);
        if (timelineElement) {
            timelineElement.classList.remove('active', 'completed');
            if (index < currentStepIndex) {
                timelineElement.classList.add('completed');
            } else if (index === currentStepIndex) {
                timelineElement.classList.add('active');
            }
        }
    });
}

function navigateToMainContent(newContentId) {
    if (document.getElementById(activeMainContentId)) {
        document.getElementById(activeMainContentId).classList.remove('active');
    }
    const newContentElement = document.getElementById(newContentId);
    if (newContentElement) {
        newContentElement.classList.add('active');
        activeMainContentId = newContentId;
    } else {
        console.warn("Content ID not found for main panel:", newContentId);
        if (document.getElementById('pathfinderIntroContent')) {
             document.getElementById('pathfinderIntroContent').classList.add('active');
             activeMainContentId = 'pathfinderIntroContent';
        }
    }

    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`navigateTo('${newContentId}')`)) {
            link.classList.add('active');
        }
    });

    document.querySelector('.app-layout').style.display = 'flex';
    if(currentFullScreenId && document.getElementById(currentFullScreenId)){
        document.getElementById(currentFullScreenId).classList.remove('active');
        currentFullScreenId = null;
    }
    updateJourneyTimeline(newContentId);
    window.scrollTo(0, 0);
}

function navigateTo(screenId) {
    const mainPanelContentIds = ['screen1', 'screen2', 'screen3', 'screen5', 'dashboardContent', 'screen4', 'screen7', 'screen8', 'screen9', 'screen10', 'screen11', 'screen12', 'pathfinderIntroContent'];

    if (mainPanelContentIds.includes(screenId)) {
        navigateToMainContent(screenId);
    } else if (screenId === 'screen5FromDashboard' || screenId === 'screen5FromPromotion') {
        navigateTo('screen5');
    } else {
        console.warn("Unknown screenId for navigation:", screenId);
        navigateToMainContent('pathfinderIntroContent'); // Fallback
    }
    window.scrollTo(0, 0);
}
