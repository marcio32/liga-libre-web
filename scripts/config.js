const CONFIG = {
    API_BASE_URL: "https://localhost:7007/api",
    getAuthHeaders: function() {
        const token = localStorage.getItem('authToken');
        return{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    }
};

window.CONFIG = CONFIG;


