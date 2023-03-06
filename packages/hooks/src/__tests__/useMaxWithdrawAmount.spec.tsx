import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useMaxWithdrawAmount from '../useMaxWithdrawAmount';

describe('useMaxWithdrawAmount', () => {
    test('should return the remainder', async () => {
        const mockRootStore = mockStore({
            client: {
                getLimits: () => {
                    return {
                        get_limits: {
                            remainder: 1000,
                        },
                    };
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useMaxWithdrawAmount(), { wrapper });

        expect(result.current).toBe(1000);
    });
});
