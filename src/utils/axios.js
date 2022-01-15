import axios from 'axios';
import envConfig from '../config';

const http = axios.create({
    baseURL: envConfig.baseUrl,
    timeout: 30000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token') || '';
        // eslint-disable-next-line no-param-reassign
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${ token || '' }`,
        };
        return config;
    },
    (error) => Promise.reject(error),
);

http.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status || 500;
        if (status === 401) {
            window.location.href = '/login';
        } else {
           throw Error(error);
        }
    },
);

export default http;
