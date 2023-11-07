import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useCFDAllAccounts from '../useCFDAllAccounts';

describe('useCFDAllAccounts', () => {
    test('should return empty array when client has no CFD accounts', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCFDAllAccounts(), { wrapper });

        expect(result.current).toHaveLength(0);
    });

    test('should return proper data when client has MT5 accounts', async () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'real',
                        balance: 1000,
                        currency: 'USD',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCFDAllAccounts(), { wrapper });

        expect(result.current).toHaveLength(1);
    });

    test('should return proper data when client has dxtrade accounts', async () => {
        const mock = mockStore({
            client: {
                dxtrade_accounts_list: [
                    {
                        account_type: 'real',
                        balance: 1000,
                        currency: 'USD',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCFDAllAccounts(), { wrapper });

        expect(result.current).toHaveLength(1);
    });

    test('should return proper data when client has ctrader accounts', async () => {
        const mock = mockStore({
            client: {
                ctrader_accounts_list: [
                    {
                        account_type: 'real',
                        balance: 1000,
                        currency: 'USD',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCFDAllAccounts(), { wrapper });

        expect(result.current).toHaveLength(1);
    });

    test('should return proper data when client has MT5, ctrader and dxtrade accounts', async () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'real',
                        balance: 1000,
                        currency: 'USD',
                    },
                ],
                ctrader_accounts_list: [
                    {
                        account_type: 'real',
                        balance: 1000,
                        currency: 'USD',
                    },
                ],
                dxtrade_accounts_list: [
                    {
                        account_type: 'real',
                        balance: 1000,
                        currency: 'USD',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCFDAllAccounts(), { wrapper });

        expect(result.current).toHaveLength(3);
    });
});
