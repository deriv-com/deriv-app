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
    balance: 10.0,
    country: 'id',
    currency: 'USD',
    display_balance: '10.00',
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
    platform: 'mt5',
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

const synthetic_descriptor = 'Trade CFDs on our synthetic indices that simulate real-world market movement.';
const financial_descriptor =
    'Trade major (standard & micro-lots) and minor forex, stocks & stock indices, commodities, basket indices, and crypto with high leverage.';
const financial_stp_descriptor =
    'Trade popular currency pairs and cryptocurrencies with straight-through processing order (STP).';

describe('CFDAccountCard', () => {
    const props = {
        button_label: 'Fund top up',
        commission_message: 'No commission',
        descriptor: '',
        dxtrade_tokens: {
            demo: '',
            real: '',
        },
        is_hovered: false,
        existing_data: {},
        has_banner: true,
        has_cfd_account: false,
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
        specs: '',
        type: {},
        title: 'Synthetic',
        platform: 'mt5',
        onSelectAccount: jest.fn(),
        onClickFund: jest.fn(),
        onPasswordManager: jest.fn(),
        should_show_trade_servers: true,
        toggleAccountsDialog: jest.fn(),
        toggleShouldShowRealAccountsList: jest.fn(),
    };

    it('should render the component for Demo MT5 Synthetic account ', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'mt5',
        };
        render(<CFDAccountCard {...props} type={type} existing_data={mt5_demo_financial_account} />);
        expect(screen.getAllByText(/DEMO/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/IcMt5CfdPlatform/i)).toBeInTheDocument();
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
        expect(screen.getByText(/Fund top up/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Trade on web terminal/i })).toBeInTheDocument();
    });

    it('should render the component for Real MT5 Synthetic account ', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'mt5',
        };
        render(<CFDAccountCard {...props} type={type} existing_data={mt5_real_synthetic_account} />);
        expect(screen.getByText(/Asia/i)).toBeInTheDocument();
        expect(screen.getByText(/IcMt5CfdPlatform/i)).toBeInTheDocument();
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
        expect(screen.getByText(/Fund transfer/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Trade on web terminal/i })).toBeInTheDocument();
    });

    it('should render the component for Demo Deriv X Synthetic ', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'dxtrade',
        };
        render(
            <CFDAccountCard {...props} existing_data={dxtrade_demo_synthetic_account} platform='dxtrade' type={type} />
        );
        expect(screen.getByText(/DEMO/i)).toBeInTheDocument();
        expect(screen.getByText(/Synthetic/i)).toBeInTheDocument();
        expect(screen.getByText(/10,000.00 USD/i)).toBeInTheDocument();
        expect(screen.getByText(/DXD1096/i)).toBeInTheDocument();
        expect(screen.getByText(/Username/i)).toBeInTheDocument();
        expect(screen.getByText(/374/i)).toBeInTheDocument();
        expect(screen.getByText(/Fund top up/i)).toBeInTheDocument();
    });

    it('should render the component for Real Deriv X Synthetic ', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'dxtrade',
        };
        render(
            <CFDAccountCard {...props} existing_data={dxtrade_real_synthetic_account} platform='dxtrade' type={type} />
        );
        expect(screen.getByText(/Most popular/i)).toBeInTheDocument();
        expect(screen.getByText(/Synthetic/i)).toBeInTheDocument();
        expect(screen.getByText(/0.00 USD/i)).toBeInTheDocument();
        expect(screen.getByText(/DXR1095/i)).toBeInTheDocument();
        expect(screen.getByText(/Username/i)).toBeInTheDocument();
        expect(screen.getByText(/374/i)).toBeInTheDocument();
        expect(screen.getByText(/Fund transfer/i)).toBeInTheDocument();
    });

    it('should render the component for Real Deriv X Synthetic ', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'mt5',
        };
        render(<CFDAccountCard {...props} existing_data={mt5_real_synthetic_account} platform='mt5' type={type} />);
    });

    it('should not show account details if not logged in, just the platform details ', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'mt5',
        };
        render(<CFDAccountCard {...props} is_logged_in={false} descriptor={synthetic_descriptor} type={type} />);
        expect(screen.getByText(/IcMt5CfdPlatform/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Synthetic/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(/Trade CFDs on our synthetic indices that simulate real-world market movement./i)
        ).toBeInTheDocument();
        expect(screen.getByText(/No commission/i)).toBeInTheDocument();
    });

    it('should not show account details if not logged in, just the platform details ', () => {
        const type = {
            type: 'financial',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                title='Financial'
                is_logged_in={false}
                descriptor={financial_descriptor}
                type={type}
            />
        );
        expect(screen.getByText(/IcMt5CfdPlatform/i)).toBeInTheDocument();
        expect(screen.getByText(/Financial/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /Trade major \(standard & micro-lots\) and minor forex, stocks & stock indices, commodities, basket indices, and crypto with high leverage./i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/No commission/i)).toBeInTheDocument();
    });

    it('should not show account details if not logged in, just the platform details ', () => {
        const type = {
            type: 'financial_stp',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                title='Financial STP'
                is_logged_in={false}
                descriptor={financial_stp_descriptor}
                type={type}
            />
        );
        expect(screen.getByText(/IcMt5CfdPlatform/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Financial STP/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(
                /Trade popular currency pairs and cryptocurrencies with straight-through processing order \(STP\)./i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/No commission/i)).toBeInTheDocument();
    });

    it('should show server banner', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'mt5',
        };
        render(<CFDAccountCard {...props} existing_data={mt5_real_synthetic_account} type={type} />);
        expect(screen.getByText(/Asia/i)).toBeInTheDocument();
    });

    it('should show onClickfund should be called if fund top up is clicked for mt5 real account', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'mt5',
        };
        render(<CFDAccountCard {...props} type={type} existing_data={mt5_real_synthetic_account} />);
        const fund_transfer_btn = screen.getByText(/Fund transfer/i);
        fireEvent.click(fund_transfer_btn);
        expect(props.onClickFund).toHaveBeenCalled();
    });

    it('should show onclickfund should be called if fund top up is clicked for mt5 demo account', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'mt5',
        };
        render(<CFDAccountCard {...props} type={type} existing_data={mt5_demo_financial_account} />);
        const fund_top_up_btn = screen.getByText(/Fund top up/i);
        fireEvent.click(fund_top_up_btn);
        expect(props.onClickFund).toHaveBeenCalled();
    });

    it('should open Password Box if change password icon is clicked', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'mt5',
        };
        render(<CFDAccountCard {...props} type={type} existing_data={mt5_real_synthetic_account} />);
        const change_password_btn = screen.getByText(/IcEdit/i);
        fireEvent.click(change_password_btn);
        expect(props.onPasswordManager).toHaveBeenCalled();
    });

    it('should render the commission message', () => {
        render(<CFDAccountCard {...props} existing_data={false} />);
        expect(screen.getByText(/No commission/i)).toBeInTheDocument();
    });
});
