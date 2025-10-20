import axios from 'axios';

const publicApi = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const taskService = {
    getTasks: async (page = 0, query = '') => {
        try {
            const response = await publicApi.get('/task', {
                params: {
                    page,
                    size: 20,
                    search: query || undefined
                }
            });
            return {
                tasks: response.data,
                totalPages: Math.ceil(response.data.length / 20),
                currentPage: page
            };
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    submitSolution: async (taskTitle, solution) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Brak autoryzacji');
        }

        try {
            const response = await publicApi.post(
                `/task/${encodeURIComponent(taskTitle)}/answer`,
                solution,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'text/plain'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
