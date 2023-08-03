import * as React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasMFAccountDeposited from '../useHasMFAccountDeposited';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({ data: { get_account_status: { status: [] } } })),
}));

describe('useHasMFAccountDeposited', () => {
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <APIProvider>
            <StoreProvider store={mockStore({})}>{children}</StoreProvider>
        </APIProvider>
    );

    test('should return false if expected status is not in account_status', () => {
        const { result } = renderHook(() => useHasMFAccountDeposited(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if expected status is in account_status', () => {
        (useFetch as jest.Mock).mockImplementationOnce(() => ({
            data: { get_account_status: { status: ['cashier_locked'] } },
        }));

        const { result } = renderHook(() => useHasMFAccountDeposited(), { wrapper });

        expect(result.current).toBe(true);
    });
});
