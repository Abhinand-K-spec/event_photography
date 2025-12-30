// Dashboard Functionality
const photographerName = document.getElementById('photographerName');
const logoutButton = document.getElementById('logoutButton');
const loadingState = document.getElementById('loadingState');
const eventsGrid = document.getElementById('eventsGrid');
const emptyState = document.getElementById('emptyState');
const qrModal = document.getElementById('qrModal');
const qrModalTitle = document.getElementById('qrModalTitle');
const qrCodeImage = document.getElementById('qrCodeImage');
const closeQrModal = document.getElementById('closeQrModal');
const downloadQrButton = document.getElementById('downloadQrButton');

let currentQrUrl = '';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const photographer = JSON.parse(localStorage.getItem('photographer') || '{}');

    if (!token || !photographer.name) {
        window.location.href = '/login.html';
        return null;
    }

    photographerName.textContent = photographer.name;
    return photographer;
}

// Logout
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('photographer');
    window.location.href = '/login.html';
});

// Load events
async function loadEvents() {
    try {
        loadingState.classList.remove('hidden');
        eventsGrid.classList.add('hidden');
        emptyState.classList.add('hidden');

        const data = await eventsAPI.getEvents();
        const events = data.events;

        if (events.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            renderEvents(events);
            eventsGrid.classList.remove('hidden');
        }
    } catch (error) {
        alert('Failed to load events: ' + error.message);
    } finally {
        loadingState.classList.add('hidden');
    }
}

// Render events
function renderEvents(events) {
    eventsGrid.innerHTML = events.map(event => {
        const eventDate = new Date(event.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
      <div class="event-card">
        <div class="event-card-header">
          <h3 class="event-name">${event.name}</h3>
          <div class="event-date">📅 ${eventDate}</div>
          <div class="event-date" style="margin-top: var(--space-2);">📸 ${event.photoCount} photos</div>
        </div>
        <div class="event-actions">
          <button class="btn btn-secondary btn-sm" onclick="uploadPhotos('${event.id}')">
            Upload Photos
          </button>
          <button class="btn btn-outline btn-sm" onclick="showQRCode('${event.name}', '${event.qrCodePath}')">
            View QR Code
          </button>
          <button class="btn btn-secondary btn-sm" onclick="copyEventLink('${event.eventCode}')">
            Copy Link
          </button>
        </div>
      </div>
    `;
    }).join('');
}

// Upload photos
window.uploadPhotos = async (eventId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';

    input.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (!confirm(`Upload ${files.length} photo(s)?`)) return;

        try {
            const button = event.target;
            button.disabled = true;
            button.textContent = 'Uploading...';

            await photosAPI.uploadPhotos(eventId, files);
            alert('Photos uploaded successfully!');
            loadEvents(); // Reload to show updated count
        } catch (error) {
            alert('Upload failed: ' + error.message);
        }
    });

    input.click();
};

// Show QR code
window.showQRCode = (eventName, qrCodePath) => {
    // Validate QR code path exists
    if (!qrCodePath || qrCodePath === 'undefined' || qrCodePath === 'null') {
        alert('QR code not available for this event');
        return;
    }

    qrModalTitle.textContent = eventName;
    qrCodeImage.src = qrCodePath;
    currentQrUrl = qrCodePath;

    // Add error handler for image loading
    qrCodeImage.onerror = () => {
        qrCodeImage.style.display = 'none';
        alert('Failed to load QR code. The QR code may not have been generated yet.');
        qrModal.classList.add('hidden');
        qrModal.style.display = 'none';
    };

    // Reset image display in case it was hidden before
    qrCodeImage.style.display = 'block';

    qrModal.classList.remove('hidden');
    qrModal.style.display = 'flex';
};

// Close QR modal
closeQrModal.addEventListener('click', () => {
    qrModal.classList.add('hidden');
    qrModal.style.display = 'none';
});

qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) {
        qrModal.classList.add('hidden');
        qrModal.style.display = 'none';
    }
});

// Download QR code
downloadQrButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = currentQrUrl;
    link.download = `qr-code-${Date.now()}.png`;
    link.click();
});

// Copy event link
window.copyEventLink = async (eventCode) => {
    const eventUrl = `${window.location.origin}/event.html?code=${eventCode}`;

    try {
        await navigator.clipboard.writeText(eventUrl);
        alert('Event link copied to clipboard!');
    } catch (error) {
        // Fallback for older browsers
        const input = document.createElement('input');
        input.value = eventUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('Event link copied to clipboard!');
    }
};

// Initialize
checkAuth();
loadEvents();
