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

const mt5_real_synthetic_account = {
    account_type: 'real',
    balance: 0,
    country: 'id',
    currency: 'USD',
    display_balance: '0.00',
    display_login: '41165492',
    email: 'name@domain.com',
    group: 'real\\p01_ts03\\synthetic\\svg_std_usd\\03',
    landing_company_short: 'svg',
    leverage: 500,
    login: 'MTR41165492',
    market_type: 'synthetic',
    name: 'Name LastName',
    server: 'p01_ts03',
    server_info: {
        environment: 'Deriv-Server',
        geolocation: {
            group: 'asia_synthetic',
            location: 'Singapore',
            region: 'Asia',
            sequence: 1,
        },
        id: 'p01_ts03',
    },
    sub_account_type: 'financial',
};

const mt5_demo_financial_account = {
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
};

const dxtrade_demo_synthetic_account = {
    account_id: 'DXD1096',
    account_type: 'demo',
    balance: 10000,
    currency: 'USD',
    display_balance: '10000.00',
    display_login: 'DXD1096',
    enabled: 1,
    landing_company_short: 'svg',
    login: '374',
    market_type: 'synthetic',
    platform: 'dxtrade',
};

const dxtrade_real_synthetic_account = {
    account_id: 'DXR1095',
    account_type: 'real',
    balance: 0,
    currency: 'USD',
    display_balance: '0.00',
    display_login: 'DXR1095',
    enabled: 1,
    landing_company_short: 'svg',
    login: '374',
    market_type: 'synthetic',
    platform: 'dxtrade',
};

describe('CFDAccountCard', () => {
    const props = {
        button_label: 'Fund top up',
        commission_message: '',
        descriptor: '',
        dxtrade_tokens: {
            demo: '',
            real: '',
        },
        is_hovered: false,
        existing_data: {},
        has_banner: true,
        has_cfd_account: true,
        has_cfd_account_error: false,
        is_eu: true,
        has_real_account: false,
        is_accounts_switcher_on: false,
        is_button_primary: true,
        is_disabled: false,
        is_loading: false,
        is_logged_in: true,
        is_virtual: true,
        onHover: jest.fn(),
        platform: 'mt5',
        specs: [],
        title: 'Synthetic',
        type: 'demo',
        platform: 'mt5',
        onSelectAccount: jest.fn(),
        onClickFund: jest.fn(),
        onPasswordManager: jest.fn(),
        should_show_trade_servers: false,
        toggleAccountsDialog: jest.fn(),
        toggleShouldShowRealAccountsList: jest.fn(),
    };

    it('should render the component for Demo MT5 Synthetic account ', () => {
        render(<CFDAccountCard {...props} existing_data={mt5_demo_financial_account} />);
        expect(screen.getByText(/Synthetic/i)).toBeInTheDocument();
        expect(screen.getByText(/10,000.00 USD/i)).toBeInTheDocument();
        expect(screen.getAllByText(/20103240/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/Broker/i)).toBeInTheDocument();
        expect(screen.getByText(/Deriv Limited/i)).toBeInTheDocument();
        expect(screen.getByText(/Server/i)).toBeInTheDocument();
        expect(screen.getByText(/Deriv-Demo/i)).toBeInTheDocument();
        expect(screen.getByText(/Login ID/i)).toBeInTheDocument();
        expect(screen.getAllByText(/20103240/i)[1]).toBeInTheDocument();
        expect(screen.getByText(/Password/i)).toBeInTheDocument();
        expect(screen.getByText(/•••••••••••••••/i)).toBeInTheDocument();
        expect(screen.getByText(/IcEdit/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Trade on web terminal/i })).toBeInTheDocument();
    });

    it('should render the component for Real MT5 Synthetic account ', () => {
        render(<CFDAccountCard {...props} existing_data={mt5_real_synthetic_account} />);
        expect(screen.getByText(/Synthetic/i)).toBeInTheDocument();
        expect(screen.getByText(/0.00 USD/i)).toBeInTheDocument();
        expect(screen.getAllByText(/41165492/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/Broker/i)).toBeInTheDocument();
        expect(screen.getByText(/Deriv Limited/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Server/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/Deriv-Server/i)).toBeInTheDocument();
        expect(screen.getByText(/Login ID/i)).toBeInTheDocument();
        expect(screen.getAllByText(/41165492/i)[1]).toBeInTheDocument();
        expect(screen.getByText(/Password/i)).toBeInTheDocument();
        expect(screen.getByText(/•••••••••••••••/i)).toBeInTheDocument();
        expect(screen.getByText(/IcEdit/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Trade on web terminal/i })).toBeInTheDocument();
    });

    it('should render the component for Demo Deriv X Synthetic ', () => {
        render(<CFDAccountCard {...props} existing_data={dxtrade_demo_synthetic_account} platform='dxtrade' />);
        expect(screen.getByText(/Synthetic/i)).toBeInTheDocument();
        expect(screen.getByText(/10,000.00 USD/i)).toBeInTheDocument();
        expect(screen.getByText(/DXD1096/i)).toBeInTheDocument();
        expect(screen.getByText(/Username/i)).toBeInTheDocument();
        expect(screen.getByText(/374/i)).toBeInTheDocument();
    });

    it('should render the component for Real Deriv X Synthetic ', () => {
        render(<CFDAccountCard {...props} existing_data={dxtrade_real_synthetic_account} platform='dxtrade' />);
        expect(screen.getByText(/Synthetic/i)).toBeInTheDocument();
        expect(screen.getByText(/0.00 USD/i)).toBeInTheDocument();
        expect(screen.getByText(/DXR1095/i)).toBeInTheDocument();
        expect(screen.getByText(/Username/i)).toBeInTheDocument();
        expect(screen.getByText(/374/i)).toBeInTheDocument();
    });
});
