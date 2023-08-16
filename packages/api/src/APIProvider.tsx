// import React, { PropsWithChildren } from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// const queryClient = new QueryClient();

// const APIProvider = ({ children }: PropsWithChildren<unknown>) => (
//     <QueryClientProvider client={queryClient}>
//         {children}
//         <ReactQueryDevtools />
//     </QueryClientProvider>
// );

// export default APIProvider;

import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function getQueryClientContext(): QueryClient {
    if (!window.ReactQueryClient) {
        window.ReactQueryClient = new QueryClient();
    }

    return window.ReactQueryClient;
}

export const queryClient = getQueryClientContext();

const APIProvider = ({ children }: PropsWithChildren<unknown>) => (
    <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
    </QueryClientProvider>
);

export default APIProvider;
