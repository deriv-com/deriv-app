import React from 'react';

const getInitialData = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

/**
 * This hook will sync up any localStorage data into a react state.
 * @param key LocalStorage key
 * @returns
 */
const useLocalStorageData = <T>(key: string) => {
    const [data, setData] = React.useState<T | null>(getInitialData(key));

    React.useEffect(() => {
        if (data) {
            localStorage.setItem(key, JSON.stringify(data));
        }
    }, [key, data]);

    const clear = () => {
        localStorage.removeItem(key);
        setData(null);
    };

    return { data, setData, clear };
};

export default useLocalStorageData;
