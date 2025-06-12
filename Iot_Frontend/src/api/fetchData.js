import {getRequest} from "./index.js";

export const fetchData = async (url, setData, setLoading, setError, setPagination, params=null) => {
    try {
        setLoading?.(true);
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        const fullUrl = `${url}${query}`;

        const response = await getRequest(fullUrl);
        if (response.code === 200) {
            setData(response.info);
            if (response.pagination && typeof setPagination === 'function') {
                setPagination?.(response.pagination);
            }
        } else {
            console.error(response.message);
            setError?.(response.message);
        }
    } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Unknown error';
        console.error('Error fetching data:', msg);
        setError?.(msg);
    } finally {
        setLoading?.(false);
    }
};
