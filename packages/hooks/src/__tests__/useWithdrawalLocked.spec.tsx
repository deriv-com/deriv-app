import React from 'react';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import useWithdrawalLocked from '../useWithdrawalLocked';
import { renderHook } from '@testing-library/react-hooks';

const mock_root_store = mockStore({
    modules: {
        cashier: {
            withdraw: {
                error: {
                    is_ask_financial_risk_approval: false,
                },
            },
            error: {
                is_ask_authentication: false,
            },
        },
    },
});

const mock_get_account_status = {
    get_account_status: {
        authentication: {
            document: {
                status: 'none',
            },
            identity: {
                status: 'none',
            },
            needs_verification: [''],
        },
        status: [],
    },
};

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(() => ({
        data: mock_get_account_status,
    })),
}));

jest.mock('../useCheck10kLimit', () => {
    return jest.fn(() => ({
        is_10k_withdrawal_limit_reached: true,
        max_withdraw_amount: 0,
    }));
});

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <StoreProvider store={mock_root_store}>{children}</StoreProvider>
    </APIProvider>
);

describe('useWithdrawalLocked', () => {
    it('should check whether POI is needed', () => {
        const { result } = renderHook(useWithdrawalLocked, { wrapper });

        expect(result.current.is_poi_needed).toBe(true);
    });

    it('should check whether POI is not needed', () => {
        mock_get_account_status.get_account_status.authentication.identity.status = 'verified';

        const { result } = renderHook(useWithdrawalLocked, { wrapper });

        expect(result.current.is_poi_needed).toBe(false);
    });

    it('should check whether POI documents are not submitted', () => {
        mock_get_account_status.get_account_status.authentication.identity.status = 'none';

        const { result } = renderHook(useWithdrawalLocked, { wrapper });

        expect(result.current.has_poi_submitted).toBe(false);
    });

    it('should check whether POI documents are submitted', () => {
        mock_get_account_status.get_account_status.authentication.identity.status = 'pending';

        const { result } = renderHook(useWithdrawalLocked, { wrapper });

        expect(result.current.has_poi_submitted).toBe(true);
    });

    it('should check whether POA is not needed', () => {
        mock_get_account_status.get_account_status.authentication.document.status = 'verified';

        const { result } = renderHook(useWithdrawalLocked, { wrapper });

        expect(result.current.is_poa_needed).toBe(false);
    });

    it('should check whether POA is needed if document is required for authentication', () => {
        mock_get_account_status.get_account_status.authentication.needs_verification = ['document'];

        const { result } = renderHook(useWithdrawalLocked, { wrapper });

        expect(result.current.is_poa_needed).toBe(true);
    });

    it('should check whether POA is needed if document status for authentication is not verified', () => {
        mock_get_account_status.get_account_status.authentication.document.status = 'pending';

        const { result } = renderHook(useWithdrawalLocked, { wrapper });

        expect(result.current.is_poa_needed).toBe(true);
    });

    it('should check whether POA documents are not submitted', () => {
        mock_get_account_status.get_account_status.authentication.document.status = 'none';

        const { result } = renderHook(useWithdrawalLocked, { wrapper });

        expect(result.current.has_poa_submitted).toBe(false);
    });

    it('should check whether POA documents are submitted', () => {
        mock_get_account_status.get_account_status.authentication.document.status = 'pending';

        const { result } = renderHook(useWithdrawalLocked, { wrapper });

        expect(result.current.has_poa_submitted).toBe(true);
    });

    it('should check whether client needs to be asked for financial risk approval', () => {
        mock_root_store.modules.cashier.withdraw.error.is_ask_financial_risk_approval = true;

        const { result } = renderHook(useWithdrawalLocked, { wrapper });

        expect(result.current.is_ask_financial_risk_approval_needed).toBe(true);
    });

    it('should check if withdrawal is locked', () => {
        mock_get_account_status.get_account_status.status = ['withdrawal_locked'];

        const { result: result_1 } = renderHook(useWithdrawalLocked, { wrapper });
        expect(result_1.current.is_withdrawal_locked).toBe(true);

        mock_get_account_status.get_account_status.status = [];
        mock_get_account_status.get_account_status.authentication.needs_verification = ['identity'];
        mock_root_store.modules.cashier.error.is_ask_authentication = true;

        const { result: result_2 } = renderHook(useWithdrawalLocked, { wrapper });
        expect(result_2.current.is_withdrawal_locked).toBe(true);

        mock_get_account_status.get_account_status.authentication.needs_verification = [];
        mock_root_store.modules.cashier.error.is_ask_authentication = false;
        mock_root_store.modules.cashier.withdraw.error.is_ask_financial_risk_approval = true;

        const { result: result_3 } = renderHook(useWithdrawalLocked, { wrapper });
        expect(result_3.current.is_withdrawal_locked).toBe(true);

        mock_root_store.modules.cashier.withdraw.error.is_ask_financial_risk_approval = false;
    });

    it('should check if withdrawal is not locked', () => {
        mock_root_store.modules.cashier.error.is_ask_authentication = true;

        const { result } = renderHook(useWithdrawalLocked, { wrapper });
        expect(result.current.is_withdrawal_locked).toBe(false);
    });
});
