import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useStoreWalletAccountsList from '../useStoreWalletAccountsList';

describe('useStoreWalletAccountsList', () => {
    const default_mock = mockStore({
        client: {
            accounts: {
                CRW909900: { account_category: 'wallet', currency: 'USD', is_virtual: 1 },
                CRW909901: { account_category: 'wallet', currency: 'UST', is_virtual: 0 },
                CRW909902: { account_category: 'wallet', currency: 'BTC', is_virtual: 0 },
                CRW909903: { account_category: 'wallet', currency: 'AUD', is_virtual: 0 },
                CRW909904: { account_category: 'wallet', currency: 'ETH', is_virtual: 0 },
            },
            loginid: 'CRW909900',
        },
    });

    const wrapper = (mock: ReturnType<typeof mockStore>) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    test('should return wallets list for the current loginid', () => {
        const { result } = renderHook(() => useStoreWalletAccountsList(), { wrapper: wrapper(default_mock) });

        expect(result.current.data?.every(wallet => wallet.account_category === 'wallet')).toEqual(true);
    });

    test('should return has_wallet equals to true if the client has at least one wallet', () => {
        const { result } = renderHook(() => useStoreWalletAccountsList(), { wrapper: wrapper(default_mock) });

        expect(result.current.has_wallet).toEqual(true);
    });

    test("should return has_wallet equals to false if the client doesn't have any wallet", () => {
        const mock = mockStore({
            client: {
                accounts: { CR123456: { account_category: 'trading', currency: 'USD', is_virtual: 0 } },
                loginid: 'CR123456',
            },
        });

        const { result } = renderHook(() => useStoreWalletAccountsList(), { wrapper: wrapper(mock) });

        expect(result.current.has_wallet).toEqual(false);
    });
});
