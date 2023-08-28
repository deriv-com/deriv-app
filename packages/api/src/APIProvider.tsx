import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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

const APIProvider = ({ children }: PropsWithChildren<unknown>) => (
    <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
    </QueryClientProvider>
);

export default APIProvider;
