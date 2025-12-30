// API Service Layer
const API_BASE = '/api';

// Helper function to get auth token
function getToken() {
    return localStorage.getItem('token');
}

// Helper function to handle API responses
async function handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

// Authentication API
const authAPI = {
    async register(name, email, password) {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        return handleResponse(response);
    },

    async login(email, password) {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        return handleResponse(response);
    },

    async getMe() {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return handleResponse(response);
    }
};

// Events API
const eventsAPI = {
    async getEvents() {
        const response = await fetch(`${API_BASE}/events`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return handleResponse(response);
    },

    async createEvent(name, date) {
        const response = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ name, date })
        });
        return handleResponse(response);
    },

    async getEventByCode(eventCode) {
        const response = await fetch(`${API_BASE}/events/${eventCode}`);
        return handleResponse(response);
    },

    async deleteEvent(eventId) {
        const response = await fetch(`${API_BASE}/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return handleResponse(response);
    }
};

// Photos API
const photosAPI = {
    async uploadPhotos(eventId, files) {
        const formData = new FormData();
        for (let file of files) {
            formData.append('photos', file);
        }

        const response = await fetch(`${API_BASE}/photos/upload/${eventId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });
        return handleResponse(response);
    },

    async getEventPhotos(eventId) {
        const response = await fetch(`${API_BASE}/photos/${eventId}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return handleResponse(response);
    }
};

// Guest API
const guestAPI = {
    async findPhotos(eventCode, selfieFile) {
        const formData = new FormData();
        formData.append('eventCode', eventCode);
        formData.append('selfie', selfieFile);

        const response = await fetch(`${API_BASE}/guest/find-photos`, {
            method: 'POST',
            body: formData
        });
        return handleResponse(response);
    }
};

// Export for use in other scripts
window.authAPI = authAPI;
window.eventsAPI = eventsAPI;
window.photosAPI = photosAPI;
window.guestAPI = guestAPI;
