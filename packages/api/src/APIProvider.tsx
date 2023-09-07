import React, { PropsWithChildren, useEffect, useRef } from 'react';
// @ts-expect-error `@deriv/deriv-api` is not in TypeScript, Hence we ignore the TS error.
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
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
    const deriv_api = useRef(new DerivAPIBasic({ endpoint: 'qa29.deriv.dev', app_id: 9999, lang: 'ES' }));

    useEffect(() => {
        const api = deriv_api.current;
        // Disconnect the connection when this component unmounts.
        return () => api.disconnect();
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
