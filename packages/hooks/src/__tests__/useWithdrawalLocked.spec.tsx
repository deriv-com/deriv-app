import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import useWithdrawalLocked from '../useWithdrawalLocked';
import useAccountStatus from '../useAccountStatus';
import useCheck10kLimit from '../useCheck10kLimit';

jest.mock('../useAccountStatus', () => {
    return jest.fn();
});

jest.mock('../useCheck10kLimit', () => {
    return jest.fn();
});

const mock_store = mockStore({
    modules: {
        cashier: {
            error: {
                is_ask_authentication: true,
                is_ask_financial_risk_approval: true,
            },
        },
    },
});

const mockUseAccountStatus = useAccountStatus as jest.MockedFunction<typeof useAccountStatus>;
const mockUseCheck10kLimit = useCheck10kLimit as jest.MockedFunction<typeof useCheck10kLimit>;

const wrapper = ({ children }: { children: JSX.Element }) => {
    return <StoreProvider store={mock_store}>{children}</StoreProvider>;
};

describe('useWithdrawalLocked', () => {
    beforeEach(() => {
        mockUseCheck10kLimit.mockReturnValue({
            is_10k_withdrawal_limit_reached: true,
            max_withdraw_amount: 10,
            isSuccess: true,
        });
    });

    it('should check if withdrawal is locked', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                status: ['age_verification'],
                authentication: {
                    needs_verification: ['identity'],
                },
            },
            statuses: {
                status: {
                    is_withdrawal_locked: false,
                },
            },
            isLoading: false,
            isSuccess: true,
        } as ReturnType<typeof mockUseAccountStatus>);

        const { result } = renderHook(useWithdrawalLocked, { wrapper });

        expect(result.current.is_withdrawal_locked).toBe(true);
    });

    it('should check if withdrawal is not locked', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                authentication: {
                    needs_verification: ['identity'],
                },
            },
            statuses: {
                status: {
                    is_withdrawal_locked: false,
                },
            },
            isLoading: false,
            isSuccess: true,
        } as ReturnType<typeof mockUseAccountStatus>);

        const { result, rerender } = renderHook(useWithdrawalLocked, { wrapper });

        expect(result.current.is_withdrawal_locked).toBe(false);

        mock_store.modules.cashier.error.is_ask_authentication = false;
        mock_store.modules.cashier.error.is_ask_financial_risk_approval = false;

        mockUseAccountStatus.mockReturnValue({
            data: {
                status: ['age_verification'],
                authentication: {
                    needs_verification: ['identity'],
                },
            },
            isLoading: false,
            isSuccess: true,
        } as ReturnType<typeof mockUseAccountStatus>);

        rerender();

        expect(result.current.is_withdrawal_locked).toBe(false);
    });
});
