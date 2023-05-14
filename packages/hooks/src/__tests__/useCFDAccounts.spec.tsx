import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useCFDAccounts from '../useCFDAccounts';

describe('useCFDAccounts', () => {
    test('should return empty array when client has no CFD accounts', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCFDAccounts(), { wrapper });

        expect(result.current.all).toHaveLength(0);
        expect(result.current.demo).toHaveLength(0);
        expect(result.current.real).toHaveLength(0);
    });

    test('should return proper data when client only has CFD demo accounts', async () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        balance: 1000,
                        currency: 'USD',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCFDAccounts(), { wrapper });

        expect(result.current.all).toHaveLength(1);
        expect(result.current.demo).toHaveLength(1);
        expect(result.current.real).toHaveLength(0);
    });

    test('should return proper data when client only has CFD real accounts', async () => {
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
        const { result } = renderHook(() => useCFDAccounts(), { wrapper });

        expect(result.current.all).toHaveLength(1);
        expect(result.current.demo).toHaveLength(0);
        expect(result.current.real).toHaveLength(1);
    });

    test('should return proper data when client only has both CFD real and demo accounts', async () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'real',
                        balance: 1000,
                        currency: 'USD',
                    },
                ],
                dxtrade_accounts_list: [
                    {
                        account_type: 'demo',
                        balance: 1000,
                        currency: 'USD',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCFDAccounts(), { wrapper });

        expect(result.current.all).toHaveLength(2);
        expect(result.current.demo).toHaveLength(1);
        expect(result.current.real).toHaveLength(1);
    });
});
