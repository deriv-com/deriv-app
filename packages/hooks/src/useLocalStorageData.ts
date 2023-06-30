import React from 'react';

const getInitialData = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

/**
 * This hook will sync up any localStorage data into a generic typed reactive state.
 * @param key LocalStorage key
 * @returns [get, set, clear]
 */
const useLocalStorageData = <T>(
    key: string,
    default_data: T
): [T, React.Dispatch<React.SetStateAction<T>>, VoidFunction] => {
    const [data, setData] = React.useState<T>(getInitialData(key) || default_data);

    React.useEffect(() => {
        if (data) {
            localStorage.setItem(key, JSON.stringify(data));
        }
    }, [key, data]);

    const clearData = () => {
        localStorage.removeItem(key);
        setData(default_data);
    };

    return [data, setData, clearData];
};

export default useLocalStorageData;
