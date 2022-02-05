import useHttp from './useHttp';
import API_ENDPOINTS from '../constants/api-endpoints';

const useRequestsPerStatus = (manual = false) => {
    const [{ data, error, isLoading }, getRequestsPerStatus] = useHttp({
        method: 'GET',
        url: `${ API_ENDPOINTS.REQUESTS_PER_STATUS }`,
    }, { manual });

    return [{ requestsPerStatus: data, error, isLoading }, getRequestsPerStatus];
};

export default useRequestsPerStatus;
