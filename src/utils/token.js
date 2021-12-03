import jwtDecode from 'jwt-decode';

export default {
    getToken: () => localStorage.getItem('access_token'),
    setToken: (accessToken) => localStorage.setItem('access_token', accessToken),
    deleteToken: () => localStorage.removeItem('access_token'),
    verifyToken: (accessToken) => {
        if (!accessToken) {
            return false;
        }

        const decoded = jwtDecode(accessToken);

        return decoded.exp > Date.now() / 1000;
    },
};
