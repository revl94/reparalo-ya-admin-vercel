import { useEffect, useState } from 'react';
import http from '../utils/axios';

const useHttp = (method, url, body = {}, manual = false) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async (request = null) => {
        setIsLoading(true);
        try {
            let resp;

            if (request?.body || body) {
                resp = await http({
                    method: request?.method || method,
                    url: request?.url || url,
                    data: request?.body || body,
                });
            } else {
                resp = await http({
                    method: request?.method || method,
                    url: request?.url || url,
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
        if (!manual) {
            fetchData();
        }
    }, []);

    return [{ isLoading, data, error }, fetchData];
};

export default useHttp;
