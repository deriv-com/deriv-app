import React from 'react';
import { render, screen } from '@testing-library/react';
import { useDepositLocked } from '@deriv/hooks';
import { ContentFlag } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import CashierProviders from '../../../cashier-providers';
import Deposit from '../deposit';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDepositLocked: jest.fn(() => false),
    useCashierLocked: jest.fn(() => false),
    useIsSystemMaintenance: jest.fn(() => false),
}));

jest.mock('Components/crypto-transactions-history', () => {
    const CryptoTransactionsHistory = () => <div>CryptoTransactionsHistory</div>;
    return CryptoTransactionsHistory;
});

jest.mock('../deposit-locked', () => {
    const DepositLocked = () => <div>DepositLocked</div>;
    return DepositLocked;
});

describe('<Deposit />', () => {
    beforeEach(() => {
        (useDepositLocked as jest.Mock).mockReturnValue(false);
    });

    it('should render <DepositLocked /> component', () => {
        const mock_root_store = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'real',
                        sub_account_type: 'financial_stp',
                    },
                ],
                currency: 'USD',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_switching: false,
                is_virtual: false,
                is_authorize: true,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        is_crypto_transactions_visible: false,
                    },
                    general_store: {
                        is_deposit: false,
                        is_loading: false,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
            traders_hub: { content_flag: ContentFlag.CR_DEMO },
        });
        (useDepositLocked as jest.Mock).mockReturnValue(true);

        render(<Deposit />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(screen.getByText('DepositLocked')).toBeInTheDocument();
    });

    it('should render <CryptoTransactionsHistory /> component', () => {
        const mock_root_store = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
                currency: 'USD',
                can_change_fiat_currency: false,
                current_currency_type: 'fiat',
                is_switching: false,
                is_virtual: false,
            },
            modules: {
                cashier: {
                    iframe: {},
                    transaction_history: {
                        is_crypto_transactions_visible: true,
                    },
                    general_store: {
                        is_deposit: false,
                        is_loading: false,
                        setActiveTab: jest.fn(),
                        setIsDeposit: jest.fn(),
                    },
                },
            },
            traders_hub: { content_flag: ContentFlag.CR_DEMO },
        });

        render(<Deposit />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(screen.getByText('CryptoTransactionsHistory')).toBeInTheDocument();
    });
});
