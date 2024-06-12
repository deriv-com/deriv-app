import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import useTradeTypeFilter from '../useTradeTypeFilter';

describe('useTradeTypeFilter', () => {
    const wrapper = ({ children }: { children: JSX.Element }) => {
        return <ModulesProvider store={mockStore({})}>{children}</ModulesProvider>;
    };

    it('should return the correct initial values if isClosedTab === true', () => {
        const { result } = renderHook(() => useTradeTypeFilter({ isClosedTab: true }), { wrapper });
        const { contractTypeFilter, setContractTypeFilter } = result.current;

        expect(contractTypeFilter).toEqual([]);
        expect(setContractTypeFilter).toBeDefined();
    });

    it('should return the correct initial values if isClosedTab === false', () => {
        const { result } = renderHook(() => useTradeTypeFilter({}), { wrapper });
        const { contractTypeFilter, setContractTypeFilter } = result.current;

        expect(contractTypeFilter).toEqual([]);
        expect(setContractTypeFilter).toBeDefined();
    });
});
