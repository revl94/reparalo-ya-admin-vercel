export default {
    environment: process.env.REACT_APP_ENVIRONMENT,
    locale: process.env.REACT_APP_DEFAULT_LANGUAGE,
    theme: process.env.REACT_APP_THEME,
    rtlLayout: process.env.REACT_APP_RTL_LAYOUT === true,
    baseUrl: process.env.REACT_APP_BASE_URL,
};
