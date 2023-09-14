import { useCallback, useEffect, useRef, useState } from 'react';
import useAPI from './useAPI';
import type {
    TSocketAcceptableProps,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';

const useSubscription = <T extends TSocketSubscribableEndpointNames>(name: T) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setSubscribed] = useState(false);
    const [error, setError] = useState<unknown>();
    const [data, setData] = useState<TSocketResponseData<T>>();
    const subscriber = useRef<{ unsubscribe?: VoidFunction }>();
    const { subscribe: _subscribe } = useAPI();

    const subscribe = useCallback(
        (...props: TSocketAcceptableProps<T>) => {
            const prop = props?.[0];
            const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;

            setIsLoading(true);
            setSubscribed(true);

            try {
                subscriber.current = _subscribe(name, payload).subscribe(
                    response => {
                        setData(response);
                        setIsLoading(false);
                    },
                    response => {
                        setError(response.error);
                        setIsLoading(false);
                    }
                );
            } catch (e) {
                setError(e);
            }
        },
        [_subscribe, name]
    );

    const unsubscribe = useCallback(() => {
        subscriber.current?.unsubscribe?.();
        setSubscribed(false);
    }, []);

    useEffect(() => {
        return () => {
            unsubscribe();
        };
    }, [unsubscribe]);

    return {
        subscribe,
        unsubscribe,
        isLoading,
        isSubscribed,
        error,
        data,
    };
};

export default useSubscription;
