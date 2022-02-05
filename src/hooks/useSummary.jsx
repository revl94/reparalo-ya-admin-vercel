import useHttp from './useHttp';
import API_ENDPOINTS from '../constants/api-endpoints';

const useSummary = (manual = false) => {
    const [{ data, error, isLoading }, getSummary] = useHttp({
        method: 'GET',
        url: `${ API_ENDPOINTS.SUMMARY }`,
    }, { manual });

    return [{ summary: data, error, isLoading }, getSummary];
};

export default useSummary;
