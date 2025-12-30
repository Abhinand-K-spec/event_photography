// Create Event Functionality
const createEventForm = document.getElementById('createEventForm');
const eventForm = document.getElementById('eventForm');
const successState = document.getElementById('successState');
const alertMessage = document.getElementById('alertMessage');
const createButton = document.getElementById('createButton');
const createdEventName = document.getElementById('createdEventName');
const qrCodeImage = document.getElementById('qrCodeImage');
const eventUrl = document.getElementById('eventUrl');
const copyLinkButton = document.getElementById('copyLinkButton');
const downloadQrButton = document.getElementById('downloadQrButton');

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
    }
}

// Show alert
function showAlert(message, type = 'error') {
    alertMessage.className = `alert alert-${type}`;
    alertMessage.textContent = message;
    alertMessage.classList.remove('hidden');
}

function clearAlert() {
    alertMessage.classList.add('hidden');
}

// Handle form submission
eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const name = document.getElementById('eventName').value;
    const date = document.getElementById('eventDate').value;

    try {
        createButton.disabled = true;
        createButton.textContent = 'Creating...';

        const data = await eventsAPI.createEvent(name, date);
        const event = data.event;

        // Show success state
        createdEventName.textContent = event.name;
        qrCodeImage.src = event.qrCodeUrl;
        eventUrl.value = event.eventUrl;

        createEventForm.classList.add('hidden');
        successState.classList.remove('hidden');
    } catch (error) {
        showAlert(error.message, 'error');
    } finally {
        createButton.disabled = false;
        createButton.textContent = 'Create Event';
    }
});

// Copy link to clipboard
copyLinkButton.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(eventUrl.value);
        copyLinkButton.textContent = 'Copied!';
        setTimeout(() => {
            copyLinkButton.textContent = 'Copy';
        }, 2000);
    } catch (error) {
        // Fallback
        eventUrl.select();
        document.execCommand('copy');
        copyLinkButton.textContent = 'Copied!';
        setTimeout(() => {
            copyLinkButton.textContent = 'Copy';
        }, 2000);
    }
});

// Download QR code
downloadQrButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = qrCodeImage.src;
    link.download = `qr-code-${Date.now()}.png`;
    link.click();
});

// Set minimum date to today
const dateInput = document.getElementById('eventDate');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

// Initialize
checkAuth();
