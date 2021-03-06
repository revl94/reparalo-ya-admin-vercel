const API_ENDPOINTS = {
    LOGIN: '/admin-authentication/token',
    ADMIN_USERS: '/admin-users',
    FORGOT_PASSWORD: '/admin-users/forgot-password-email',
    RESTORE_PASSWORD: '/admin-users/restore-password',
    SERVICES: '/services',
    DISABLE_ENABLE_SERVICE: 'services/:serviceId/disabled',
    DISABLE_ENABLE_CATEGORY: 'services/:serviceId/categories/:categoryId/disabled',
    SERVICE_REQUESTS: '/service-requests',
    CATEGORIES_DISCOUNTS: '/categories-discounts',
    USERS: '/users',
    SUMMARY: '/statistics/summary',
    REQUESTS_PER_STATUS: '/statistics/requests-per-status',
    REQUESTS_GROUP_BY_MONTH: '/statistics/request-by-month',
    CLIENTS_GROUP_BY_MONTH: '/statistics/clients-by-month',
    TOP_CATEGORIES: '/statistics/top-categories',
};

export default API_ENDPOINTS;
