import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { CFDAccountCard } from '../cfd-account-card';

const mock_connect_props = {
    dxtrade_tokens: {
        demo: '',
        real: '',
    },
};

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => props => Component({ ...props, ...mock_connect_props }),
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => <div data-testid='mocked_icon'>{props.icon}</div>),
    };
});

describe('CFDAccountCard', () => {
    const props = {
        button_label: '',
        commission_message: '',
        descriptor: '',
        dxtrade_tokens: {
            demo: '',
            real: '',
        },
        is_hovered: false,
        existing_data: {
            account_type: 'demo',
            balance: 10000,
            country: 'id',
            currency: 'USD',
            display_balance: '10000.00',
            display_login: '20103240',
            email: 'name@domain.com',
            group: 'demo\\p01_ts02\\financial\\svg_std_usd',
            landing_company_short: 'svg',
            leverage: 1000,
            login: 'MTD20103240',
            market_type: 'financial',
            name: 'Name LastName',
            server: 'p01_ts02',
            server_info: {
                environment: 'Deriv-Demo',
                geolocation: {
                    group: 'all',
                    location: 'N. Virginia',
                    region: 'US East',
                    sequence: 1,
                },
                id: 'p01_ts02',
            },
            sub_account_type: 'financial',
        },
        has_banner: true,
        has_cfd_account: true,
        has_cfd_account_error: false,
        is_eu: false,
        has_real_account: true,
        is_accounts_switcher_on: false,
        is_button_primary: false,
        is_disabled: false,
        is_loading: false,
        is_logged_in: true,
        is_virtual: true,
        onHover: jest.fn(),
        platform: 'mt5',
        specs: [],
        title: 'Synthetic',
        type: 'real',
        platform: 'mt5',
        onSelectAccount: jest.fn(),
        onClickFund: jest.fn(),
        onPasswordManager: jest.fn(),
        should_show_trade_servers: false,
        toggleAccountsDialog: jest.fn(),
        toggleShouldShowRealAccountsList: jest.fn(),
    };

    it('should render the component', () => {
        render(<CFDAccountCard {...props} />);

        screen.debug();
    });
});
