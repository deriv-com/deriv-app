import { useCallback, useEffect, useRef, useState } from 'react';
import { useWS } from '@deriv/shared';
import type {
    TSocketAcceptableProps,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';

const useSubscription = <T extends TSocketSubscribableEndpointNames>(name: T) => {
    const [is_loading, setIsLoading] = useState(false);
    const [is_subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState<unknown>();
    const [data, setData] = useState<TSocketResponseData<T>>();
    const subscriber = useRef<{ unsubscribe?: VoidFunction }>();
    const WS = useWS();

    const subscribe = useCallback(
        (...props: TSocketAcceptableProps<T>) => {
            const prop = props?.[0];
            const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;

            setIsLoading(true);
            setSubscribed(true);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const onData = (response: any) => {
                setData(response);
                setIsLoading(false);
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const onError = (response: any) => {
                setError(response.error);
                setIsLoading(false);
            };

            try {
                subscriber.current = WS.subscribe({ [name]: 1, subscribe: 1, ...(payload || {}) }).subscribe(
                    onData,
                    onError
                );
            } catch (e) {
                setError(e);
            }
        },
        [WS, name]
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

    return { subscribe, unsubscribe, is_loading, is_subscribed, error, data };
};

export default useSubscription;
