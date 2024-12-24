// config.js
const BASE_URL = 'http://localhost:5000';
// const BIO_LAB_BASE_URL = 'https://your-bio-lab-url.com/api';
import axios from 'axios';

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            if (error.response.status === 401 && !originalRequest._retry) {
                // Handle unauthorized access (401)
                console.log('Unauthorized access - Token might be expired.');
                originalRequest._retry = true;

                // Here you would typically refresh the token
                // const refreshTokenSuccess = await refreshToken();

                // if (refreshTokenSuccess) {
                //     originalRequest.headers['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken');
                //     return axios(originalRequest);
                // }

                clearUserSession();
            } else if (error.response.status === 403) {
                // Handle forbidden access (403)
                console.log('Forbidden access - You do not have permission to access this resource.');
                // Clear user session or show a notification
                clearUserSession();
                // Optionally, redirect to a "403 Forbidden" page or show a message
            }
        }

        return Promise.reject(error);
    }
);
// Helper: Get Authorization Header
function getAuthHeader() {
    const token = localStorage.getItem('token');
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
// API Request Function using Axios
async function apiRequest(method, url, body = null, type = 'json', baseUrl = BASE_URL + '/api') {
    try {
        const headers = {
            'Content-Type': type === 'json' ? 'application/json' : 'multipart/form-data',
            ...getAuthHeader(),
        };

        const options = {
            method,
            url: baseUrl + url,
            headers,
            data: body ? (type === 'json' ? body : body) : undefined,
        };

        const response = await axios(options);

        return response.data; // Axios automatically parses the JSON response
    } catch (error) {
        console.error('Request failed:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}
// Specific API Call Functions
export function getRequest(url) {
    return apiRequest('GET', url);
}

export function postRequest(url, body, type = 'json') {
    return apiRequest('POST', url, body, type);
}

export function putRequest(url, body, type = 'json') {
    return apiRequest('PUT', url, body, type);
}

function patchRequest(url, body, type = 'json') {
    return apiRequest('PATCH', url, body, type);
}

export function deleteRequest(url) {
    return apiRequest('DELETE', url);
}

function clearUserSession() {
    localStorage.removeItem('email');
    localStorage.removeItem('uid');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    window.location.href = '/login';
}