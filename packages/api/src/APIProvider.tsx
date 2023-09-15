import React, { PropsWithChildren } from 'react';
import { useWS } from '@deriv/shared';
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
    const WS = useWS();

    return (
        <APIContext.Provider value={{ deriv_api: WS, is_standalone: standalone }}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools />
            </QueryClientProvider>
        </APIContext.Provider>
    );
};

export default APIProvider;
