import React, { PropsWithChildren, createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
// @ts-expect-error `@deriv/deriv-api` is not in TypeScript, Hence we ignore the TS error.
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL } from '@deriv/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    TSocketEndpointNames,
    TSocketError,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';
import { hashObject } from './utils';
import lightweightSend from './lightweightApi/lightweightSend';
import aggregatedSubscribe from './lightweightApi/aggregatedSubscribe';

type TSendFunction = <T extends TSocketEndpointNames>(
    name: T,
    payload?: TSocketRequestPayload<T>
) => Promise<TSocketResponseData<T> & TSocketError<T>>;

type TUnsubscribeFunction = (id: string) => void;

type APIContextData = {
    derivAPI: DerivAPIBasic | null;
    connection: WebSocket | undefined;
    send: TSendFunction;
    subscribe: Function;
    unsubscribe: TUnsubscribeFunction;
    queryClient: QueryClient;
    setOnReconnected: (onReconnected: () => void) => void;
    setOnConnected: (onConnected: () => void) => void;
};

/**
 * Retrieves the WebSocket URL based on the current environment.
 * @returns {string} The WebSocket URL.
 */
const getWebSocketURL = () => {
    const endpoint = getSocketURL();
    const app_id = getAppId();
    const language = localStorage.getItem('i18n_language');
    return `wss://${endpoint}/websockets/v3?app_id=${app_id}&l=${language}&brand=deriv`;
};

const APIContext = createContext<APIContextData | null>(null);

/**
 * Initializes a derivAPIRef instance for the global window. This enables a standalone connection
 * without causing race conditions with deriv-app core stores.
 * @returns {derivAPIRefBasic} The initialized derivAPIRef instance.
 */
const initializeDerivAPI = (onWSClose: () => void, onOpen?: () => void): DerivAPIBasic => {
    const wss_url = getWebSocketURL();

    const connection = new WebSocket(wss_url);
    connection.addEventListener('close', () => {
        onWSClose?.();
    });

    connection.addEventListener('open', () => {
        onOpen?.();
    });

    const api = new DerivAPIBasic({ connection });

    return {
        api,
        connection,
    };
};

/**
 * TODO: standlone no longer exists, as its always standalone,
 * but I do not want to remove it from all packages withint this PR, so needs to be cleaned up in subsequent PRs
 */
type TAPIProviderProps = {
    /** If set to true, the APIProvider will instantiate it's own socket connection. */
    standalone?: boolean;
};

const APIProvider = ({ children }: PropsWithChildren<TAPIProviderProps>) => {
    const [reconnect, setReconnect] = useState(false);
    const derivAPIRef = useRef<DerivAPIBasic>();
    const connectionRef = useRef<WebSocket>();
    const subscriptionsRef = useRef<Record<string, DerivAPIBasic['subscribe']>>();
    const reactQueryRef = useRef<QueryClient>();

    // on reconnected ref
    const onReconnectedRef = useRef<() => void>();
    const onConnectedRef = useRef<() => void>();
    const isOpenRef = useRef<boolean>(false);

    if (!reactQueryRef.current) {
        reactQueryRef.current = new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                    refetchOnReconnect: false,
                },
            },
        });
    }

    // have to be here and not inside useEffect as there are places in code expecting this to be available
    if (!derivAPIRef.current) {
        const { api, connection }= initializeDerivAPI(
            () => setReconnect(true),
            () => {
                isOpenRef.current = true;
                if (onConnectedRef.current) {
                    onConnectedRef.current();
                    onConnectedRef.current = undefined;
                }
            }
        );

        derivAPIRef.current = api;
        connectionRef.current = connection;
    }

    useEffect(() => {
        return () => {
            derivAPIRef.current.disconnect();
            reactQueryRef.current?.clear();
        };
    }, []);

    const setOnReconnected = useCallback((onReconnected: () => void) => {
        onReconnectedRef.current = onReconnected;
    }, []);

    const setOnConnected = useCallback((onConnected: () => void) => {
        if (isOpenRef.current) {
            onConnected();
        } else {
            onConnectedRef.current = onConnected;
        }
    }, []);

    //@ts-ignore
    const send: TSendFunction = (name, payload) => {
        //@ts-ignore
        return lightweightSend(connectionRef?.current, name, payload);
        // return derivAPIRef.current?.send({ [name]: 1, ...payload });
    };

    //@ts-ignore
    const subscribe: TSubscribeFunction = async (name: any, payload: any, onData: Function) => {
        if (!connectionRef.current) {
            throw new Error('Connection is not available');
        }

        return aggregatedSubscribe.listen(connectionRef.current, name, payload, onData);
    };

    const unsubscribe: TUnsubscribeFunction = id => {
        const matchingSubscription = subscriptionsRef.current?.[id];
        if (matchingSubscription) matchingSubscription.unsubscribe();
    };

    useEffect(() => {
        const currentDerivAPIRef = derivAPIRef.current;
        const currentSubscriptionsRef = subscriptionsRef.current;

        return () => {
            if (currentSubscriptionsRef) {
                Object.keys(currentSubscriptionsRef).forEach(key => {
                    currentSubscriptionsRef[key].unsubscribe();
                });
            }
            if (currentDerivAPIRef && currentDerivAPIRef.connection.readyState === 1) currentDerivAPIRef.disconnect();
        };
    }, []);

    useEffect(() => {
        const interval_id: ReturnType<typeof setInterval> = setInterval(
            () => derivAPIRef.current?.send({ ping: 1 }),
            10000
        );
        return () => clearInterval(interval_id);
    }, []);

    useEffect(() => {
        let reconnectTimerId: NodeJS.Timeout;
        if (reconnect) {
            const { api, connection } = initializeDerivAPI(
                () => {
                    reconnectTimerId = setTimeout(() => setReconnect(true), 500);
                },
                () => {
                    if (onReconnectedRef.current) {
                        onReconnectedRef.current();
                    }
                }
            );
            derivAPIRef.current = api;
            connectionRef.current = connection;
            setReconnect(false);
        }

        return () => clearTimeout(reconnectTimerId);
    }, [reconnect]);

    return (
        <APIContext.Provider
            value={{
                derivAPI: derivAPIRef.current,
                send,
                subscribe,
                unsubscribe,
                queryClient: reactQueryRef.current,
                setOnReconnected,
                setOnConnected,
                connection: connectionRef.current,
            }}
        >
            <QueryClientProvider client={reactQueryRef.current}>
                {children}
                {/* <ReactQueryDevtools /> */}
            </QueryClientProvider>
        </APIContext.Provider>
    );
};

export const useAPIContext = () => {
    const context = useContext(APIContext);
    if (!context) {
        throw new Error('useAPIContext must be used within APIProvider');
    }
    return context;
};

export default APIProvider;
