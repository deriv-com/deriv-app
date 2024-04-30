import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useAccountTransferVisible from '../useAccountTransferVisible';

describe('useAccountTransferVisible', () => {
    test('should return false if residence is im', () => {
        const mock = mockStore({
            client: {
                residence: 'im',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useAccountTransferVisible(), { wrapper });

        expect(result.current).toBe(false);
    });
});
