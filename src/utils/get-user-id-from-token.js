import jwtDecode from 'jwt-decode';
import token from './token';

const getUserIdFromToken = () => {
    const decodedToken = jwtDecode(token.getToken());
    return decodedToken.id || null;
};

export default getUserIdFromToken;
