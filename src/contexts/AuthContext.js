import React, { createContext, useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { ACCOUNT_INITIALIZE, LOGIN, LOGOUT } from '../store/actions';
import accountReducer from '../store/account-reducer';
import Loader from '../components/Loader/Loader';
import API_ENDPOINTS from '../constants/api-endpoints';
import http from '../utils/axios';
import getUserIdFromToken from '../utils/get-user-id-from-token';
import token from '../utils/token';

const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null,
};

const setSession = (accessToken) => {
    if (accessToken) {
        token.setToken(accessToken);
    } else {
        token.deleteToken();
    }
};

const AuthContext = createContext({
    ...initialState,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    forgotPassword: () => Promise.resolve(),
    restorePassword: () => Promise.resolve(),
});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);
    const history = useHistory();

    const login = async (username, password) => {
        const response = await http.post(API_ENDPOINTS.LOGIN, { username, password });
        const { access_token: accessToken } = response.data;
        setSession(accessToken);
        dispatch({ type: LOGIN });
    };

    const logout = async () => {
        const adminUserId = jwtDecode((localStorage.getItem('access_token'))).id
        await http.post(`admin-users/${adminUserId}/logout`);
        setSession(null);
        dispatch({ type: LOGOUT });
    };

    const forgotPassword = async (email) => {
        await http.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    };

    const restorePassword = async (password, accessToken) => {
        await http.patch(API_ENDPOINTS.RESTORE_PASSWORD, { password, token: accessToken });
        setSession(null);
        history.push('/');
    };


    useEffect(() => {
        const init = async () => {
            try {
                const accessToken = token.getToken();

                if (accessToken && token.verifyToken(accessToken)) {
                    setSession(accessToken);

                    const response = await http.get(`${ API_ENDPOINTS.ADMIN_USERS }/${ getUserIdFromToken() }`);

                    const { user } = response.data;

                    dispatch({
                        type: ACCOUNT_INITIALIZE,
                        payload: {
                            isLoggedIn: true,
                            user,
                        },
                    });
                } else {
                    dispatch({
                        type: ACCOUNT_INITIALIZE,
                        payload: {
                            isLoggedIn: false,
                            user: null,
                        },
                    });
                }
            } catch (err) {
                dispatch({
                    type: ACCOUNT_INITIALIZE,
                    payload: {
                        isLoggedIn: false,
                        user: null,
                    },
                });
            }
        };

        init();
    }, []);

    if (!state.isInitialized) {
        return <Loader />;
    }

    return <AuthContext.Provider
        value={{ ...state, login, logout, forgotPassword, restorePassword }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
