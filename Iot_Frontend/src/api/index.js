// config.js
const BASE_URL = 'http://localhost:5000';
// const BIO_LAB_BASE_URL = 'https://your-bio-lab-url.com/api';

// Helper: Get Authorization Header
function getAuthHeader() {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper: Refresh Token
async function refreshToken() {
    try {
        const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            return true;
        } else {
            console.error('Token refresh failed');
            return false;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        return false;
    }
}

// API Request Function
async function apiRequest(method, url, body = null, type = 'json', baseUrl = BASE_URL+'/api') {
    try {
        const headers = {
            'Content-Type': type === 'json' ? 'application/json' : 'multipart/form-data',
            ...getAuthHeader(),
        };

        const options = {
            method,
            headers,
        };

        if (body) {
            options.body = type === 'json' ? JSON.stringify(body) : body;
        }

        const response = await fetch(baseUrl + url, options);

        if (response.ok) {
            return await response.json();
        } else if (response.status === 401) {
            console.log('Token expired, attempting refresh...');
            if (await refreshToken()) {
                return await apiRequest(method, url, body, type, baseUrl); // Retry request
            }
            throw new Error('Authentication failed after token refresh');
        } else {
            throw new Error(`API error: ${response.status}`);
        }
    } catch (error) {
        console.error('Request failed:', error);
        return null;
    }
}

// Specific API Call Functions
export function getRequest(url) {
    return apiRequest('GET', url);
}

function postRequest(url, body, type = 'json') {
    return apiRequest('POST', url, body, type);
}

function putRequest(url, body, type = 'json') {
    return apiRequest('PUT', url, body, type);
}

function patchRequest(url, body, type = 'json') {
    return apiRequest('PATCH', url, body, type);
}

function deleteRequest(url) {
    return apiRequest('DELETE', url);
}
