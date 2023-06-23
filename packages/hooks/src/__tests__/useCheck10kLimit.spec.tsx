import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useCheck10kLimit from '../useCheck10kLimit';
import { APIProvider, useRequest } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';

const mock_store = mockStore({
    client: {
        currency: 'USD',
    },
});

let mock_remainder: string;

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(() => ({ data: { get_limits: { remainder: mock_remainder } } })),
}));

describe('useCheck10kLimit', () => {
    it('should return true if max withdrawal value is reached', () => {
        mock_remainder = '0';

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useCheck10kLimit(), { wrapper });

        expect(result.current.is_10k_withdrawal_limit_reached).toBe(true);
    });

    it('should return false if max withdrawal value is not reached', () => {
        mock_remainder = '10000';

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useCheck10kLimit(), { wrapper });

        expect(result.current.is_10k_withdrawal_limit_reached).toBe(false);
    });
});
