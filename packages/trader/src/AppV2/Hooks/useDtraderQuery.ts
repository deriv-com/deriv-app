import { WS } from '@deriv/shared';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TServerError } from 'Types';

type QueryResult<T> = {
    data: null | T;
    error: TServerError | null;
    is_loading: boolean;
    refetch: () => void;
};

type QueryOptionsBase = {
    wait_for_authorize?: boolean;
    enabled?: boolean;
};

type QueryOptions = QueryOptionsBase & {
    refresh_on_account_switch?: boolean;
};

// Cache object to store the results
const cache: Record<string, any> = {};

const useDtraderQueryBase = <Response>(
    key: string,
    request: Record<string, any>,
    options: QueryOptionsBase = {}
): QueryResult<Response> => {
    const { enabled = true } = options;
    const [data, setData] = useState<Response | null>(cache[key] || null);
    const [error, setError] = useState<TServerError | null>(null);
    const [is_loading, setIsLoading] = useState(!cache[key] && enabled);

    const { wait_for_authorize = true } = options;

    const fetchData = useCallback(() => {
        setIsLoading(true);
        const sendPromise = wait_for_authorize ? WS.authorized.send(request) : WS.send(request);
        sendPromise
            .then((result: Response) => {
                cache[key] = result;
                setData(result);
                setIsLoading(false);
            })
            .catch((err: TServerError) => {
                setError(err);
                setIsLoading(false);
            });
    }, [key, wait_for_authorize, request]);

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
            cache[key] = null;
            fetchData();
        }
    };

    return { data, error, is_loading, refetch };
};

export const useDtraderQuery = <Response>(
    key: string,
    request: Record<string, any>,
    options: QueryOptions = {}
): QueryResult<Response> => {
    return useDtraderQueryBase<Response>(key, request, options);
};

export const invalidateDTraderCache = (key: string) => {
    cache[key] = null;
};
