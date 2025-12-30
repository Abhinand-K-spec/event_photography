// Guest Event Page Functionality
const eventTitle = document.getElementById('eventTitle');
const eventDate = document.getElementById('eventDate');
const uploadSection = document.getElementById('uploadSection');
const selfiePreview = document.getElementById('selfiePreview');
const selfieInput = document.getElementById('selfieInput');
const findPhotosButton = document.getElementById('findPhotosButton');
const loadingState = document.getElementById('loadingState');
const resultsSection = document.getElementById('resultsSection');
const resultsTitle = document.getElementById('resultsTitle');
const photoGallery = document.getElementById('photoGallery');
const emptyResults = document.getElementById('emptyResults');
const tryAgainButton = document.getElementById('tryAgainButton');
const retryButton = document.getElementById('retryButton');

let eventCode = '';
let selectedSelfie = null;

// Get event code from URL
function getEventCode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
}

// Load event details
async function loadEvent() {
    eventCode = getEventCode();

    if (!eventCode) {
        eventTitle.textContent = 'Invalid Event';
        alert('Event not found. Please scan a valid QR code.');
        return;
    }

    try {
        const data = await eventsAPI.getEventByCode(eventCode);
        const event = data.event;

        eventTitle.textContent = event.name;

        const date = new Date(event.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        eventDate.textContent = `📅 ${date}`;
    } catch (error) {
        eventTitle.textContent = 'Event Not Found';
        alert('Failed to load event: ' + error.message);
    }
}

// Handle selfie selection
selfieInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
    }

    selectedSelfie = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        selfiePreview.innerHTML = `<img src="${e.target.result}" alt="Selfie preview">`;
        findPhotosButton.disabled = false;
    };
    reader.readAsDataURL(file);
});

// Find photos
findPhotosButton.addEventListener('click', async () => {
    if (!selectedSelfie) {
        alert('Please upload a selfie first');
        return;
    }

    try {
        // Show loading state
        uploadSection.classList.add('hidden');
        loadingState.classList.remove('hidden');

        const data = await guestAPI.findPhotos(eventCode, selectedSelfie);
        const photos = data.photos;

        // Hide loading
        loadingState.classList.add('hidden');

        if (photos.length === 0) {
            emptyResults.classList.remove('hidden');
        } else {
            renderPhotos(photos);
            resultsTitle.textContent = `We found ${photos.length} photo${photos.length > 1 ? 's' : ''}!`;
            resultsSection.classList.remove('hidden');
        }
    } catch (error) {
        loadingState.classList.add('hidden');
        alert('Failed to find photos: ' + error.message);
        uploadSection.classList.remove('hidden');
    }
});

// Render photos
function renderPhotos(photos) {
    photoGallery.innerHTML = photos.map(photo => `
    <div class="photo-item">
      <img src="${photo.url}" alt="Event photo">
      <div class="photo-overlay">
        <a 
          href="/api/photos/download/${photo.id}" 
          class="btn btn-primary btn-sm"
          download
        >
          Download
        </a>
      </div>
    </div>
  `).join('');
}

// Try again
tryAgainButton.addEventListener('click', resetUpload);
retryButton.addEventListener('click', resetUpload);

function resetUpload() {
    resultsSection.classList.add('hidden');
    emptyResults.classList.add('hidden');
    uploadSection.classList.remove('hidden');
    selfiePreview.innerHTML = '<span class="selfie-placeholder">📷</span>';
    selfieInput.value = '';
    selectedSelfie = null;
    findPhotosButton.disabled = true;
}

// Initialize
loadEvent();
