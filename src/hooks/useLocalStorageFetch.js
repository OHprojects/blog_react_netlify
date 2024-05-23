import { useState, useEffect } from "react";

const useLocalStorageFetch = (localStorageKey) => {
    const [data, setData] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = () => {
            setIsLoading(true);
            try {
                const localStorageData = JSON.parse(localStorage.getItem(localStorageKey)) || [];
                if (isMounted) {
                    setData(localStorageData);
                    setFetchError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setFetchError(err.message);
                    setData([]);
                }
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [localStorageKey]);

    return { data, fetchError, isLoading };
}

export default useLocalStorageFetch;
