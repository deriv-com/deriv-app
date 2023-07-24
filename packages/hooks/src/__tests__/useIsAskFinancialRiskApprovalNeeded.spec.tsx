import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import useIsWithdrawalLimitReached from '../useIsWithdrawalLimitReached';
import useIsAskFinancialRiskApprovalNeeded from '../useIsAskFinancialRiskApprovalNeeded';

jest.mock('../useIsWithdrawalLimitReached', () => {
    return jest.fn();
});

const mock_store = mockStore({
    modules: {
        cashier: {
            error: {
                is_ask_financial_risk_approval: true,
            },
        },
    },
});

const wrapper = ({ children }: { children: JSX.Element }) => {
    return <StoreProvider store={mock_store}>{children}</StoreProvider>;
};

const mockUseIsWithdrawalLimitReached = useIsWithdrawalLimitReached as jest.MockedFunction<
    typeof useIsWithdrawalLimitReached
>;

describe('useIsAskFinancialRiskApprovalNeeded', () => {
    it('should check that client needs to be asked for financial risk approval', () => {
        mockUseIsWithdrawalLimitReached.mockReturnValue({
            is_10k_withdrawal_limit_reached: true,
            max_withdraw_amount: 10,
            isSuccess: true,
        });

        const { result } = renderHook(useIsAskFinancialRiskApprovalNeeded, { wrapper });

        expect(result.current.is_ask_financial_risk_approval_needed).toBe(true);
    });

    it('should check that client not to be asked for financial risk approval', () => {
        mockUseIsWithdrawalLimitReached.mockReturnValue({
            is_10k_withdrawal_limit_reached: false,
            max_withdraw_amount: 10,
            isSuccess: true,
        });

        const { result, rerender } = renderHook(useIsAskFinancialRiskApprovalNeeded, { wrapper });

        expect(result.current.is_ask_financial_risk_approval_needed).toBe(false);

        mock_store.modules.cashier.error.is_ask_financial_risk_approval = false;

        mockUseIsWithdrawalLimitReached.mockReturnValue({
            is_10k_withdrawal_limit_reached: true,
            max_withdraw_amount: 10,
            isSuccess: true,
        });

        rerender();
        expect(result.current.is_ask_financial_risk_approval_needed).toBe(false);
    });
});
