import React from 'react';
import { useWS } from '@deriv/shared';
import { act, renderHook } from '@testing-library/react-hooks';
import APIProvider from '../APIProvider';
import useActiveWalletBalance from '../hooks/useActiveWalletBalance';

jest.mock('@deriv/shared');

const mockUseWS = useWS as jest.MockedFunction<typeof useWS>;
describe('useActiveWalletBalance', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element,
        renderResult: any,
        onData: (response: unknown) => void;
    beforeEach(() => {
        mockUseWS.mockReturnValue({
            subscribe: jest.fn(() => {
                return {
                    subscribe: async (_onData: (response: unknown) => void) => {
                        onData = _onData;
                        const delay = (ms: number) => new Promise<never>(resolve => setTimeout(resolve, ms));
                        onData({ balance: { balance: 9999.9, currency: 'USD' }, msg_type: 'balance' });
                        await delay(500);
                    },
                };
            }),
        });

        wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        renderResult = renderHook(() => useActiveWalletBalance(), { wrapper });
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
            onData({ balance: { balance: 42.0, currency: 'USD' }, msg_type: 'balance' });
        });

        expect(result.current.displayBalance).toBe('42.00 USD');
        expect(result.current.data.balance.balance).toBe(42.0);
        expect(result.current.data.balance.currency).toBe('USD');
    });

    test('displays correct number of decimal places', async () => {
        const { result } = renderResult;

        act(() => {
            onData({ balance: { balance: 42.4242, currency: 'USD' }, msg_type: 'balance' });
        });

        expect(result.current.displayBalance).toBe('42.42 USD');
        expect(result.current.data.balance.balance).toBe(42.4242);
        expect(result.current.data.balance.currency).toBe('USD');
    });
});
