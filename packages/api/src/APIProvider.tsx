import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

let ReactQueryDevtools = () => null;

if (process.env.NODE_ENV === 'development') {
    //eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    ReactQueryDevtools = require('@tanstack/react-query-devtools').ReactQueryDevtools;
}

const queryClient = new QueryClient();

const APIProvider = ({ children }: PropsWithChildren<unknown>) => (
    <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
    </QueryClientProvider>
);

export default APIProvider;
