import * as React from 'react';
import { StoreProvider } from '@deriv/stores';
import type { TStores } from '@deriv/stores';
import { ContentFlag } from '@deriv/shared';
import { renderHook } from '@testing-library/react-hooks';
import useNeedAuthentication from '../useNeedAuthentication';

describe('useNeedAuthentication', () => {
    test('should be false if is_authentication_needed and is_eu both are false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_authentication_needed: false,
            },
            traders_hub: {
                content_flag: ContentFlag.CR_DEMO,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedAuthentication(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be false if is_authentication_needed is false and is_eu is true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_authentication_needed: false,
            },
            traders_hub: {
                content_flag: ContentFlag.LOW_RISK_CR_EU,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedAuthentication(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be false if is_authentication_needed is true and is_eu is false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_authentication_needed: true,
            },
            traders_hub: {
                content_flag: ContentFlag.CR_DEMO,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedAuthentication(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if is_authentication_needed and is_eu both are true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_authentication_needed: true,
            },
            traders_hub: {
                content_flag: ContentFlag.LOW_RISK_CR_EU,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedAuthentication(), { wrapper });

        expect(result.current).toBe(true);
    });
});
