import { TSocketRequestProps, TSocketResponseData, TSocketSubscribableEndpointNames } from '../types';
import { useWS as useWSShared } from '@deriv/shared';
import { useState } from 'react';

const useSubscription = <T extends TSocketSubscribableEndpointNames>(name: T) => {
    const [is_loading, setIsLoading] = useState(false);
    const [is_subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState<unknown>();
    const [data, setData] = useState<TSocketResponseData<T>>();
    const [subscriber, setSubscriber] = useState<{ unsubscribe?: VoidFunction }>();
    const WS = useWSShared();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onData = (response: any) => {
        setData(response[name === 'ticks' ? 'tick' : name]);
        setIsLoading(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onError = (response: any) => {
        setError(response.error);
        setIsLoading(false);
    };

    const subscribe = (...props: TSocketRequestProps<T> extends never ? [undefined?] : [TSocketRequestProps<T>]) => {
        setIsLoading(true);
        setSubscribed(true);

        try {
            setSubscriber(WS.subscribe({ [name]: 1, subscribe: 1, ...(props[0] || {}) }).subscribe(onData, onError));
        } catch (e) {
            setError(e);
        }
    };

    const unsubscribe = () => {
        subscriber?.unsubscribe?.();
        setSubscribed(false);
    };

    return { subscribe, unsubscribe, is_loading, is_subscribed, error, data };
};

export default useSubscription;
