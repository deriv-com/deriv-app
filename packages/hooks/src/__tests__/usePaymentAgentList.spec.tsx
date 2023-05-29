import * as React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import usePaymentAgentList from '../usePaymentAgentList';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'paymentagent_list'>>;

describe('usePaymentAgentList', () => {
    test('should return undefined if there is no response', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>
                <APIProvider>{children}</APIProvider>
            </StoreProvider>
        );

        const { result } = renderHook(() => usePaymentAgentList(), { wrapper });

        expect(result.current.data).toBe(undefined);
    });

    test('should return an empty list if there is no data in the response', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { list: [] } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>
                <APIProvider>{children}</APIProvider>
            </StoreProvider>
        );

        const { result } = renderHook(() => usePaymentAgentList(), { wrapper });

        expect(result.current.data?.length).toBe(0);
    });

    test('should return the list of payment agents from response', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { list: ['PAYMENT AGENT 1', 'PAYMENT AGENT 2'] } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>
                <APIProvider>{children}</APIProvider>
            </StoreProvider>
        );

        const { result } = renderHook(() => usePaymentAgentList(), { wrapper });

        expect(result.current.data?.length).toBe(2);
    });
});
