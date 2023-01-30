import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';
import { Checklist } from '@deriv/components';
import { routes } from '@deriv/shared';
import AccountTransferLocked from '../account-transfer-locked';
import CashierProviders from '../../../../cashier-providers';

describe('AccountTransferLocked', () => {
    let mockRootStore;
    beforeEach(() => {
        mockRootStore = {
            client: {
                is_financial_account: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
            },
        };
    });

    it('Should show the default lock content if the account is not financial', () => {
        mockRootStore.client.is_financial_information_incomplete = true;
        mockRootStore.client.is_trading_experience_incomplete = true;

        render(<AccountTransferLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });

        expect(screen.getByText('Transfers are locked')).toBeInTheDocument();
    });

    it('Should show the default lock content if the account is financial and any of the account information (financial or trading_experience) is incomplete', () => {
        mockRootStore.client.is_financial_account = true;
        mockRootStore.client.is_trading_experience_incomplete = true;

        render(<AccountTransferLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });

        expect(screen.getByText('Transfers are locked')).toBeInTheDocument();
    });

    it('Should trigger click on the checklist item', () => {
        const onClick = jest.fn();
        const items = [
            {
                content: 'Complete the financial assessment form',
                status: 'action',
                is_disabled: false,
                button_text: 'sample text',
                onClick,
            },
        ];

        render(<Checklist className='cashier-locked__checklist' itemClassName='sample_class_name' items={items} />);

        const btn = screen.getByTestId('dt_checklist_item_status_action');
        fireEvent.click(btn);

        expect(onClick).toHaveBeenCalled();
    });

    it('Should show the financial assessment form and redirect to account/financial-assessment when "-->" button clicked', () => {
        const history = createBrowserHistory();
        mockRootStore.client.is_financial_account = true;
        mockRootStore.client.is_financial_information_incomplete = true;
        mockRootStore.client.is_trading_experience_incomplete = true;

        render(<AccountTransferLocked />, {
            wrapper: ({ children }) => (
                <CashierProviders store={mockRootStore}>
                    <Router history={history}>{children}</Router>
                </CashierProviders>
            ),
        });
        const btn = screen.getByTestId('dt_checklist_item_status_action');
        fireEvent.click(btn);

        expect(history.location.pathname).toBe(routes.financial_assessment);
        expect(screen.getByText('Complete the financial assessment form')).toBeInTheDocument();
    });
});
