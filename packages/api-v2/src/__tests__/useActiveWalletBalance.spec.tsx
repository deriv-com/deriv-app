import React from 'react';
import { useWS } from '@deriv/shared';
import { act, renderHook } from '@testing-library/react-hooks';
import APIProvider from '../APIProvider';
import AuthProvider from '../AuthProvider';
import useActiveWalletBalance from '../hooks/useActiveWalletBalance';

let onDataReveal: (response: unknown) => void;

jest.mock('./../useAPI', () => ({
    __esModule: true,
    default() {
        return {
            subscribe() {
                return {
                    subscribe: async (onData: (response: unknown) => void, onError: (response: unknown) => void) => {
                        onDataReveal = onData;
                    },
                };
            },
        };
    },
}));

describe('useActiveWalletBalance', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, renderResult: any;

    beforeEach(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );

        renderResult = renderHook(() => useActiveWalletBalance(), { wrapper });

        act(() => {
            onDataReveal({ balance: { balance: 9999.9, currency: 'USD' }, msg_type: 'balance' });
        });
    });

    test('returns correct displayBalance', async () => {
        const { result } = renderResult;

        expect(result.current.displayBalance).toBe('9,999.90 USD');
        expect(result.current.data.balance.balance).toBe(9999.9);
        expect(result.current.data.balance.currency).toBe('USD');
    });

    test('updates the display balance with data update', async () => {
        const { result } = renderResult;
        act(() => {
            onDataReveal({ balance: { balance: 42.0, currency: 'USD' }, msg_type: 'balance' });
        });

        expect(result.current.displayBalance).toBe('42.00 USD');
        expect(result.current.data.balance.balance).toBe(42.0);
        expect(result.current.data.balance.currency).toBe('USD');
    });

    test('displays correct number of decimal places', async () => {
        const { result } = renderResult;

        act(() => {
            onDataReveal({ balance: { balance: 42.4242, currency: 'USD' }, msg_type: 'balance' });
        });

        expect(result.current.displayBalance).toBe('42.42 USD');
        expect(result.current.data.balance.balance).toBe(42.4242);
        expect(result.current.data.balance.currency).toBe('USD');
    });
});
