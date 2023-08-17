import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useFiatAccountList from '../useFiatAccountList';
import { APIProvider, useFetch } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'authorize' | 'website_status'>>;

describe('useFiatAccountList', () => {
    test('should return an empty list if client has no account', async () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                authorize: {
                    account_list: [
                        {
                            account_category: 'wallet',
                            account_type: 'doughflow',
                            currency: 'USD',
                            is_virtual: 1,
                            loginid: 'CRW909900',
                        },
                    ],
                    loginid: 'CRW909900',
                },
            },
            isLoading: false,
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useFiatAccountList(), { wrapper });

        expect(result.current).toStrictEqual([]);
    });

    test('should return an empty list if client has no fiat account', async () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                authorize: {
                    account_list: [{ currency: 'BTC', is_virtual: 0, loginid: 'CR123' }],
                    loginid: 'CR123',
                },
                website_status: {
                    currencies_config: {
                        AUD: { type: 'fiat', is_crypto: false },
                        BTC: { type: 'crypto', is_crypto: true },
                        ETH: { type: 'crypto', is_crypto: true },
                        UST: { type: 'crypto', is_crypto: true },
                        USD: { type: 'fiat', is_crypto: false },
                        LTC: { type: 'crypto', is_crypto: true },
                    },
                },
            },
            isLoading: false,
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useFiatAccountList(), { wrapper });

        expect(result.current).toStrictEqual([]);
    });

    test('should return list of fiat accounts if client any fiat account', async () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                authorize: {
                    account_list: [
                        { currency: 'BTC', is_virtual: 0, loginid: 'CR123' },
                        { currency: 'USD', is_virtual: 0, loginid: 'CR456' },
                    ],
                    loginid: 'CR123',
                },
                website_status: {
                    currencies_config: {
                        AUD: { type: 'fiat', is_crypto: false },
                        BTC: { type: 'crypto', is_crypto: true },
                        ETH: { type: 'crypto', is_crypto: true },
                        UST: { type: 'crypto', is_crypto: true },
                        USD: { type: 'fiat', is_crypto: false },
                        LTC: { type: 'crypto', is_crypto: true },
                    },
                },
            },
            isLoading: false,
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useFiatAccountList(), { wrapper });

        expect(result.current).toHaveLength(1);
        expect(result.current).toMatchObject([{ currency: 'USD', is_virtual: false, loginid: 'CR456' }]);
    });
    test('should return list of fiat accounts if client has 1 CR fiat and 1 MF fiat account', async () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                authorize: {
                    account_list: [
                        { currency: 'BTC', is_virtual: 0, loginid: 'CR123' },
                        { currency: 'USD', is_virtual: 0, loginid: 'CR456' },
                        { currency: 'USD', is_virtual: 0, loginid: 'MF789' },
                    ],
                    loginid: 'CR123',
                },
                website_status: {
                    currencies_config: {
                        AUD: { type: 'fiat', is_crypto: false },
                        BTC: { type: 'crypto', is_crypto: true },
                        ETH: { type: 'crypto', is_crypto: true },
                        UST: { type: 'crypto', is_crypto: true },
                        USD: { type: 'fiat', is_crypto: false },
                        LTC: { type: 'crypto', is_crypto: true },
                    },
                },
            },
            isLoading: false,
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useFiatAccountList(), { wrapper });

        expect(result.current).toHaveLength(2);
        expect(result.current).toMatchObject([
            { currency: 'USD', is_virtual: false, loginid: 'CR456' },
            { currency: 'USD', is_virtual: false, loginid: 'MF789' },
        ]);
    });
});
