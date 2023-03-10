import React, { PropsWithChildren } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { WS } from '@deriv/shared';
import { TSocketEndpointNames, TSocketAcceptableProps, TSocketResponseData } from '../types';

const send = async <T extends TSocketEndpointNames>(
    name: T,
    ...props: TSocketAcceptableProps<T>
): Promise<TSocketResponseData<T>> => {
    const response = await WS.send({ [name]: 1, ...(props[0] || {}) });

    if (response.error) {
        throw response.error;
    }

    return response[name];
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
        },
    },
});

export const APIProvider = ({ children }: PropsWithChildren<unknown>) => (
    <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
    </QueryClientProvider>
);

const useAPI = <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T>) => {
    return useQuery<TSocketResponseData<T>, unknown>([name], () => send(name, ...props));
};

export default useAPI;
