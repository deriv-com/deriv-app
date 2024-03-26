import React, { PropsWithChildren, createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
// @ts-expect-error `@deriv/deriv-api` is not in TypeScript, Hence we ignore the TS error.
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL, useWS } from '@deriv/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    TSocketEndpointNames,
    TSocketError,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';
import { hashObject } from './utils';

type TSendFunction = <T extends TSocketEndpointNames>(
    name: T,
    payload?: TSocketRequestPayload<T>
) => Promise<TSocketResponseData<T> & TSocketError<T>>;

type TSubscribeFunction = <T extends TSocketSubscribableEndpointNames>(
    name: T,
    payload?: TSocketRequestPayload<T>
) => Promise<{ id: string; subscription: DerivAPIBasic['subscribe'] }>;

type TUnsubscribeFunction = (id: string) => void;

type APIContextData = {
    derivAPI: DerivAPIBasic | null;
    send: TSendFunction;
    subscribe: TSubscribeFunction;
    unsubscribe: TUnsubscribeFunction;
    queryClient: QueryClient;
    setOnReconnected: (onReconnected: () => void) => void;
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
const connections: Record<string, WebSocket> = {};

/**
 * Retrieves or initializes a WebSocket instance based on the provided URL.
 * @param {string} wss_url - The WebSocket URL.
 * @returns {WebSocket} The WebSocket instance associated with the provided URL.
 */
const getWebsocketInstance = (wss_url: string, onWSClose: () => void, onOpen?: () => void) => {
    const existingWebsocketInstance = connections[wss_url];
    if (
        !existingWebsocketInstance ||
        !(existingWebsocketInstance instanceof WebSocket) ||
        [2, 3].includes(existingWebsocketInstance.readyState)
    ) {
        connections[wss_url] = new WebSocket(wss_url);
        connections[wss_url].addEventListener('close', () => {
            if (typeof onWSClose === 'function') onWSClose();
        });

        connections[wss_url].addEventListener('open', () => {
            if (typeof onOpen === 'function') onOpen();
        });
    }

    return connections[wss_url];
};

/**
 * Initializes a derivAPIRef instance for the global window. This enables a standalone connection
 * without causing race conditions with deriv-app core stores.
 * @returns {derivAPIRefBasic} The initialized derivAPIRef instance.
 */
const initializeDerivAPI = (onWSClose: () => void, onOpen?: () => void): DerivAPIBasic => {
    const wss_url = getWebSocketURL();
    const websocketConnection = getWebsocketInstance(wss_url, onWSClose, onOpen);

    const result = new DerivAPIBasic({ connection: websocketConnection });

    return result;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    },
});

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
    const subscriptionsRef = useRef<Record<string, DerivAPIBasic['subscribe']>>();

    // on reconnected ref
    const onReconnectedRef = useRef<() => void>();

    useEffect(() => {
        return () => {
            // use object.keys to iterate
            const urls = Object.keys(connections);
            for (let i = 0; i < urls.length; i++) {
                connections[urls[i]].close();
            }
        };
    }, []);

    if (!derivAPIRef.current) {
        derivAPIRef.current = initializeDerivAPI(() => setReconnect(true));
    }

    const setOnReconnected = useCallback((onReconnected: () => void) => {
        onReconnectedRef.current = onReconnected;
    }, []);

    const send: TSendFunction = (name, payload) => {
        return derivAPIRef.current?.send({ [name]: 1, ...payload });
    };

    const subscribe: TSubscribeFunction = async (name, payload) => {
        const id = await hashObject({ name, payload });
        const matchingSubscription = subscriptionsRef.current?.[id];
        if (matchingSubscription) return { id, subscription: matchingSubscription };

        const { payload: _payload } = payload ?? {};

        const subscription = derivAPIRef.current?.subscribe({
            [name]: 1,
            subscribe: 1,
            ...(_payload ?? {}),
        });

        subscriptionsRef.current = { ...(subscriptionsRef.current ?? {}), ...{ [id]: subscription } };
        return { id, subscription };
    };

    const unsubscribe: TUnsubscribeFunction = id => {
        const matchingSubscription = subscriptionsRef.current?.[id];
        if (matchingSubscription) matchingSubscription.unsubscribe();
    };

    useEffect(() => {
        const currentderivAPIRef = derivAPIRef.current;
        const currentsubscriptionsRef = subscriptionsRef.current;

        return () => {
            if (currentsubscriptionsRef) {
                Object.keys(currentsubscriptionsRef).forEach(key => {
                    currentsubscriptionsRef[key].unsubscribe();
                });
            }
            if (currentderivAPIRef && currentderivAPIRef.connection.readyState === 1) currentderivAPIRef.disconnect();
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
            derivAPIRef.current = initializeDerivAPI(
                () => {
                    reconnectTimerId = setTimeout(() => setReconnect(true), 500);
                },
                () => {
                    if (onReconnectedRef.current) {
                        onReconnectedRef.current();
                    }
                }
            );
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
                queryClient,
                setOnReconnected,
            }}
        >
            <QueryClientProvider client={queryClient}>
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
