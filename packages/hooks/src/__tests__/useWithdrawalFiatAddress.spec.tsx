import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import useWithdrawalFiatAddress from '../useWithdrawalFiatAddress';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(() => ({ data: { cashier: 'https://example.com' }, mutate: jest.fn })),
}));

const mock = mockStore({
    client: {
        verification_code: {
            payment_withdraw: 'abcd1234',
        },
    },
    ui: {
        is_dark_mode_on: true,
    },
});

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <StoreProvider store={mock}>{children}</StoreProvider>
    </APIProvider>
);

describe('useWithdrawalFiatAddress', () => {
    it('should get the iframe url when cashier API is called', () => {
        const { result } = renderHook(() => useWithdrawalFiatAddress(), { wrapper });

        result.current.resend();

        expect(result.current.data).toMatch('https://example.com');
    });

    it('should get the iframe url for dark mode', () => {
        mock.ui.is_dark_mode_on = true;

        const { result } = renderHook(() => useWithdrawalFiatAddress(), { wrapper });

        result.current.resend();

        expect(result.current.data).toBe('https://example.com&DarkMode=on');
    });

    it('should get the iframe url for light mode', () => {
        mock.ui.is_dark_mode_on = false;

        const { result } = renderHook(() => useWithdrawalFiatAddress(), { wrapper });

        result.current.resend();

        expect(result.current.data).toBe('https://example.com&DarkMode=off');
    });
});
