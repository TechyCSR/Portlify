import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add auth token to requests
api.interceptors.request.use(async (config) => {
    // Get token from Clerk if available
    if (window.Clerk?.session) {
        const token = await window.Clerk.session.getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

// Auth APIs
export const checkUsername = (username) =>
    api.get(`/api/auth/check-username?username=${encodeURIComponent(username)}`)

export const registerUser = (data) =>
    api.post('/api/auth/register', data)

export const getCurrentUser = () =>
    api.get('/api/auth/me')

// Cloudinary APIs
export const getCloudinarySignature = () =>
    api.get('/api/cloudinary/signature')

// Profile APIs
export const parseResume = (resumeUrl) =>
    api.post('/api/profile/parse', { resumeUrl })

export const createProfile = (data) =>
    api.post('/api/profile/create', data)

export const updateProfile = (data) =>
    api.put('/api/profile/update', data)

export const updateProfilePhoto = (photoUrl) =>
    api.put('/api/profile/photo', { photoUrl })

export const getMyProfile = () =>
    api.get('/api/profile/me')

export const getPublicProfile = (username) =>
    api.get(`/api/profile/${encodeURIComponent(username)}`)

export default api

