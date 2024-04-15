import { useCallback, useRef, useState } from 'react';
import type {
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';
import { useAPIContext } from './APIProvider';

const useSubscription = <T extends TSocketSubscribableEndpointNames>(name: T) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<TSocketResponseData<T>>();
    const { subscribe: _subscribe } = useAPIContext();
    const unlistenRef = useRef<Function>();

    const subscribe = useCallback(
        ({ payload }: TSocketRequestPayload) => {
            setIsLoading(true);
            _subscribe(name, payload || {}, (data: TSocketResponseData<T>) => setData(data)).then((subData: any) => {
                setIsLoading(false);
                unlistenRef.current = subData.unlisten;
            });
        }, 
        [_subscribe, name]
    );

    const unsubscribe = useCallback(() => {
        unlistenRef.current?.();
    }, []);
    

    return {
        subscribe,
        unsubscribe,
        isLoading,
        isSubscribed: true, // TODO: fix this? 
        error: false, // TODO: error support?
        data,
    };
};

export default useSubscription;
