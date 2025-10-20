import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'http://localhost:8080/user';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, {
                username: username,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data !== "Invalid credentials!") {
                localStorage.setItem('token', response.data);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            return decoded.exp > currentTime;
        } catch (error) {
            return false;
        }
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    getUsername: () => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        return decoded.sub;
    },
};
