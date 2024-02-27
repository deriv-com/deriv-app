import * as React from 'react';
import { useFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useP2PPaymentMethods from '../useP2PPaymentMethods';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'p2p_payment_methods'>>;

describe('useP2PPaymentMethods', () => {
    test('should return undefined when p2p_payment_methods is not available', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {},
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useP2PPaymentMethods(), { wrapper });

        expect(result.current.data).toBeUndefined();
    });

    test('should return bank_transfer p2p payment methods with expected data', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                p2p_payment_methods: {
                    bank_transfer: {
                        display_name: 'Bank Transfer',
                        fields: {
                            account: {
                                display_name: 'Account Number',
                                required: 1,
                                type: 'text',
                            },
                            bank_code: {
                                display_name: 'SWIFT or IFSC code',
                                required: 0,
                                type: 'text',
                            },
                            bank_name: {
                                display_name: 'Bank Name',
                                required: 1,
                                type: 'text',
                            },
                            branch: {
                                display_name: 'Branch',
                                required: 0,
                                type: 'text',
                            },
                            instructions: {
                                display_name: 'Instructions',
                                required: 0,
                                type: 'memo',
                            },
                        },
                        type: 'bank',
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useP2PPaymentMethods(), { wrapper });

        expect(result.current.data?.[0]).toHaveProperty('display_name', 'Bank Transfer');
        expect(result.current.data?.[0]).toHaveProperty('fields');
        expect(result.current.data?.[0]).toHaveProperty('type', 'bank');
        expect(result.current.data?.[0]).toHaveProperty('icon', 'IcCashierBankTransfer');
    });

    test('should return alipay (ewallet) p2p payment methods with expected data', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                p2p_payment_methods: {
                    alipay: {
                        display_name: 'Alipay',
                        fields: {
                            account: {
                                display_name: 'Alipay ID',
                                required: 1,
                                type: 'text',
                            },
                            instructions: {
                                display_name: 'Instructions',
                                required: 0,
                                type: 'memo',
                            },
                        },
                        type: 'ewallet',
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useP2PPaymentMethods(), { wrapper });

        expect(result.current.data?.[0]).toHaveProperty('display_name', 'Alipay');
        expect(result.current.data?.[0]).toHaveProperty('fields');
        expect(result.current.data?.[0]).toHaveProperty('type', 'ewallet');
        expect(result.current.data?.[0]).toHaveProperty('icon', 'IcCashierEwallet');
    });

    test('should return other p2p payment methods with expected data', () => {
        const mock = mockStore({});

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                p2p_payment_methods: {
                    other: {
                        display_name: 'Other',
                        fields: {
                            account: {
                                display_name: 'Account ID / phone number / email',
                                required: 0,
                                type: 'text',
                            },
                            instructions: {
                                display_name: 'Instructions',
                                required: 0,
                                type: 'memo',
                            },
                            name: {
                                display_name: 'Payment method name',
                                required: 1,
                                type: 'text',
                            },
                        },
                        type: 'other',
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useP2PPaymentMethods(), { wrapper });

        expect(result.current.data?.[0]).toHaveProperty('display_name', 'Other');
        expect(result.current.data?.[0]).toHaveProperty('fields');
        expect(result.current.data?.[0]).toHaveProperty('type', 'other');
        expect(result.current.data?.[0]).toHaveProperty('icon', 'IcCashierOther');
    });
});
