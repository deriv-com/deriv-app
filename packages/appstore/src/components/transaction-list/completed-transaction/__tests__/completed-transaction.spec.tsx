import React from 'react';
import CompletedTransaction from '../completed-transaction';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    AppLinkedWithWalletIcon: jest.fn(() => <div>AppLinkedWithWalletIcon</div>),
    WalletIcon: jest.fn(() => <div>WalletIcon</div>),
}));

describe('CompletedTransaction', () => {
    let mocked_props: Required<React.ComponentProps<typeof CompletedTransaction>>;

    beforeEach(() => {
        mocked_props = {
            transaction: {
                account_category: 'wallet',
                // @ts-expect-error we don't really need a full config here
                account_currency_config: {
                    fractional_digits: 2,
                    code: 'USD',
                    type: 'fiat',
                },
                account_type: 'doughflow',
                action_type: 'deposit',
                amount: 50,
                balance_after: 100,
                is_virtual: 0,
                landing_company_shortcode: 'svg',
            },
        };
    });

    const render_container = (mock_store_override = {}) => {
        const mock_store = mockStore(mock_store_override);
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );
        return render(<CompletedTransaction {...mocked_props} />, {
            wrapper,
        });
    };

    it('should display the component', () => {
        const { container } = render_container();

        expect(container).toBeInTheDocument();
    });

    it('should render proper account name', () => {
        render_container();

        expect(screen.getByText(/USD Wallet/i)).toBeInTheDocument();
    });

    it('should render proper account balance', () => {
        render_container();

        expect(screen.getByText('Balance: 100.00 USD')).toBeInTheDocument();
    });

    it('should render proper amount when positive', () => {
        render_container();

        expect(screen.getByText('+50.00 USD')).toBeInTheDocument();
    });

    it('should render proper amount when negative', () => {
        mocked_props.transaction.amount = -50;
        mocked_props.transaction.account_type = 'withdrawal';
        render_container();

        expect(screen.getByText('-50.00 USD')).toBeInTheDocument();
    });

    it('should render single wallet icon, if account type is wallet', () => {
        render_container();

        expect(screen.getByText(/WalletIcon/i)).toBeInTheDocument();
    });

    it('should render combined icon (app with wallet), if transaction is a transfer and account category is trading', () => {
        mocked_props.transaction.action_type = 'transfer';
        mocked_props.transaction.account_category = 'trading';
        mocked_props.transaction.account_type = 'standard';
        render_container();

        expect(screen.getByText(/AppLinkedWithWalletIcon/i)).toBeInTheDocument();
    });
});
