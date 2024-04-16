import React, { PropsWithChildren, createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { getAppId, getSocketURL } from '@deriv/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    TSocketEndpointNames,
    TSocketError,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';
import WSClient from './ws-client/ws-client';

type TSubscribeFunction = <T extends TSocketSubscribableEndpointNames>(
    name: T,
    payload?: TSocketRequestPayload<T>
) => Promise<{ id: string; subscription: any }>;



type APIContextData = {
    connection: WebSocket | undefined;
    send: Function,
    subscribe: Function;
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


function generateRandomInteger() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1;
}

const APIContext = createContext<APIContextData | null>(null);

/**
 */
const initializeAPIs = (onWSClose: () => void, onOpen?: () => void): { connection: WebSocket} => {
    const wss_url = getWebSocketURL();

    const connection = new WebSocket(wss_url);
    connection.addEventListener('close', () => {
        onWSClose?.();
    });

    connection.addEventListener('open', () => {
        onOpen?.();
    });

    return {
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
    const connectionRef = useRef<WebSocket>();
    const reactQueryRef = useRef<QueryClient>();
    const wsClientRef = useRef<WSClient>();

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
    if (!connectionRef.current) {
        const { connection }= initializeAPIs(
            () => setReconnect(true),
            () => {
                isOpenRef.current = true;
                if (onConnectedRef.current) {
                    onConnectedRef.current();
                    onConnectedRef.current = undefined;
                }
            }
        );

        connectionRef.current = connection;
    }

    if (!wsClientRef.current) { 
        wsClientRef.current = new WSClient(connectionRef.current);
    }

    useEffect(() => {
        return () => {
            connectionRef?.current?.close(1000, 'Closing connection normally');
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

    
    const send = (name: TSocketEndpointNames, payload: TSocketRequestPayload<TSocketEndpointNames>) => {  
        if (!connectionRef.current) {
            throw new Error('Connection is not available');
        }

        return wsClientRef?.current?.request(name, payload);
    };


    const subscribe = async (name: TSocketEndpointNames, payload: TSocketRequestPayload<TSocketEndpointNames>, onData: Function) => {
        if (!connectionRef.current) {
            throw new Error('Connection is not available');
        }

        return wsClientRef?.current?.subscribe(name, payload, onData);
    };

    useEffect(() => {
        const interval_id: ReturnType<typeof setInterval> = setInterval(
            //@ts-ignore
            () => send('ping', {}),
            10000
        );
        return () => clearInterval(interval_id);
    }, []);

    useEffect(() => {
        let reconnectTimerId: NodeJS.Timeout;
        if (reconnect) {
            const { connection } = initializeAPIs(
                () => {
                    reconnectTimerId = setTimeout(() => setReconnect(true), 500);
                },
                () => {
                    if (onReconnectedRef.current) {
                        onReconnectedRef.current();
                    }
                }
            );
            connectionRef.current = connection;
            setReconnect(false);
        }

        return () => clearTimeout(reconnectTimerId);
    }, [reconnect]);

    return (
        <APIContext.Provider
            value={{
                send,
                subscribe,
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
