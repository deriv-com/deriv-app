import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useDuplicateDOBPhone from '../useDuplicateDOBPhone';

describe('useDuplicateDOBPhone', () => {
    it('should return true if `is_duplicate_dob_phone` is true', () => {
        const mock = mockStore({
            client: {
                is_duplicate_dob_phone: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useDuplicateDOBPhone(), { wrapper });

        expect(result.current).toBe(true);
    });

    it('should return false', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useDuplicateDOBPhone(), { wrapper });

        expect(result.current).toBe(false);
    });
});
