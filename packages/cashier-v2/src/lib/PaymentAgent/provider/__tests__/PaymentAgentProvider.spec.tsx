import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { mockPaymentAgents } from './mockPaymentAgents';
import PaymentAgentProvider, { usePaymentAgentContext } from '../PaymentAgentProvider';

jest.mock('../../../../utils', () => ({
    shuffleArray: jest.fn(array => array),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    usePaymentAgentList: jest.fn(() => ({
        data: mockPaymentAgents,
    })),
}));

describe('PaymentAgentProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <PaymentAgentProvider>{children}</PaymentAgentProvider>
    );

    it('should return all payment agent list by default (5 elements)', () => {
        const { result } = renderHook(() => usePaymentAgentContext(), { wrapper });

        expect(result.current.paymentAgentList?.length).toBe(5);
        expect(result.current.paymentAgentList?.length).toBe(mockPaymentAgents.length);
    });

    it('should properly filter payment agent list by selected payment method', () => {
        const { result } = renderHook(() => usePaymentAgentContext(), { wrapper });

        act(() => result.current.onSelectPaymentMethodHandler('Bank wire'));
        expect(result.current.paymentAgentList?.length).toBe(2);

        act(() => result.current.onSelectPaymentMethodHandler('DiamondBank'));
        expect(result.current.paymentAgentList?.length).toBe(1);
    });

    it('should properly filter payment agent list by search term', async () => {
        const { result } = renderHook(() => usePaymentAgentContext(), { wrapper });

        act(() => result.current.onChangeSearchTermHandler('one'));
        await waitFor(() => expect(result.current.paymentAgentList?.length).toBe(3));

        act(() => result.current.onChangeSearchTermHandler('Nimble'));
        await waitFor(() => expect(result.current.paymentAgentList?.length).toBe(1));
    });

    it('should return all payment agent list if there is no search term', async () => {
        const { result } = renderHook(() => usePaymentAgentContext(), { wrapper });

        act(() => result.current.onChangeSearchTermHandler(''));
        await waitFor(() => expect(result.current.paymentAgentList?.length).toBe(5));
    });
});
