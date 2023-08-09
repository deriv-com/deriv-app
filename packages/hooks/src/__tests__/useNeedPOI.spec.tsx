import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useNeedPOI from '../useNeedPOI';

describe('useNeedPOI', () => {
    test('should be true if authentication?.needs_verification includes identity', async () => {
        const mockRootStore = mockStore({
            client: {
                account_status: {
                    authentication: {
                        needs_verification: ['identity'],
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedPOI(), { wrapper });

        expect(result.current).toBe(true);
    });

    test("should be false if authentication?.needs_verification doesn't include identity", async () => {
        const mockRootStore = mockStore({
            client: {
                account_status: {
                    authentication: {
                        needs_verification: [],
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedPOI(), { wrapper });

        expect(result.current).toBe(false);
    });
});
