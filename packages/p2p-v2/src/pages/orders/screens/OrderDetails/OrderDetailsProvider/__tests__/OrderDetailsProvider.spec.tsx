import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { OrderDetailsProvider, useOrderDetails } from '../OrderDetailsProvider';

describe('useOrderDetails', () => {
    it('should return the orderDetails from context', () => {
        const mockOrderDetails = { orderDetails: 'mockOrderDetails' };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <OrderDetailsProvider orderDetails={mockOrderDetails}>{children}</OrderDetailsProvider>
        );

        const { result } = renderHook(() => useOrderDetails(), { wrapper });

        expect(result.current).toEqual(mockOrderDetails);
    });
});
