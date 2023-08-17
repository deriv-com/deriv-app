import React from 'react';
import { APIProvider } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useAuthorize from '../useAuthorize';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn((_, options: Record<'payload', Record<'authorize', string>>) => ({
        data: {
            authorize: {
                loginid: options.payload.authorize === '12345' ? 'CRW909900' : 'CRW909901',
                account_list: [
                    {
                        account_category: 'wallet',
                        currency: 'USD',
                        is_virtual: 0,
                    },
                ],
            },
        },
    })),
}));

jest.mock('@deriv/utils', () => ({
    ...jest.requireActual('@deriv/utils'),
    getActiveAuthTokenIDFromLocalStorage: jest.fn(() => '12345'),
}));

describe('useAuthorize', () => {
    test('should return correct data for the given token', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthorize(), { wrapper });

        expect(result.current.data.loginid).toBe('CRW909900');
        expect(result.current.data.loginid).not.toBe('CRW909901');
    });
});
