import * as React from 'react';
import { APIProvider, useFetch, useRequest } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useP2PAdvertiserPaymentMethods from '../useP2PAdvertiserPaymentMethods';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
    useRequest: jest.fn(() => ({ mutate: jest.fn() })),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'p2p_advertiser_payment_methods'>>;
const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'p2p_advertiser_payment_methods'>>;

describe('useP2PAdvertiserPaymentMethods', () => {
    test('should return undefined when p2p_advertiser_payment_methods is not available', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {},
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>{' '}
            </APIProvider>
        );

        const { result } = renderHook(() => useP2PAdvertiserPaymentMethods(), { wrapper });

        expect(result.current.data).toBeUndefined();
    });

    test('should return the expected data when p2p_advertiser_payment_methods is available', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                p2p_advertiser_payment_methods: {
                    1: {
                        display_name: 'Skrill',
                        fields: {
                            account: {
                                display_name: 'Email or phone number',
                                required: 1,
                                type: 'text',
                                value: '1234567890',
                            },
                            instructions: {
                                display_name: 'Instructions',
                                required: 0,
                                type: 'memo',
                                value: '',
                            },
                        },
                        is_enabled: 1,
                        method: 'skrill',
                        type: 'ewallet',
                        used_by_adverts: ['67'],
                        used_by_orders: ['49', '53'],
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>{' '}
            </APIProvider>
        );

        const { result } = renderHook(() => useP2PAdvertiserPaymentMethods(), { wrapper });

        expect(result.current.data?.[0]).toHaveProperty('display_name', 'Skrill');
        expect(result.current.data?.[0]).toHaveProperty('fields');
        expect(result.current.data?.[0]).toHaveProperty('is_enabled', 1);
        expect(result.current.data?.[0]).toHaveProperty('type', 'ewallet');
        expect(result.current.data?.[0]).toHaveProperty('icon', 'IcCashierEwallet');
        expect(result.current.data?.[0]).toHaveProperty('id', '1');
    });

    test('should create a new p2p_advertiser_payment_methods', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({ mutate: jest.fn() });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>{' '}
            </APIProvider>
        );

        const { result } = renderHook(() => useP2PAdvertiserPaymentMethods(), { wrapper });

        result.current.create({
            account: '1231',
            instructions: '',
            method: 'skrill',
        });

        expect(mockUseRequest('p2p_advertiser_payment_methods').mutate).toBeCalledWith({
            payload: {
                create: [
                    {
                        account: '1231',
                        instructions: '',
                        method: 'skrill',
                    },
                ],
            },
        });
    });

    test('should update a p2p_advertiser_payment_methods', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                p2p_advertiser_payment_methods: {
                    1: {
                        display_name: 'Skrill',
                        fields: {
                            account: {
                                display_name: 'Email or phone number',
                                required: 1,
                                type: 'text',
                                value: '1234567890',
                            },
                            instructions: {
                                display_name: 'Instructions',
                                required: 0,
                                type: 'memo',
                                value: '',
                            },
                        },
                        is_enabled: 1,
                        method: 'skrill',
                        type: 'ewallet',
                        used_by_adverts: ['67'],
                        used_by_orders: ['49', '53'],
                    },
                },
            },
        });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({ mutate: jest.fn() });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>{' '}
            </APIProvider>
        );

        const { result } = renderHook(() => useP2PAdvertiserPaymentMethods(), { wrapper });

        result.current.update('1', {
            account: '1231',
            instructions: '',
            method: 'skrill',
        });

        expect(mockUseRequest('p2p_advertiser_payment_methods').mutate).toBeCalledWith({
            payload: {
                update: {
                    1: {
                        account: '1231',
                        instructions: '',
                        method: 'skrill',
                    },
                },
            },
        });
    });

    test('should delete a p2p_advertiser_payment_methods', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                p2p_advertiser_payment_methods: {
                    1: {
                        display_name: 'Skrill',
                        fields: {
                            account: {
                                display_name: 'Email or phone number',
                                required: 1,
                                type: 'text',
                                value: '1234567890',
                            },
                            instructions: {
                                display_name: 'Instructions',
                                required: 0,
                                type: 'memo',
                                value: '',
                            },
                        },
                        is_enabled: 1,
                        method: 'skrill',
                        type: 'ewallet',
                        used_by_adverts: ['67'],
                        used_by_orders: ['49', '53'],
                    },
                },
            },
        });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({ mutate: jest.fn() });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>{' '}
            </APIProvider>
        );

        const { result } = renderHook(() => useP2PAdvertiserPaymentMethods(), { wrapper });

        result.current.delete(1);

        expect(mockUseRequest('p2p_advertiser_payment_methods').mutate).toBeCalledWith({
            payload: {
                delete: [1],
            },
        });
    });
});
