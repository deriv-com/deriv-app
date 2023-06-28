import React from 'react';
import { Router } from 'react-router';
import { BrowserHistory, createBrowserHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';
import { routes } from '@deriv/shared';
import WithdrawalLocked from '../withdrawal-locked';
import CashierProviders from '../../../../cashier-providers';
import { mockStore } from '@deriv/stores';
import { GetAccountStatus } from '@deriv/api-types';

type TStatus = Pick<Required<GetAccountStatus>['authentication'], 'identity' | 'document' | 'needs_verification'>;

jest.mock('Components/cashier-locked', () => jest.fn(() => 'CashierLocked'));

const fireButtonEvent = (button: 'proof_of_identity_btn' | 'proof_of_address_btn' | 'financial_assessment_btn') => {
    const [proof_of_identity_btn, proof_of_address_btn, financial_assessment_btn] = screen.getAllByTestId(
        'dt_checklist_item_status_action'
    );
    switch (button) {
        case 'proof_of_identity_btn': {
            fireEvent.click(proof_of_identity_btn);
            break;
        }
        case 'proof_of_address_btn': {
            fireEvent.click(proof_of_address_btn);
            break;
        }
        case 'financial_assessment_btn': {
            fireEvent.click(financial_assessment_btn);
            break;
        }
        default: {
            break;
        }
    }
};

const setAccountStatus = (
    identity_status: Required<TStatus>['identity']['status'],
    document_status: Required<TStatus>['document']['status'],
    needs_verification: Required<TStatus>['needs_verification'][0]
) => {
    return {
        authentication: {
            identity: {
                status: identity_status,
            },
            document: {
                status: document_status,
            },
            needs_verification: [needs_verification],
        },
    };
};

describe('WithdrawalLocked', () => {
    let history: BrowserHistory, mockRootStore: ReturnType<typeof mockStore>;
    beforeEach(() => {
        history = createBrowserHistory();
        mockRootStore = mockStore({
            client: {
                account_status: setAccountStatus('pending', 'none', ''),
            },
            modules: {
                cashier: {
                    withdraw: {
                        is_10k_withdrawal_limit_reached: true,
                        error: {
                            is_ask_financial_risk_approval: false,
                        },
                    },
                },
            },
        });
    });

    const renderWithdrawalLocked = () => {
        return render(
            <CashierProviders store={mockRootStore}>
                <Router history={history}>
                    <WithdrawalLocked />
                </Router>
            </CashierProviders>
        );
    };

    it('Should show "Check proof of identity document verification status" message and redirect to account/proof-of-identity when "-->" button clicked', () => {
        renderWithdrawalLocked();

        fireButtonEvent('proof_of_identity_btn');
        expect(history.location.pathname).toBe(routes.proof_of_identity);
    });

    it('Should show "Upload a proof of identity to verify your identity" message and redirect to account/proof-of-identity when "-->" button clicked', () => {
        mockRootStore.client.account_status = setAccountStatus('none', 'none', '') as GetAccountStatus;
        renderWithdrawalLocked();

        fireButtonEvent('proof_of_identity_btn');
        expect(history.location.pathname).toBe(routes.proof_of_identity);
    });

    it('Should show "Check proof of address document verification status" message and redirect to account/proof_of_address when "-->" button clicked', () => {
        mockRootStore.client.account_status = setAccountStatus('none', 'pending', 'document') as GetAccountStatus;
        renderWithdrawalLocked();

        fireButtonEvent('proof_of_address_btn');
        expect(history.location.pathname).toBe(routes.proof_of_address);
    });

    it('Should show "Upload a proof of address to verify your address" message and redirect to account/proof_of_address when "-->" button clicked', () => {
        mockRootStore.client.account_status = setAccountStatus('none', 'none', 'document') as GetAccountStatus;
        renderWithdrawalLocked();

        fireButtonEvent('proof_of_address_btn');
        expect(history.location.pathname).toBe(routes.proof_of_address);
    });

    it('Should show "Complete the financial assessment form" message and redirect to account/financial_assessment when "-->" button clicked', () => {
        mockRootStore.client.account_status = setAccountStatus('none', 'none', '') as GetAccountStatus;
        mockRootStore.modules.cashier.withdraw.error.is_ask_financial_risk_approval = true;
        renderWithdrawalLocked();

        fireButtonEvent('financial_assessment_btn');
        expect(history.location.pathname).toBe(routes.financial_assessment);
    });

    it('should render <CashierLocked /> component', () => {
        mockRootStore.client.account_status = setAccountStatus('none', 'none', '') as GetAccountStatus;
        mockRootStore.modules.cashier.withdraw.is_10k_withdrawal_limit_reached = false;
        renderWithdrawalLocked();

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });
});
