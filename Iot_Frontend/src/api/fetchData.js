import {getRequest} from "./index.js";

export const fetchData = async (url, setData, setLoading, setError) => {
    try {
        setLoading?.(true);
        const response = await getRequest(url);
        if (response.code === 200) {
            setData(response.info);
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
