import React from 'react';
import { getLocalStorage } from '@deriv/utils';

/**
 * Hook that manages a localStorage value as a React state.
 * @template T - The generic type of the localStorage value.
 * @param {string} key - The localStorage key.
 * @param {T} [fallback_value] - Optional fallback value if the key does not exist or has no value.
 * @returns - An array containing the current value, a function to update the value, and a function to clear the value.
 */
const useLocalStorageData = <T>(
    key: string,
    fallback_value?: T
): [T | null, React.Dispatch<React.SetStateAction<T | null>>, VoidFunction] => {
    const [data, setData] = React.useState<T | null>(getLocalStorage(key) ?? fallback_value ?? null);

    React.useEffect(() => {
        localStorage.setItem(key, JSON.stringify(data));
    }, [key, data]);

    const clearData = () => {
        localStorage.removeItem(key);
        setData(fallback_value ?? null);
    };

    return [data, setData, clearData];
};

export default useLocalStorageData;
