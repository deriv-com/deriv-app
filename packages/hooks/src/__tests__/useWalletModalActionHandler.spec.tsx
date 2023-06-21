import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useWalletModalActionHandler from '../useWalletModalActionHandler';

jest.mock('../useActiveWallet', () => ({
    __esModule: true,
    default: () => ({
        active_wallet: 'CRW000000',
    }),
}));

describe('useWalletModalActionHandler', () => {
    test('should return handleAction with Deposit action', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWalletModalActionHandler(), { wrapper });

        result.current.handleAction('Deposit');

        expect(mock.traders_hub.setWalletModalActiveTabIndex).toHaveBeenCalledWith(0);
    });

    test('should return handleAction with Withdraw action', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWalletModalActionHandler(), { wrapper });

        result.current.handleAction('Withdraw');

        expect(mock.traders_hub.setWalletModalActiveTabIndex).toHaveBeenCalledWith(1);
    });

    test('should return handleAction with Transfer action', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWalletModalActionHandler(), { wrapper });

        result.current.handleAction('Transfer');

        expect(mock.traders_hub.setWalletModalActiveTabIndex).toHaveBeenCalledWith(2);
    });

    test('should return handleAction with Transaction action', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWalletModalActionHandler(), { wrapper });

        result.current.handleAction('Transactions');

        expect(mock.traders_hub.setWalletModalActiveTabIndex).toHaveBeenCalledWith(3);
    });
});
