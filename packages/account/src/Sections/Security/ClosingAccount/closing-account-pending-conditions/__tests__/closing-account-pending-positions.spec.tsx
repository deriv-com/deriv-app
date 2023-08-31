import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import ClosingAccountHasPendingConditions from '../closing-account-has-pending-conditions';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getCFDAccountDisplay: jest.fn(() => 'Financial Demo'),
}));

describe('<ClosingAccountHasPendingConditions />', () => {
    const mock_props: React.ComponentProps<typeof ClosingAccountHasPendingConditions> = {
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
        onConfirm: jest.fn(),
    };
    const store = mockStore({
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

            is_eu: false,
        },
    });

    const renderComponent = (props = { ...mock_props }) => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={store}>{children}</StoreProvider>
        );

        render(<ClosingAccountHasPendingConditions {...props} />, {
            wrapper,
        });
    };

    it('should show the mt5 accounts with open_positions', () => {
        const new_props: React.ComponentProps<typeof ClosingAccountHasPendingConditions> = {
            ...mock_props,
            details: {
                open_positions: {
                    MTR456: 3,
                },
            },
        };

        renderComponent(new_props);
        expect(
            screen.getByText(/please close your positions in the following deriv mt5 account\(s\):/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/3 position\(s\)/i)).toBeInTheDocument();
    });

    it('should show the derivx accounts with open_positions', () => {
        const new_props: React.ComponentProps<typeof ClosingAccountHasPendingConditions> = {
            ...mock_props,
            details: {
                open_positions: {
                    DXR345: 6,
                },
            },
        };

        renderComponent(new_props);
        expect(
            screen.getByText(/please close your positions in the following deriv x account\(s\):/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/6 position\(s\)/i)).toBeInTheDocument();
    });
});
