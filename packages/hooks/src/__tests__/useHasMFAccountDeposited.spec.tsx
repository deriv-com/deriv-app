import * as React from 'react';
import { APIProvider, useQuery } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasMFAccountDeposited from '../useHasMFAccountDeposited';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(() => ({ data: { get_account_status: { status: [] } } })),
}));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery<'get_account_status'>>;
const mock_useQuery_return_value = {
    data: {
        get_account_status: {
            status: ['allow_document_upload'],
        },
    },
};

describe('useHasMFAccountDeposited', () => {
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <APIProvider>
            <StoreProvider store={mockStore({})}>{children}</StoreProvider>
        </APIProvider>
    );

    beforeEach(() => {
        (mockUseQuery as jest.Mock).mockReturnValue(mock_useQuery_return_value);
    });

    test('should return false if expected status is not in account_status', () => {
        const { result } = renderHook(() => useHasMFAccountDeposited(), { wrapper });

        expect(result.current.has_mf_account_deposited).toBe(false);
    });

    test('should return true if withdrawal_locked status is in account_status', () => {
        mock_useQuery_return_value.data.get_account_status.status = ['withdrawal_locked'];
        const { result } = renderHook(() => useHasMFAccountDeposited(), { wrapper });

        expect(result.current.has_mf_account_deposited).toBe(true);
    });

    test('should return true if cashier_locked status is in account_status', () => {
        mock_useQuery_return_value.data.get_account_status.status = ['cashier_locked'];
        const { result } = renderHook(() => useHasMFAccountDeposited(), { wrapper });

        expect(result.current.has_mf_account_deposited).toBe(true);
    });
});
