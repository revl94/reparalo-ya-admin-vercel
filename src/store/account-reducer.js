import { ACCOUNT_INITIALIZE, LOGIN, LOGOUT } from './actions';

const accountReducer = (state, action) => {
    switch (action.type) {
        case ACCOUNT_INITIALIZE: {
            const { isLoggedIn, user } = action.payload;
            return {
                ...state,
                isLoggedIn,
                isInitialized: true,
                user,
            };
        }
        case LOGIN: {
            return {
                ...state,
                isLoggedIn: true,
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
