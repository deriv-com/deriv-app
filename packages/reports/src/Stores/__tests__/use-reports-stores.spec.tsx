import React from 'react';
import { mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import { useReportsStore } from 'Stores/useReportsStores';
import ReportsProviders from '../../reports-providers';

describe('useReportsStore', () => {
    it('useReportsStore should return the store if it was used inside ReportsProviders', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <ReportsProviders store={mockStore({})}>{children}</ReportsProviders>
        );

        const {
            result: { current },
        } = renderHook(() => useReportsStore(), { wrapper });

        expect(current.profit_table).toBeTruthy();
        expect(current.statement).toBeTruthy();
    });

    it('useReportsStore should throw error if it was used outside of ReportsProviders', () => {
        const { result } = renderHook(() => useReportsStore());

        expect(result.error).toEqual(new Error('useReportsStore must be used within ReportsStoreProvider'));
    });
});
