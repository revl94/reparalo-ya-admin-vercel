const API_ENDPOINTS = {
    LOGIN: '/admin-authentication/token',
    ADMIN_USERS: '/admin-users',
    FORGOT_PASSWORD: '/admin-users/forgot-password-email',
    RESTORE_PASSWORD: '/admin-users/restore-password',
    SERVICES: '/services',
    DISABLE_ENABLE_SERVICE: 'services/:serviceId/disabled',
    DISABLE_ENABLE_CATEGORY: 'services/:serviceId/categories/:categoryId/disabled',
};

export default API_ENDPOINTS;