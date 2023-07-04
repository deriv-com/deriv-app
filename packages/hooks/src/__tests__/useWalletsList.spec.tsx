import * as React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useWalletsList from '../useWalletsList';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'authorize'>>;

describe('useWalletsList', () => {
    test('should return wallets list for the current loginid', () => {
        const mock = mockStore({
            client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                authorize: {
                    account_list: [
                        {
                            account_category: 'wallet',
                            currency: 'USD',
                            is_virtual: 0,
                            landing_company_name: 'svg',
                        },
                    ],
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useWalletsList(), { wrapper });

        expect(result.current.data).toEqual([
            {
                account_category: 'wallet',
                currency: 'USD',
                gradient_card_class: 'wallet-card__usd-bg',
                gradient_header_class: 'wallet-header__usd-bg',
                is_added: true,
                is_virtual: 0,
                landing_company_name: 'svg',
                is_demo: false,
                is_selected: false,
                is_malta_wallet: false,
                balance: 0,
            },
        ]);
    });

    test('should return empty array if there is no wallets list', () => {
        const mock = mockStore({
            client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { authorize: { account_list: [] } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useWalletsList(), { wrapper });

        expect(result.current.data).toEqual([]);
    });

    test('should return alphabetically sorted wallet list based on currency', () => {
        const mock = mockStore({
            client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                authorize: {
                    account_list: [
                        {
                            account_category: 'wallet',
                            currency: 'USD',
                            is_virtual: 0,
                        },
                        {
                            account_category: 'wallet',
                            currency: 'UST',
                            is_virtual: 0,
                        },
                        {
                            account_category: 'wallet',
                            currency: 'BTC',
                            is_virtual: 0,
                        },
                        {
                            account_category: 'wallet',
                            currency: 'AUD',
                            is_virtual: 0,
                        },
                    ],
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useWalletsList(), { wrapper });

        expect(result.current.data?.map(wallet => wallet.currency)).toEqual(['AUD', 'BTC', 'USD', 'UST']);
    });

    test('should return sorted wallet list where virtual is the last and crypto is after fiat currency', () => {
        const mock = mockStore({
            client: {
                accounts: { CRW909900: { token: '12345' } },
                loginid: 'CRW909900',
                is_crypto: (currency: string) => ['BTC', 'ETH', 'UST'].includes(currency),
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                authorize: {
                    account_list: [
                        {
                            account_category: 'wallet',
                            currency: 'USD',
                            is_virtual: 0,
                        },
                        {
                            account_category: 'wallet',
                            currency: 'UST',
                            is_virtual: 0,
                        },
                        {
                            account_category: 'wallet',
                            currency: 'BTC',
                            is_virtual: 1,
                        },
                        {
                            account_category: 'wallet',
                            currency: 'AUD',
                            is_virtual: 0,
                        },
                        {
                            account_category: 'wallet',
                            currency: 'ETH',
                            is_virtual: 0,
                        },
                    ],
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useWalletsList(), { wrapper });

        expect(result.current.data?.map(wallet => wallet.currency)).toEqual(['AUD', 'USD', 'ETH', 'UST', 'BTC']);
    });
});
