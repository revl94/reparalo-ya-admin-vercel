import { useEffect, useState } from 'react';
import http from '../utils/axios';

const useHttp = (
    initialRequestParams = {
        method: 'GET',
        url: '',
        body: {},
        params: {},
    },
    configOptions = { manual: false },
) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (request = null) => {
        setIsLoading(true);
        const { method, url, body, params } = initialRequestParams;

        try {
            let resp;

            if (request?.body || body) {
                resp = await http({
                    method: request?.method || method,
                    url: request?.url || url,
                    data: request?.body || body,
                    params: request?.params || params,
                });
            } else {
                resp = await http({
                    method: request?.method || method,
                    url: request?.url || url,
                    params: request?.params || params,
                });
            }

            setData(resp?.data);
            setError(null);
            setIsLoading(false);

            return resp;
        } catch (e) {
            setError(e);
            setData(null);
            setIsLoading(false);
            throw Error(e);
        }
    };

    useEffect(() => {
        if (!configOptions.manual) {
            fetchData();
        }
    }, []);

    return [{ isLoading, data, error }, fetchData];
};

export default useHttp;
