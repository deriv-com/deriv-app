import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useWalletsList from '../useWalletsList';

describe('useWalletsList', () => {
    test('should return array with length = 0', async () => {
        const mock = mockStore({
            client: {
                accounts: {
                    VR1234: {
                        account_category: 'trading',
                        is_virtual: 1,
                    },
                    VR123467: {
                        account_category: 'trading',
                        is_virtual: 0,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWalletsList(), { wrapper });

        expect(result.current.length).toBe(0);
    });

    test('should return array with length = 1', async () => {
        const mock = mockStore({
            client: {
                accounts: {
                    VR1234: {
                        account_category: 'wallet',
                        is_virtual: 0,
                    },
                    VR123467: {
                        account_category: 'trading',
                        is_virtual: 0,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWalletsList(), { wrapper });

        expect(result.current.length).toBe(1);
    });
});
