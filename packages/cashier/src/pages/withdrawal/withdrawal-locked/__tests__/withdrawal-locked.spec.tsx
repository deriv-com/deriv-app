import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';
import { routes } from '@deriv/shared';
import { StoreProvider } from '@deriv/stores';
import WithdrawalLocked from '../withdrawal-locked';

type TStatus = 'document' | 'none' | 'pending' | '';

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

const setAccountStatus = (identity_status: TStatus, document_status: TStatus, needs_verification: TStatus) => {
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
    let history, mockRootStore;
    beforeEach(() => {
        history = createBrowserHistory();
        mockRootStore = {
            client: {
                account_status: setAccountStatus('pending', '', ''),
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
        };
    });

    const renderWithdrawalLocked = () => {
        return render(
            <StoreProvider store={mockRootStore}>
                <Router history={history}>
                    <WithdrawalLocked />
                </Router>
            </StoreProvider>
        );
    };

    it('Should show "Check proof of identity document verification status" message and redirect to account/proof-of-identity when "-->" button clicked', () => {
        renderWithdrawalLocked();

        fireButtonEvent('proof_of_identity_btn');
        expect(history.location.pathname).toBe(routes.proof_of_identity);
    });

    it('Should show "Upload a proof of identity to verify your identity" message and redirect to account/proof-of-identity when "-->" button clicked', () => {
        mockRootStore.client.account_status = setAccountStatus('none', '', '');
        renderWithdrawalLocked();

        fireButtonEvent('proof_of_identity_btn');
        expect(history.location.pathname).toBe(routes.proof_of_identity);
    });

    it('Should show "Check proof of address document verification status" message and redirect to account/proof_of_address when "-->" button clicked', () => {
        mockRootStore.client.account_status = setAccountStatus('', 'pending', 'document');
        renderWithdrawalLocked();

        fireButtonEvent('proof_of_address_btn');
        expect(history.location.pathname).toBe(routes.proof_of_address);
    });

    it('Should show "Upload a proof of address to verify your address" message and redirect to account/proof_of_address when "-->" button clicked', () => {
        mockRootStore.client.account_status = setAccountStatus('', 'none', 'document');
        renderWithdrawalLocked();

        fireButtonEvent('proof_of_address_btn');
        expect(history.location.pathname).toBe(routes.proof_of_address);
    });

    it('Should show "Complete the financial assessment form" message and redirect to account/financial_assessment when "-->" button clicked', () => {
        mockRootStore.client.account_status = setAccountStatus('', '', '');
        mockRootStore.modules.cashier.withdraw.error.is_ask_financial_risk_approval = true;
        renderWithdrawalLocked();

        fireButtonEvent('financial_assessment_btn');
        expect(history.location.pathname).toBe(routes.financial_assessment);
    });

    it('should render <CashierLocked /> component', () => {
        mockRootStore.client.account_status = setAccountStatus('', '', '');
        mockRootStore.modules.cashier.withdraw.is_10k_withdrawal_limit_reached = false;
        renderWithdrawalLocked();

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });
});
