import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';
import token from '../../utils/token';

const AuthGuard = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn && !token.getToken()) {
        return <Redirect to='/login' />;
    }

    return children;
};

AuthGuard.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
        PropTypes.elementType,
    ]).isRequired,
};

export default AuthGuard;
