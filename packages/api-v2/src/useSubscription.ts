import { useCallback, useEffect, useRef, useState } from 'react';
import type {
    TSocketAcceptableProps,
    TSocketError,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';
import { useAPIContext } from './APIProvider';

const useSubscription = <T extends TSocketSubscribableEndpointNames>(name: T, idle_time = 5000) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<TSocketResponseData<T>>();
    const { connection, send, subscribe: _subscribe } = useAPIContext();
    const unlistenRef = useRef<Function>();

    const subscribe = useCallback(
        (payloadConstruct?: any) => {
            setIsLoading(true);
            _subscribe(name, payloadConstruct?.payload || {}, (data: any) => setData(data)).then((subData: any) => {
                console.log('>> useSubscription, subription successfull: ', subData);
                setIsLoading(false);
                unlistenRef.current = subData.unlisten;
            });
        }, 
        [_subscribe, name]
    );

    const unsubscribe = useCallback(() => {
        console.log('>> useSubscription: unsubscribe: ', name, unlistenRef.current);
        unlistenRef.current?.();
    }, []);
    

    return {
        subscribe,
        unsubscribe,
        isLoading,
        // isSubscribed,
        // error,
        data,
    };
};

export default useSubscription;
