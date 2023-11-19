import React, { PropsWithChildren, createContext, useContext, useEffect, useRef } from 'react';
// @ts-expect-error `@deriv/deriv-api` is not in TypeScript, Hence we ignore the TS error.
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL, useWS } from '@deriv/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Don't need to type `deriv_api` here, We will be using these methods inside
// the `useQuery`, `useMutation` and `useSubscription` hook to make it type-safe.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const APIContext = createContext<Record<string, any> | null>(null);

declare global {
    interface Window {
        ReactQueryClient?: QueryClient;
        DerivAPI?: Record<string, DerivAPIBasic>;
        WSConnections?: Record<string, WebSocket>;
    }
}

// This is a temporary workaround to share a single `QueryClient` instance between all the packages.
// Later once we have each package separated we won't need this anymore and can remove this.
const getSharedQueryClientContext = (): QueryClient => {
    if (!window.ReactQueryClient) {
        window.ReactQueryClient = new QueryClient();
    }

    return window.ReactQueryClient;
};

let timer_id: NodeJS.Timer;
/**
 * Handles reconnection logic by reinitializing the WebSocket instance if it is in
 * closing or closed state.
 * @param wss_url WebSocket URL
 * @returns
 */
const handleReconnection = (wss_url: string) => {
    if (!window.WSConnections) return;
    const existingWebsocketInstance = window.WSConnections[wss_url];
    if (
        !existingWebsocketInstance ||
        !(existingWebsocketInstance instanceof WebSocket) ||
        [2, 3].includes(existingWebsocketInstance.readyState)
    ) {
        clearTimeout(timer_id);
        timer_id = setTimeout(() => {
            initializeDerivAPI();
        }, 1000);
    }
};

const getWebsocketInstance = (wss_url: string) => {
    if (!window.WSConnections) {
        window.WSConnections = {};
    }

    const existingWebsocketInstance = window.WSConnections[wss_url];
    if (
        !existingWebsocketInstance ||
        !(existingWebsocketInstance instanceof WebSocket) ||
        [2, 3].includes(existingWebsocketInstance.readyState)
    ) {
        window.WSConnections[wss_url] = new WebSocket(wss_url);
        window.WSConnections[wss_url].addEventListener('close', () => handleReconnection(wss_url));
    }

    return window.WSConnections[wss_url];
};

/**
 * Initializes a DerivAPI instance for the global window. This enables a standalone connection
 * without causing race conditions with deriv-app core stores.
 * @returns {DerivAPIBasic} The initialized DerivAPI instance.
 */
const initializeDerivAPI = (): DerivAPIBasic => {
    if (!window.DerivAPI) {
        window.DerivAPI = {};
    }

    const endpoint = getSocketURL();
    const app_id = getAppId();
    const language = localStorage.getItem('i18n_language');
    const brand = 'deriv';
    const wss_url = `wss://${endpoint}/websockets/v3?app_id=${app_id}&l=${language}&brand=${brand}`;
    const websocketConnection = getWebsocketInstance(wss_url);

    if (!window.DerivAPI?.[wss_url]) {
        window.DerivAPI[wss_url] = new DerivAPIBasic({ connection: websocketConnection });
    }

    return window.DerivAPI?.[wss_url];
};

const queryClient = getSharedQueryClientContext();

type TAPIProviderProps = {
    /** If set to true, the APIProvider will instantiate it's own socket connection. */
    standalone?: boolean;
};

const APIProvider = ({ children, standalone = false }: PropsWithChildren<TAPIProviderProps>) => {
    const WS = useWS();
    const standaloneDerivAPI = useRef(standalone ? initializeDerivAPI() : null);

    useEffect(() => {
        let interval_id: NodeJS.Timer;

        if (standalone) {
            interval_id = setInterval(() => standaloneDerivAPI.current?.send({ ping: 1 }), 10000);
        }

        return () => clearInterval(interval_id);
    }, [standalone]);

    return (
        <APIContext.Provider value={{ derivAPI: standalone ? standaloneDerivAPI.current : WS }}>
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
