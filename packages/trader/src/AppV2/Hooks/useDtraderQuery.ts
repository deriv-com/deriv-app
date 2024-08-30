import { WS } from '@deriv/shared';
import React, { useState, useEffect, useCallback } from 'react';
import { TServerError } from 'Types';

type QueryResult<T> = {
    data: null | T;
    error: TServerError | null;
    isLoading: boolean;
    refetch: () => void;
};

type QueryOptions = {
    enabled?: boolean;
};

// Cache object to store the results
const cache: Record<string, any> = {};

export const useDtraderQuery = <Response>(
    key: string,
    request: Record<string, any>,
    options: QueryOptions = {}
): QueryResult<Response> => {
    const { enabled = true } = options;
    const [data, setData] = useState<Response | null>(cache[key] || null);
    const [error, setError] = useState<TServerError | null>(null);
    const [isLoading, setIsLoading] = useState(!cache[key] && enabled);

    const fetchData = useCallback(() => {
        setIsLoading(true);
        WS.send(request) // Use the generic type parameter here
            .then((result: Response) => {
                cache[key] = result;
                setData(result);
                setIsLoading(false);
            })
            .catch((err: TServerError) => {
                setError(err);
                setIsLoading(false);
            });
    }, [key, request]);

    useEffect(() => {
        let isSubscribed = true;
        if (enabled && !cache[key] && isSubscribed) {
            fetchData();
        }
        return () => {
            isSubscribed = false;
        };
    }, [key, fetchData, enabled]);

    const refetch = () => {
        if (enabled) {
            cache[key] = null; // Clear the cache for the specific key
            fetchData(); // Re-fetch the data
        }
    };

    return { data, error, isLoading, refetch };
};
