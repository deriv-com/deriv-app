import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';
import { Checklist } from '@deriv/components';
import { routes } from '@deriv/shared';
import WithdrawalLocked from '../withdrawal-locked.jsx';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('Components/cashier-locked', () => () => <div>CashierLocked</div>);

const fireButtonEvent = (container, text_content) => {
    const node_list = container.querySelectorAll('.dc-checklist__item');
    let node = Array.from(node_list).find(node => {
        if (node.textContent === text_content) {
            return node;
        }
    });
    const btn = node.querySelector('.dc-checklist__item-status--action');
    fireEvent.click(btn);
};

const setAccountStatus = (identity_status, document_status, needs_verification) => {
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
    it('Should show "Check proof of identity document verification status" message and redirect to account/proof-of-identity when "-->" button clicked', () => {
        const history = createBrowserHistory();
        const need_poi_account_status = setAccountStatus('pending', '', '');

        const { container } = render(
            <Router history={history}>
                <WithdrawalLocked account_status={need_poi_account_status} is_10K_limit />
            </Router>
        );
        fireButtonEvent(container, 'Check proof of identity document verification status');

        expect(history.location.pathname).toBe(routes.proof_of_identity);
    });

    it('Should show "Upload a proof of identity to verify your identity" message and redirect to account/proof-of-identity when "-->" button clicked', () => {
        const history = createBrowserHistory();
        const need_poi_account_status = setAccountStatus('none', '', '');

        const { container } = render(
            <Router history={history}>
                <WithdrawalLocked account_status={need_poi_account_status} is_10K_limit />
            </Router>
        );
        fireButtonEvent(container, 'Upload a proof of identity to verify your identity');

        expect(history.location.pathname).toBe(routes.proof_of_identity);
    });

    it('Should show "Check proof of address document verification status" message and redirect to account/proof_of_address when "-->" button clicked', () => {
        const history = createBrowserHistory();
        const need_poa_account_status = setAccountStatus('', 'pending', 'document');

        const { container } = render(
            <Router history={history}>
                <WithdrawalLocked account_status={need_poa_account_status} is_10K_limit />
            </Router>
        );
        fireButtonEvent(container, 'Check proof of address document verification status');

        expect(history.location.pathname).toBe(routes.proof_of_address);
    });

    it('Should show "Upload a proof of address to verify your address" message and redirect to account/proof_of_address when "-->" button clicked', () => {
        const history = createBrowserHistory();
        const need_poa_account_status = setAccountStatus('', 'none', 'document');

        const { container } = render(
            <Router history={history}>
                <WithdrawalLocked account_status={need_poa_account_status} is_10K_limit />
            </Router>
        );
        fireButtonEvent(container, 'Upload a proof of address to verify your address');

        expect(history.location.pathname).toBe(routes.proof_of_address);
    });

    it('Should show "Complete the financial assessment form" message and redirect to account/financial_assessment when "-->" button clicked', () => {
        const history = createBrowserHistory();
        const account_status = setAccountStatus('', '', '');

        const { container } = render(
            <Router history={history}>
                <WithdrawalLocked account_status={account_status} is_10K_limit is_ask_financial_risk_approval />
            </Router>
        );
        fireButtonEvent(container, 'Complete the financial assessment form');

        expect(history.location.pathname).toBe(routes.financial_assessment);
    });

    it('Should trigger click on the checklist item', () => {
        const onClick = jest.fn();
        const items = [
            {
                content: 'Complete the financial assessment form',
                status: 'action',
                onClick: onClick,
            },
        ];
        const { container } = render(<Checklist className='cashier-locked__checklist' items={items} />);
        const btn = container.querySelector('.dc-checklist__item-status--action');

        fireEvent.click(btn);
        expect(onClick).toHaveBeenCalled();
    });

    it('should render <CashierLocked /> component', () => {
        const account_status = setAccountStatus('', '', '');

        render(<WithdrawalLocked account_status={account_status} />);

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });
});
