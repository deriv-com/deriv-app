import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import useTimeFilter from '../useTimeFilter';

describe('useTimeFilter', () => {
    const wrapper = ({ children }: { children: JSX.Element }) => {
        return <ModulesProvider store={mockStore({})}>{children}</ModulesProvider>;
    };

    it('should return the correct initial values', () => {
        const { result } = renderHook(() => useTimeFilter(), { wrapper });
        expect(result.current.customTimeRangeFilter).toEqual('');
        expect(result.current.timeFilter).toEqual('');
        expect(result.current.setCustomTimeRangeFilter).toBeDefined();
        expect(result.current.setTimeFilter).toBeDefined();
    });
});
