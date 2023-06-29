import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useWalletMigration from '../useWalletMigration';

describe('useWalletMigration', () => {
    test('should return status === eligible', () => {
        const mock = mockStore({
            client: { wallet_migration_status: 'eligible' },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWalletMigration(), { wrapper });

        expect(result.current.status).toBe('eligible');
    });

    test('should return status === failed', () => {
        const mock = mockStore({
            client: { wallet_migration_status: 'failed' },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWalletMigration(), { wrapper });

        expect(result.current.status).toBe('failed');
    });
});
