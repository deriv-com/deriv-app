import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import ClosingAccountHasPendingConditions from '../closing-account-has-pending-conditions';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getCFDAccountDisplay: jest.fn(() => 'Financial Demo'),
}));

describe('<ClosingAccountHasPendingConditions />', () => {
    let store = mockStore({});
    const mock_props = {
        details: {
            balance: {
                CR123: {
                    balance: 5000.0,
                    currency: 'USD',
                },
                CR234: {
                    balance: 0.18833116,
                    currency: 'BTC',
                },
            },
        },
        onBackClick: jest.fn(),
    };
    store = mockStore({
        client: {
            mt5_login_list: [
                {
                    account_type: 'real',
                    balance: 2,
                    country: 'id',
                    currency: 'USD',
                    display_balance: '2.00',
                    email: 'user@deriv.com',
                    group: 'real\\p01_ts01\\financial\\svg_std-hr_usd',
                    landing_company_short: 'svg',
                    leverage: 1000,
                    login: 'MTR456',
                    market_type: 'financial',
                    name: 'QA script userizbta',
                    server: 'p01_ts01',
                    server_info: {
                        environment: 'Deriv-Server',
                        geolocation: {
                            group: 'all',
                            location: 'Ireland',
                            region: 'Europe',
                            sequence: 1,
                        },
                        id: 'p01_ts01',
                    },
                    status: null,
                    sub_account_category: '',
                    sub_account_type: 'financial',
                },
            ],
            dxtrade_accounts_list: [
                {
                    account_id: 'DXR345',
                    account_type: 'real',
                    balance: 2221,
                    currency: 'USD',
                    display_balance: '2221.00',
                    landing_company_short: 'svg',
                    login: '345',
                    market_type: 'all',
                },
            ],
            account_list: [
                {
                    loginid: 'CR123',
                    is_virtual: 0,
                    icon: 'usd',
                    title: 'USD',
                },
                {
                    loginid: 'CR234',
                    is_virtual: 0,
                    icon: 'btc',
                    title: 'BTC',
                },
                {
                    loginid: 'VRTC90000148',
                    is_virtual: 1,
                    icon: 'real',
                    title: 'Real',
                },
            ],

            is_eu: false,
        },
    });

    it('should render the ClosingAccountHasPendingConditions component', () => {
        const { container } = render(
            <StoreProvider store={store}>
                <ClosingAccountHasPendingConditions {...mock_props} />
            </StoreProvider>
        );
        expect(container).toBeInTheDocument();
    });

    it('should show the accounts with deriv_balance', () => {
        const details = {
            balance: {
                CR123: {
                    balance: 2744.0,
                    currency: 'USD',
                },
                CR234: {
                    balance: 0.18833116,
                    currency: 'BTC',
                },
            },
        };

        render(
            <StoreProvider store={store}>
                <ClosingAccountHasPendingConditions {...mock_props} details={details} />
            </StoreProvider>
        );
        expect(
            screen.getByText(/please withdraw your funds from the following deriv account\(s\):/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/2,744\.00/i)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();

        expect(screen.getByText(/0\.18833116/i)).toBeInTheDocument();
        expect(screen.getByText(/BTC/i)).toBeInTheDocument();
    });

    it('should show the accounts with open_positions', () => {
        const details = {
            open_positions: {
                CR123: 1,
            },
        };

        render(
            <StoreProvider store={store}>
                <ClosingAccountHasPendingConditions {...mock_props} details={details} />
            </StoreProvider>
        );
        expect(
            screen.getByText(/please close your positions in the following deriv account\(s\):/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/1 position/i)).toBeInTheDocument();
    });

    it('should show the accounts with pending withdrawals', () => {
        const details = {
            pending_withdrawals: {
                CR123: 1,
            },
        };

        render(
            <StoreProvider store={store}>
                <ClosingAccountHasPendingConditions {...mock_props} details={details} />
            </StoreProvider>
        );
        expect(screen.getByText(/Pending withdrawal request:/i)).toBeInTheDocument();
        expect(screen.getByText(/We are still processing your withdrawal request/i)).toBeInTheDocument();
        expect(
            screen.getByText(/Please wait for the transaction to be completed before deactivating your account/i)
        ).toBeInTheDocument();
    });

    it('should show the dxtrade accounts with balance', () => {
        const details = {
            balance: {
                DXR345: {
                    balance: 2221.0,
                    currency: 'USD',
                },
            },
        };

        render(
            <StoreProvider store={store}>
                <ClosingAccountHasPendingConditions {...mock_props} details={details} />
            </StoreProvider>
        );
        expect(
            screen.getByText(/please withdraw your funds from the following deriv x account\(s\):/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/2,221\.00/i)).toBeInTheDocument();
    });

    it('should show the mt5 accounts with balance', () => {
        const details = {
            balance: {
                MTR456: {
                    balance: 2.0,
                    currency: 'USD',
                },
                MTR567: {
                    balance: 23.0,
                    currency: 'USD',
                },
            },
        };

        render(
            <StoreProvider store={store}>
                <ClosingAccountHasPendingConditions {...mock_props} details={details} />
            </StoreProvider>
        );
        expect(
            screen.getByText(/please withdraw your funds from the following deriv mt5 account\(s\):/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/2.0/i)).toBeInTheDocument();
    });

    it('should show the mt5 accounts with open_positions', () => {
        const details = {
            open_positions: {
                MTR456: 3,
            },
        };

        render(
            <StoreProvider store={store}>
                <ClosingAccountHasPendingConditions {...mock_props} details={details} />
            </StoreProvider>
        );
        expect(
            screen.getByText(/please close your positions in the following deriv mt5 account\(s\):/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/3 position\(s\)/i)).toBeInTheDocument();
    });

    it('should show the derivx accounts with open_positions', () => {
        const details = {
            open_positions: {
                DXR345: 6,
            },
        };

        render(
            <StoreProvider store={store}>
                <ClosingAccountHasPendingConditions {...mock_props} details={details} />
            </StoreProvider>
        );
        expect(
            screen.getByText(/please close your positions in the following deriv x account\(s\):/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/6 position\(s\)/i)).toBeInTheDocument();
    });
});
