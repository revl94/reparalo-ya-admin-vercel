import useHttp from './useHttp';
import API_ENDPOINTS from '../constants/api-endpoints';

const useClientsGroupByMonth = (manual = false) => {
    const [{ data, error, isLoading }, getClientsByMonth] = useHttp({
        method: 'GET',
        url: `${ API_ENDPOINTS.CLIENTS_GROUP_BY_MONTH }`,
    }, { manual });

    return [{ clientsByMonth: data, error, isLoading }, getClientsByMonth];
};

export default useClientsGroupByMonth;
