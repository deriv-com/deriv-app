import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { APIProvider } from '@deriv/api';
import useIsAccountStatusPresent from '../useIsAccountStatusPresent';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useGetAccountStatus: jest.fn(() => ({
        data: {
            status: ['cashier_locked', 'authenticated'],
        },
        isFetched: true,
    })),
}));

describe('useIsAccountStatusPresent', () => {
    it('should return false when the status is not present', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useIsAccountStatusPresent('address_verified'), { wrapper });

        expect(result.current).toBeFalsy();
    });

    it('should return true when the status is present', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useIsAccountStatusPresent('cashier_locked'), { wrapper });

        expect(result.current).toBeTruthy();
    });
});
