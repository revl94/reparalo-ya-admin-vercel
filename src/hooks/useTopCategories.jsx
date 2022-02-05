import useHttp from './useHttp';
import API_ENDPOINTS from '../constants/api-endpoints';

const useTopCategories = (topValue = 5, manual = false) => {
    const [{ data, error, isLoading }, getTopCategories] = useHttp({
        method: 'GET',
        url: `${ API_ENDPOINTS.TOP_CATEGORIES }`,
        params: { topValue },
    }, { manual });

    return [{ topCategories: data, error, isLoading }, getTopCategories];
};

export default useTopCategories;
