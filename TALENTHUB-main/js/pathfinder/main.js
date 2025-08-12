function simulatePromotion() {
    navigateTo('screen12');
}

function logout() {
    navigateTo('pathfinderIntroContent');
    showModal('confirmationModal', 'You have been logged out (simulated).', 'Logout');
}

document.addEventListener('DOMContentLoaded', () => {
    navigateTo('pathfinderIntroContent');

    const homeAspirationalRoleEl = document.getElementById('homeAspirationalRole');
    if (homeAspirationalRoleEl) {
        homeAspirationalRoleEl.innerText = aspirationalRole;
    }

    displayDateTime();
    setInterval(displayDateTime, 1000);
});
