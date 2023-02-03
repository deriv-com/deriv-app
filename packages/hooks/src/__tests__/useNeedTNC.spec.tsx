import * as React from 'react';
import { StoreProvider } from '@deriv/stores';
import type { TStores } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useNeedTNC from '../useNeedTNC';

describe('useNeedTNC', () => {
    test('should be false if is_tnc_needed and is_eu are false and does not have an real STP account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_tnc_needed: false,
                is_eu: false,
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedTNC(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be false if is_tnc_needed is false but is_eu is true and does not have an real STP account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_tnc_needed: false,
                is_eu: true,
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedTNC(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be false if is_tnc_needed and is_eu are false but has an real STP account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_tnc_needed: false,
                is_eu: true,
                mt5_login_list: [
                    {
                        account_type: 'real',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedTNC(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if is_tnc_needed is true and is_eu is false but has an real STP account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_tnc_needed: true,
                is_eu: false,
                mt5_login_list: [
                    {
                        account_type: 'real',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedTNC(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should be true if is_tnc_needed and is_eu are true and does not have an real STP account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_tnc_needed: true,
                is_eu: true,
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedTNC(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should be true if is_tnc_needed and is_eu are true and has an real STP account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_tnc_needed: true,
                is_eu: true,
                mt5_login_list: [
                    {
                        account_type: 'real',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedTNC(), { wrapper });

        expect(result.current).toBe(true);
    });
});
