import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { CashierScrollContext, useCashierScroll } from '../CashierScrollContext';

describe('CashierScrollContext', () => {
    it('provides the correct context value', () => {
        const mockOnCashierScroll = jest.fn();
        const mockSetOnCashierScroll = jest.fn();

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <CashierScrollContext.Provider
                value={{
                    onCashierScroll: mockOnCashierScroll,
                    setOnCashierScroll: mockSetOnCashierScroll,
                }}
            >
                {children}
            </CashierScrollContext.Provider>
        );

        const { result } = renderHook(() => useCashierScroll(), { wrapper });

        expect(result.current.onCashierScroll).toBe(mockOnCashierScroll);
        expect(result.current.setOnCashierScroll).toBe(mockSetOnCashierScroll);
    });

    it('throws an error when used outside of CashierScrollContext.Provider', () => {
        const { result } = renderHook(() => useCashierScroll());

        expect(result.error).toEqual(
            new Error("Seems you didn't wrap your components in <CashierScrollContext.Provider />")
        );
    });

    it('updates context value when setOnCashierScroll is called', () => {
        const mockOnCashierScroll = jest.fn();
        const mockSetOnCashierScroll = jest.fn();

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <CashierScrollContext.Provider
                value={{
                    onCashierScroll: null,
                    setOnCashierScroll: mockSetOnCashierScroll,
                }}
            >
                {children}
            </CashierScrollContext.Provider>
        );

        const { result } = renderHook(() => useCashierScroll(), { wrapper });

        act(() => {
            result.current.setOnCashierScroll(mockOnCashierScroll);
        });

        expect(mockSetOnCashierScroll).toHaveBeenCalledWith(mockOnCashierScroll);
    });
});
