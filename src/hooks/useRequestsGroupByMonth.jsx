import useHttp from './useHttp';
import API_ENDPOINTS from '../constants/api-endpoints';
import SERVICE_REQUEST_STATUS from '../constants/service-request-status';

const useRequestsGroupByMonth = (status = SERVICE_REQUEST_STATUS[0], manual = false) => {
    const [{ data, error, isLoading }, getRequestsByMonth] = useHttp({
        method: 'GET',
        url: `${ API_ENDPOINTS.REQUESTS_GROUP_BY_MONTH }`,
        params: { status },
    }, { manual });

    return [{ requestsByMonth: data, error, isLoading }, getRequestsByMonth];
};

export default useRequestsGroupByMonth;
