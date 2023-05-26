import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useGroupedFiatTransactions from '../useGroupedFiatTransactions';

describe('useGroupedFiatTransactions', () => {
    test('should return empty array when client has no fiat transactions', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useGroupedFiatTransactions(), { wrapper });

        expect(result.current).toBe({});
    });
});
