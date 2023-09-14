import React, { PropsWithChildren, useEffect, useRef } from 'react';
// @ts-expect-error `@deriv/deriv-api` is not in TypeScript, Hence we ignore the TS error.
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL } from '@deriv/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import APIContext from './APIContext';

declare global {
    interface Window {
        ReactQueryClient: QueryClient;
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

const queryClient = getSharedQueryClientContext();

type TProps = {
    /** If set to true, the APIProvider will instantiate it's own socket connection. */
    standalone?: boolean;
};

const APIProvider = ({ children, standalone = false }: PropsWithChildren<TProps>) => {
    const endpoint = getSocketURL();
    const app_id = getAppId();
    const language = 'EN';
    const brand = 'deriv';
    const wss = `wss://${endpoint}/websockets/v3?app_id=${app_id}&l=${language}&brand=${brand}`;
    const websocket = useRef<WebSocket>(new WebSocket(wss));
    // There is no TypeScript definition for `DerivAPIBasic` hence we ignore the TS error.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deriv_api = useRef<any>(new DerivAPIBasic({ connection: websocket.current }));

    useEffect(() => {
        const socket = websocket.current;
        const api = deriv_api.current;

        // Disconnect the connection when this component unmounts.
        return () => {
            socket?.close();
            api?.disconnect();
        };
    }, []);

    return (
        <APIContext.Provider value={{ deriv_api: deriv_api.current, is_standalone: standalone }}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools />
            </QueryClientProvider>
        </APIContext.Provider>
    );
};

export default APIProvider;
