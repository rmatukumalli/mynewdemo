function showModal(modalId, message = '', title = '') {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    if (modalId === 'confirmationModal') {
        if (title) document.getElementById('confirmationModalTitle').innerText = title;
        if (message) document.getElementById('confirmationModalMessage').innerText = message;
    }
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.classList.remove('active');
        }
    });
}
