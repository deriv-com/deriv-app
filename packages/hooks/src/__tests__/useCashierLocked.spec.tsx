import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useCashierLocked from '../useCashierLocked';
import { APIProvider, useFetch } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'get_account_status'>>;

describe('useCashierLocked', () => {
    test('should be false if there is no cashier_locked status', () => {
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    status: [''],
                },
            },
        } as unknown as ReturnType<typeof mockUseFetch>);

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useCashierLocked(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if there is cashier_locked status', () => {
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    status: ['cashier_locked'],
                },
            },
        } as unknown as ReturnType<typeof mockUseFetch>);

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useCashierLocked(), { wrapper });

        expect(result.current).toBe(true);
    });
});
