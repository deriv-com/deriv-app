import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const APIProvider = ({ children }: PropsWithChildren<unknown>) => (
    <QueryClientProvider client={queryClient}>
        {children}
        {/*Temporary disabled due to the problem on codecov, You can uncomment to use in development environment, DO NOT COMMIT THIS UNCOMMENTED*/}
        {/*<ReactQueryDevtools />*/}
    </QueryClientProvider>
);

export default APIProvider;
