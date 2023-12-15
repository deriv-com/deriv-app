import { cryptoMathRandom } from '@deriv/shared';
import { useState, useEffect, useRef } from 'react';

interface UseApiWithRetryProps {
    timeout?: number;
    maxRetryAttempts?: number;
}

interface UseApiWithRetryResult<T> {
    executeApiCall: (apiCall: () => Promise<T>) => void;
    response: {
        data: T | null;
        error: Error | null;
    };
}

const useApiWithRetry = <T>({
    timeout = 10000,
    maxRetryAttempts = 3,
}: UseApiWithRetryProps): UseApiWithRetryResult<T> => {
    const [responseData, setResponseData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [retryAttempts, setRetryAttempts] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const retryAttemptsRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = async (apiCall: () => Promise<T>) => {
        try {
            const response = await apiCall();
            setResponseData(response);
        } catch (err) {
            setError(err);
        }
    };

    const retryApiCall = async (apiCall: () => Promise<T>) => {
        const apiCallPromise = fetchData(apiCall);
        const result = await Promise.race([apiCallPromise, timeoutPromise(timeout)]);
        if (result instanceof Error) {
            if (retryAttempts < maxRetryAttempts - 1) {
                // Retry the API call with exponential backoff
                const delay = Math.pow(2, retryAttempts) + cryptoMathRandom() * 1000; // Exponential backoff in seconds
                setRetryAttempts(previousValue => previousValue + 1);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryApiCall(apiCall);
            } else {
                // eslint-disable-next-line no-console
                console.error(`Maximum retry attempts (${maxRetryAttempts}) reached.`);
            }
        }
    };

    const timeoutPromise = (duration: number) =>
        new Promise<Error>(
            (_, reject) => (timeoutRef.current = setTimeout(() => reject(new Error('Timeout')), duration))
        );

    const clearTimeouts = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (retryAttemptsRef.current) {
            clearTimeout(retryAttemptsRef.current);
            retryAttemptsRef.current = null;
        }
    };

    const executeApiCall = (apiCall: () => Promise<T>) => {
        clearTimeouts();
        retryApiCall(apiCall); // Initial API call with retry logic
    };

    useEffect(() => {
        // This effect remains the same since it doesn't depend on the specific apiCall
        return () => {
            clearTimeouts();
        };
    }, []);

    return {
        executeApiCall,
        response: {
            data: responseData,
            error,
        },
    };
};

export default useApiWithRetry;

// const useApiWithRetry = <T>() => {
//     const retryApiCall = async (apiCall: () => Promise<T>) => {
//         return apiCall();
//     };

//     const executeApiCall = (apiCall: () => Promise<T>) => {
//         retryApiCall(apiCall); // Initial API call with retry logic
//     };

//     return { executeApiCall };
// };

// export default useApiWithRetry;
