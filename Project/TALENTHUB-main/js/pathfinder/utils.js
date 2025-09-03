function loadLocalFontAwesome() {
    console.warn('Failed to load Font Awesome from CDN, falling back to local file.');
    var localLink = document.createElement('link');
    localLink.rel = 'stylesheet';
    localLink.href = 'css/all.min.css';
    document.head.appendChild(localLink);
    var cdnLink = document.getElementById('fontAwesomeCdn');
    if (cdnLink) { cdnLink.onerror = null; }
}

function displayDateTime() {
    const dateTimeElement = document.getElementById('dateTime');
    if (dateTimeElement) {
        const now = new Date();
        const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const dateString = now.toLocaleDateString(undefined, optionsDate);
        const timeString = now.toLocaleTimeString(undefined, optionsTime);
        dateTimeElement.innerHTML = `📅 ${dateString} | ⏰ ${timeString}`;
    }
}
