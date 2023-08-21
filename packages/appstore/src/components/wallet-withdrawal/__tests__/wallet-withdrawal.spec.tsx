import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletWithdrawal from '../wallet-withdrawal';
import { mockStore } from '@deriv/stores';
import CashierProviders from '@deriv/cashier/src/cashier-providers';

const currencies_config = {
    AUD: {
        fractional_digits: 2,
        name: 'Australian Dollar',
        type: 'fiat',
    },
    USD: {
        fractional_digits: 2,
        name: 'US Dollar',
        type: 'fiat',
    },
    EUR: {
        fractional_digits: 2,
        name: 'Euro',
        type: 'fiat',
    },
    BTC: {
        fractional_digits: 8,
        name: 'Bitcoin',
        type: 'crypto',
    },
    ETH: {
        fractional_digits: 8,
        name: 'Ethereum',
        type: 'crypto',
    },
    UST: {
        fractional_digits: 2,
        name: 'Tether Omni',
        type: 'crypto',
    },
};

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn((name: string) => {
        if (name === 'verify_email') {
            return {};
        }
        return { data: undefined };
    }),
    useFetch: jest.fn((name: string) => {
        if (name === 'balance') {
            return {
                data: {
                    balance: {
                        accounts: {
                            CRW000000: {
                                balance: 100,
                            },
                        },
                    },
                },
            };
        }

        if (name === 'authorize') {
            return {
                data: {
                    authorize: {
                        account_list: [
                            {
                                loginid: 'CRW000000',
                                account_category: 'wallet',
                                is_virtual: 0,
                                landing_company_name: 'maltainvest',
                                currency: 'USD',
                            },
                            {
                                loginid: 'MXN000000',
                                account_category: 'trading',
                                is_virtual: 0,
                                landing_company_name: 'maltainvest',
                                currency: 'BTC',
                            },
                        ],
                    },
                },
            };
        }

        if (name === 'website_status') {
            return {
                data: {
                    website_status: {
                        currencies_config,
                    },
                },
            };
        }

        return { data: undefined };
    }),
}));

// eslint-disable-next-line react/display-name
jest.mock('@deriv/cashier/src/pages/withdrawal/withdraw', () => () => <div>Withdraw</div>);

describe('WalletWithdrawal', () => {
    test('should render Send Email component', () => {
        const mock_store = mockStore({
            client: {
                loginid: 'CRW000000',
                accounts: {
                    CRW000000: {
                        token: 'token',
                    },
                },
                email: 'john@company.com',
                verification_code: {
                    payment_withdraw: '',
                },
            },
            modules: {
                cashier: { transaction_history: { onMount: jest.fn() }, iframe: { iframe_url: '' } },
            },
        });

        render(<WalletWithdrawal />, {
            wrapper: ({ children }) => <CashierProviders store={mock_store}>{children}</CashierProviders>,
        });

        expect(screen.queryByTestId('dt_empty_state_title')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_description')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_action')).toHaveTextContent('Send email');
    });

    test('should render Withdraw fiat component', () => {
        const mock_store = mockStore({
            client: {
                loginid: 'CRW000000',
                accounts: {
                    CRW000000: {
                        token: 'token',
                    },
                },
                verification_code: {
                    payment_withdraw: 'verification_code',
                },
            },
            modules: {
                cashier: { iframe: { iframe_url: 'url://iframe' } },
            },
        });

        render(<WalletWithdrawal />, {
            wrapper: ({ children }) => <CashierProviders store={mock_store}>{children}</CashierProviders>,
        });

        expect(screen.getByText('Withdraw')).toBeInTheDocument();
    });
});
