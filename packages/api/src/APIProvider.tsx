import React, { PropsWithChildren, useEffect } from 'react';
// @ts-expect-error `@deriv/deriv-api` is not in TypeScript, Hence we ignore the TS error.
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL, useWS } from '@deriv/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import APIContext from './APIContext';

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
    const currentWebsocket = window.WSConnections[wss_url];
    if (currentWebsocket instanceof WebSocket && [2, 3].includes(currentWebsocket.readyState)) {
        clearTimeout(timer_id);
        timer_id = setTimeout(() => {
            initializeDerivWS();
        }, 500);
    }
};

// This is a temporary workaround to share a single `DerivAPIBasic` instance for every unique URL.
// Later once we have each package separated we won't need this anymore and can remove this.
const initializeDerivWS = (): DerivAPIBasic => {
    if (!window.WSConnections) {
        window.WSConnections = {};
    }

    const endpoint = getSocketURL();
    const app_id = getAppId();
    const language = 'EN'; // Need to use the language from the app context.
    const brand = 'deriv';
    const wss_url = `wss://${endpoint}/websockets/v3?app_id=${app_id}&l=${language}&brand=${brand}`;
    window.WSConnections[wss_url] = new WebSocket(wss_url);
    window.WSConnections[wss_url].addEventListener('close', () => handleReconnection(wss_url));

    if (!window.DerivAPI) {
        window.DerivAPI = {};
    }

    if (!window.DerivAPI?.[wss_url]) {
        window.DerivAPI[wss_url] = new DerivAPIBasic({ connection: window.WSConnections[wss_url] });
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
    // Use the new API instance if the `standalone` prop is set to true,
    // else use the legacy socket connection.
    const active_connection = standalone ? initializeDerivWS() : WS;

    useEffect(() => {
        let interval_id: NodeJS.Timer;

        if (standalone) {
            interval_id = setInterval(() => active_connection.send({ ping: 1 }), 10000);
        }

        return () => clearInterval(interval_id);
    }, [active_connection, standalone]);

    return (
        <APIContext.Provider value={active_connection}>
            <QueryClientProvider client={queryClient}>
                {children}
                {/* <ReactQueryDevtools /> */}
            </QueryClientProvider>
        </APIContext.Provider>
    );
};

export default APIProvider;
