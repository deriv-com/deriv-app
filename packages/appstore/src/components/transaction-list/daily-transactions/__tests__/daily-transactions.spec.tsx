import React from 'react';
import DailyTransactions from '../daily-transactions';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useActiveWallet: jest.fn(() => ({
        loginid: '12345678',
    })),
}));

describe('DailyTransactions', () => {
    let mocked_props: Required<React.ComponentProps<typeof DailyTransactions>>;

    beforeEach(() => {
        mocked_props = {
            day: '01 Jan 2023',
            transaction_list: [
                {
                    account_category: 'wallet',
                    // @ts-expect-error we don't really need a full config here
                    account_currency_config: {
                        code: 'USD',
                        type: 'fiat',
                        fractional_digits: 2,
                    },
                    account_type: 'doughflow',
                    action_type: 'deposit',
                    amount: 75,
                    balance_after: 100,
                    is_virtual: 0,
                    landing_company_shortcode: 'svg',
                    transaction_id: 123456789,
                },
                {
                    account_category: 'wallet',
                    // @ts-expect-error we don't really need a full config here
                    account_currency_config: {
                        code: 'USD',
                        type: 'fiat',
                        fractional_digits: 2,
                    },
                    account_type: 'doughflow',
                    action_type: 'transfer',
                    amount: 50,
                    balance_after: 200,
                    is_virtual: 0,
                    landing_company_shortcode: 'svg',
                    to: {
                        loginid: '1234',
                    },
                    from: {
                        loginid: '12345678',
                    },
                    transaction_id: 987654321,
                },
            ],
        };
    });

    const render_container = (mock_store_override = {}) => {
        const mock_store = mockStore(mock_store_override);
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );
        return render(<DailyTransactions {...mocked_props} />, {
            wrapper,
        });
    };

    it('should display the component', () => {
        const { container } = render_container();

        expect(container).toBeInTheDocument();
    });

    it('should render proper day', () => {
        render_container();

        expect(screen.getByText('01 Jan 2023')).toBeInTheDocument();
    });

    it('should render proper transaction amount for an outgoing transfer', () => {
        render_container();

        expect(screen.getByText('-50.00 USD')).toBeInTheDocument();
    });

    it('should render 2 transaction components', () => {
        render_container();

        const transactions = screen.getAllByTestId('dt_completed_transaction');
        expect(transactions).toHaveLength(2);
    });
});
