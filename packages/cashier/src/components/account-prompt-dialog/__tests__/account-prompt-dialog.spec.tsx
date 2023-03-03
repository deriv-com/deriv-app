import React from 'react';
import { render, screen } from '@testing-library/react';
import AccountPromptDialog from '../account-prompt-dialog';
import CashierProviders from '../../../cashier-providers';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Dialog: () => <div>Dialog</div>,
}));

describe('<AccountPromptDialog />', () => {
    const mockRootStore = {
        client: {
            accounts: {
                CR90000001: { is_virtual: 0, currency: 'USD' },
                CR90000002: { is_virtual: 0, currency: 'BTC' },
            },
        },
        modules: {
            cashier: {
                account_prompt_dialog: {
                    continueRoute: jest.fn(),
                    is_confirmed: false,
                    last_location: '',
                    onCancel: jest.fn(),
                    onConfirm: jest.fn(),
                    should_show: true,
                },
            },
        },
    };
    it('should render dialog', () => {
        render(<AccountPromptDialog />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });

        expect(screen.getByText('Dialog')).toBeInTheDocument();
    });
});
