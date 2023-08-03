import * as React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasMFAccountDeposited from '../useHasMFAccountDeposited';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({ data: { get_account_status: { status: [] } } })),
}));

const mock = mockStore({
    client: {
        is_authorize: true,
    },
});

describe('useHasMFAccountDeposited', () => {
    test('should return false if expected status is not in account_status', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useHasMFAccountDeposited(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if expected status is in account_status', () => {
        (useFetch as jest.Mock).mockImplementationOnce(() => ({
            data: { get_account_status: { status: ['cashier_locked'] } },
        }));
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useHasMFAccountDeposited(), { wrapper });

        expect(result.current).toBe(true);
    });
});
