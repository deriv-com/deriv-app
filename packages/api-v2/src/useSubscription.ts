import { useCallback, useEffect, useRef, useState } from 'react';
import useAPI from './useAPI';
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
        (payloadConstruct: any) => {
            setIsLoading(true);
            _subscribe(name, payloadConstruct.payload, (data: any) => setData(data)).then((subData: any) => {
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

// const useSubscription = <T extends TSocketSubscribableEndpointNames>(name: T, idle_time = 5000) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [isSubscribed, setSubscribed] = useState(false);
//     const [isIdle, setIdle] = useState(false);
//     const [error, setError] = useState<TSocketError<T>>();
//     const [data, setData] = useState<TSocketResponseData<T>>();
//     const subscriber = useRef<{ unsubscribe?: VoidFunction }>();
//     const idle_timeout = useRef<NodeJS.Timeout>();
//     const { subscribe: _subscribe } = useAPI();

//     const subscribe = useCallback(
//         (...props: TSocketAcceptableProps<T>) => {
//             const prop = props?.[0];
//             const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;

//             setIsLoading(true);
//             setSubscribed(true);
//             setIdle(false);

//             idle_timeout.current = setTimeout(() => {
//                 setIdle(true);
//                 setIsLoading(false);
//             }, idle_time);

//             try {
//                 subscriber.current = _subscribe(name, payload).subscribe(
//                     response => {
//                         setData(response);
//                         setIsLoading(false);
//                     },
//                     response => {
//                         setError(response.error);
//                         setIsLoading(false);
//                     }
//                 );
//             } catch (e) {
//                 setError(e as TSocketError<T>);
//             }
//         },
//         [_subscribe, name, idle_time]
//     );

//     const unsubscribe = useCallback(() => {
//         subscriber.current?.unsubscribe?.();
//         setSubscribed(false);
//     }, []);

//     useEffect(() => {
//         return () => {
//             unsubscribe();
//         };
//     }, [unsubscribe]);

//     useEffect(() => {
//         return () => {
//             if (idle_timeout.current) clearTimeout(idle_timeout.current);
//         };
//     }, [data]);

//     return {
//         subscribe,
//         unsubscribe,
//         isIdle,
//         isLoading,
//         isSubscribed,
//         error,
//         data,
//     };
// };

export default useSubscription;
