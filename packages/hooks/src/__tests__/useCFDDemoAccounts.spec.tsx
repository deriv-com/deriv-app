import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useCFDDemoAccounts from '../useCFDDemoAccounts';

describe('useCFDDemoAccounts', () => {
    test('should return empty array when user has no CFD accounts', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCFDDemoAccounts(), { wrapper });

        expect(result.current?.length).toBe(0);
    });

    test('should return empty array when user has no CFD demo accounts', async () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'real',
                    },
                ],
                dxtrade_accounts_list: [
                    {
                        account_type: 'real',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCFDDemoAccounts(), { wrapper });

        expect(result.current?.length).toBe(0);
    });

    test('should return proper data when user has CFD demo accounts', async () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                    },
                ],
                dxtrade_accounts_list: [
                    {
                        account_type: 'real',
                    },
                    {
                        account_type: 'demo',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCFDDemoAccounts(), { wrapper });

        expect(result.current?.length).toBe(2);
    });
});
