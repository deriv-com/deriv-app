import React from 'react';
import { render, screen } from '@testing-library/react';
import { useFetch } from '@deriv/api';
import { mockStore } from '@deriv/stores';
import WalletWithdrawal from '../wallet-withdrawal';
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

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'authorize'>>;

jest.mock('@deriv/api/src/useQuery', () => (name: string) => {
    if (name === 'website_status') {
        return {
            data: {
                website_status: {
                    currencies_config,
                },
            },
        };
    }

    if (name === 'crypto_config') {
        return {
            data: {
                currencies_config: {
                    BTC: {
                        minimum_withdrawal: 0.00036481,
                    },
                    ETH: {
                        minimum_withdrawal: 0.03177498,
                    },
                    LTC: {
                        minimum_withdrawal: 0.0797639,
                    },
                    USDC: {
                        minimum_withdrawal: 50.05,
                    },
                    UST: {
                        minimum_withdrawal: 24.98,
                    },
                    eUSDT: {
                        minimum_withdrawal: 49.95,
                    },
                    tUSDT: {
                        minimum_deposit: 50,
                        minimum_withdrawal: 24.98,
                    },
                },
            },
        };
    }
});

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn((name: string) => {
        if (name === 'verify_email') {
            return {};
        }
        return { data: undefined };
    }),
    useFetch: jest.fn((name: string) => {
        if (name === 'authorize') {
            return {
                data: {
                    authorize: {
                        loginid: 'CRW000000',
                        account_list: [
                            {
                                loginid: 'CRW000000',
                                account_category: 'wallet',
                                is_virtual: 0,
                                landing_company_name: 'maltainvest',
                                currency: 'USD',
                            },
                            {
                                loginid: 'CRW000001',
                                account_category: 'wallet',
                                is_virtual: 0,
                                landing_company_name: 'svg',
                                currency: 'ETH',
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

        return { data: undefined };
    }),
}));

// eslint-disable-next-line react/display-name
jest.mock('@deriv/cashier/src/pages/withdrawal/withdraw', () => () => <div>Withdraw</div>);
// eslint-disable-next-line react/display-name
jest.mock('@deriv/cashier/src/pages/withdrawal/crypto-withdrawal', () => () => <div>CryptoWithdraw</div>);

describe('WalletWithdrawal', () => {
    it('should render Send Email component', () => {
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
                cashier: {
                    transaction_history: {
                        onMount: jest.fn(),
                        is_crypto_transactions_visible: false,
                    },
                    iframe: { iframe_url: '' },
                    withdraw: { is_withdraw_confirmed: false },
                },
            },
        });

        render(<WalletWithdrawal />, {
            wrapper: ({ children }) => <CashierProviders store={mock_store}>{children}</CashierProviders>,
        });

        expect(screen.queryByTestId('dt_empty_state_title')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_description')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_action')).toHaveTextContent('Send email');
    });

    it('should render Withdraw fiat component', () => {
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
                cashier: {
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                    },
                    iframe: { iframe_url: 'url://iframe' },
                    withdraw: { is_withdraw_confirmed: false },
                },
            },
        });

        render(<WalletWithdrawal />, {
            wrapper: ({ children }) => <CashierProviders store={mock_store}>{children}</CashierProviders>,
        });

        expect(screen.getByText('Withdraw')).toBeInTheDocument();
    });

    it('should render CryptoWithdraw component', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockImplementation((name: string) => {
            if (name === 'authorize') {
                return {
                    data: {
                        authorize: {
                            loginid: 'CRW000001',
                            account_list: [
                                {
                                    loginid: 'CRW000000',
                                    account_category: 'wallet',
                                    is_virtual: 0,
                                    landing_company_name: 'maltainvest',
                                    currency: 'USD',
                                },
                                {
                                    loginid: 'CRW000001',
                                    account_category: 'wallet',
                                    is_virtual: 0,
                                    landing_company_name: 'svg',
                                    currency: 'ETH',
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

            return { data: undefined };
        });

        const mock_store = mockStore({
            client: {
                loginid: 'CRW000001',
                accounts: {
                    CRW000001: {
                        token: 'token',
                    },
                },
                verification_code: {
                    payment_withdraw: 'verification_code',
                },
            },
            modules: {
                cashier: {
                    transaction_history: {
                        is_crypto_transactions_visible: true,
                    },
                    iframe: { iframe_url: '' },
                    withdraw: { is_withdraw_confirmed: false },
                },
            },
        });

        render(<WalletWithdrawal />, {
            wrapper: ({ children }) => <CashierProviders store={mock_store}>{children}</CashierProviders>,
        });

        expect(screen.getByText('CryptoWithdraw')).toBeInTheDocument();
    });
});
