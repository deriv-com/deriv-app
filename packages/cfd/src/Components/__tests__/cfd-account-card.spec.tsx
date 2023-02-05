import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CFDAccountCard } from '../cfd-account-card';
import { TCFDAccountCard } from '../props.types';

type TMockPlatformAccounts = {
    account_type: string;
    balance: number;
    platform: string;
    display_balance: string;
    display_login: string;
    landing_company_short: string;
    login: string;
    market_type: string;
};

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
    let props: TCFDAccountCard;

    const synthetic_descriptor = 'Trade CFDs on our synthetic indices that simulate real-world market movement.';
    const financial_descriptor =
        'Trade major (standard & micro-lots) and minor forex, stocks & stock indices, commodities, basket indices, and crypto with high leverage.';

    const mt5_acc: TMockPlatformAccounts = {
        account_type: 'demo',
        balance: 10000,
        platform: 'mt5',
        display_balance: '10000.00',
        display_login: '20103240',
        landing_company_short: 'svg',
        login: 'MTD20103240',
        market_type: 'financial',
    };

    const derivx_acc: TMockPlatformAccounts = {
        account_type: 'demo',
        balance: 10000,
        platform: 'dxtrade',
        display_balance: '10000.00',
        display_login: '20103240',
        landing_company_short: 'svg',
        login: 'MTD20103240',
        market_type: 'financial',
    };

    const mt5_labuan_acc: TMockPlatformAccounts = {
        account_type: 'real',
        balance: 10000,
        platform: 'mt5',
        display_balance: '10000.00',
        display_login: '20103240',
        landing_company_short: 'labuan',
        login: 'MTD20103240',
        market_type: 'financial',
    };

    beforeEach(() => {
        props = {
            button_label: 'Top up',
            commission_message: 'No commission',
            descriptor: '',
            dxtrade_tokens: {
                demo: '',
                real: '',
            },
            is_hovered: false,
            existing_accounts_data: [],
            has_banner: true,
            has_cfd_account_error: false,
            is_eu: true,
            has_real_account: true,
            is_accounts_switcher_on: false,
            is_button_primary: true,
            is_disabled: false,
            is_logged_in: true,
            is_virtual: true,
            onHover: jest.fn(),
            specs: {},
            type: { category: '', type: '', platform: '' },
            title: '',
            platform: 'mt5',
            onSelectAccount: jest.fn(),
            onClickFund: jest.fn(),
            onPasswordManager: jest.fn(),
            toggleAccountsDialog: jest.fn(),
            toggleShouldShowRealAccountsList: jest.fn(),
            isEligibleForMoreDemoMt5Svg: jest.fn(() => true),
            isEligibleForMoreRealMt5: jest.fn(() => true),
            toggleMT5TradeModal: jest.fn(),
            setMT5TradeAccount: jest.fn(),
            trading_platform_available_accounts: [],
        };
    });

    it('should render the component for Demo MT5 Synthetic account ', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Derived'
                existing_accounts_data={[mt5_acc]}
            />
        );
        expect(screen.getByText(/most popular/i)).toBeInTheDocument();
        expect(screen.getByText(/demo/i)).toBeInTheDocument();
        expect(screen.getByText(/IcMt5CfdPlatform/i)).toBeInTheDocument();
        expect(screen.getAllByText(/synthetic/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(/trade cfds on our synthetic indices that simulate real-world market movement./i)
        ).toBeInTheDocument();
        expect(screen.getByText(/20103240/i)).toBeInTheDocument();
        expect(screen.getByText(/usd/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /top up/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /trade/i })).toBeInTheDocument();
    });

    it('should display the component for Demo MT5 Financial account ', () => {
        const type = {
            type: 'financial',
            category: 'demo',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={financial_descriptor}
                title='Financial'
                existing_accounts_data={[mt5_acc]}
            />
        );
        expect(screen.getByText(/demo/i)).toBeInTheDocument();
        expect(screen.getByText(/IcMt5CfdPlatform/i)).toBeInTheDocument();
        expect(screen.getAllByText(/financial/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(
                /trade major \(standard & micro-lots\) and minor forex, stocks & stock indices, commodities, basket indices, and crypto with high leverage./i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/20103240/i)).toBeInTheDocument();
        expect(screen.getByText(/usd/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /top up/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /trade/i })).toBeInTheDocument();
    });

    it('should render the account card if the user has a Real MT5 Synthetic account', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Derived'
                existing_accounts_data={[mt5_acc]}
                is_eu={false}
            />
        );
        expect(screen.getByText(/most popular/i)).toBeInTheDocument();
        expect(screen.getByText(/IcMt5SyntheticPlatform/i)).toBeInTheDocument();
        expect(screen.getAllByText(/synthetic/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(/trade cfds on our synthetic indices that simulate real-world market movement./i)
        ).toBeInTheDocument();
        expect(screen.getByText(/svg/i)).toBeInTheDocument();
        expect(screen.getByText(/20103240/i)).toBeInTheDocument();
        expect(screen.getByText(/usd/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /top up/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /trade/i })).toBeInTheDocument();
    });

    it('should render the account card if the user has a Real MT5 Financial account', () => {
        const type = {
            type: 'financial',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={financial_descriptor}
                title='Financial'
                existing_accounts_data={[mt5_acc]}
                is_eu={false}
            />
        );
        expect(screen.getByText(/svg/i)).toBeInTheDocument();
        expect(screen.getByText(/IcMt5FinancialPlatform/i)).toBeInTheDocument();
        expect(screen.getAllByText(/financial/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(
                /trade major \(standard & micro-lots\) and minor forex, stocks & stock indices, commodities, basket indices, and crypto with high leverage./i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/20103240/i)).toBeInTheDocument();
        expect(screen.getByText(/usd/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /top up/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /trade/i })).toBeInTheDocument();
    });

    it('should call onClickFund when top up button is clicked', () => {
        const type = {
            type: 'financial',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={financial_descriptor}
                title='Financial'
                existing_accounts_data={[mt5_acc]}
            />
        );
        fireEvent.click(screen.getByRole('button', { name: /top up/i }));
        expect(props.onClickFund).toHaveBeenCalledWith(mt5_acc);
    });

    it('should call toggleMT5TradeModal when trade button is clicked', () => {
        const type = {
            type: 'financial',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={financial_descriptor}
                title='Financial'
                existing_accounts_data={[mt5_acc]}
            />
        );
        fireEvent.click(screen.getByRole('button', { name: /trade/i }));
        expect(props.toggleMT5TradeModal).toHaveBeenCalled();
        expect(props.setMT5TradeAccount).toHaveBeenCalledWith(mt5_acc);
    });

    it("should show add account button if the user doesn't have an existing account", () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Derived'
                existing_accounts_data={[]}
                platform='mt5'
                is_eu={false}
            />
        );
        expect(screen.getByText(/add account/i)).toBeInTheDocument();
    });

    it("should show add account button if the user doesn't have an existing account for real account", () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Derived'
                existing_accounts_data={[]}
                platform='mt5'
                is_eu={false}
            />
        );
        expect(screen.getByText(/add account/i)).toBeInTheDocument();
    });

    it('should call onSelectAccount when the add account button is clicked', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Derived'
                existing_accounts_data={[]}
                platform='mt5'
                is_eu={false}
            />
        );
        fireEvent.click(screen.getByText(/add account/i));
        expect(props.onSelectAccount).toHaveBeenCalled();
    });

    it('should show add real acount button and call onSelectAccount if the button is clicked', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Derived'
                platform='mt5'
                button_label='Add real account'
                existing_accounts_data={null}
            />
        );
        fireEvent.click(screen.getByText(/add real account/i));
        expect(props.onSelectAccount).toHaveBeenCalled();
    });

    it('should show add demo account button and call onSelectAccount if the button is clicked', () => {
        const type = {
            type: 'financial',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Derived'
                platform='mt5'
                button_label='Add demo account'
                existing_accounts_data={null}
            />
        );
        fireEvent.click(screen.getByText(/add demo account/i));
        expect(props.onSelectAccount).toHaveBeenCalled();
    });

    it('should show labuan banner', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Derived'
                platform='mt5'
                existing_accounts_data={[mt5_labuan_acc]}
            />
        );
        expect(screen.getByText(/labuan/i)).toBeInTheDocument();
    });

    it('should show fund transfer button and call onClickFund when the button is clicked', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'dxtrade',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Derived'
                platform='dxtrade'
            />
        );
        fireEvent.click(screen.getByText(/fund transfer/i));
        expect(props.onClickFund).toHaveBeenCalled();
    });

    it('should call onPasswordManager when the password change button icon is clicked', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'dxtrade',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Derived'
                existing_accounts_data={[derivx_acc]}
                platform='dxtrade'
            />
        );
        expect(screen.getByText(/icedit/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/icedit/i));
        expect(props.onPasswordManager).toHaveBeenCalled();
    });

    it('should render the account card for Demo DerivX Synthetic account ', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'dxtrade',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Derived'
                existing_accounts_data={[derivx_acc]}
                platform='dxtrade'
                is_eu={false}
            />
        );
        expect(screen.getByText(/most popular/i)).toBeInTheDocument();
        expect(screen.getByText(/demo/i)).toBeInTheDocument();
        expect(screen.getByText(/IcDxtradeSyntheticPlatform/i)).toBeInTheDocument();
        expect(screen.getAllByText(/synthetic/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/username/i)).toBeInTheDocument();
        expect(screen.getByText(/mtd20103240/i)).toBeInTheDocument();
        expect(screen.getByText(/password/i)).toBeInTheDocument();
        expect(screen.getByText(/•••••••••••••••/i)).toBeInTheDocument();
        expect(screen.getByText(/icedit/i)).toBeInTheDocument();
        expect(screen.getByText(/trade on web terminal/i)).toBeInTheDocument();
    });

    it('should show descriptor and commission message when the user has no existing data and not logged in', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'dxtrade',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Derived'
                existing_accounts_data={null}
                platform='dxtrade'
                is_eu={false}
                is_logged_in={false}
            />
        );
        expect(screen.getByText(/most popular/i)).toBeInTheDocument();
        expect(
            screen.getByText(/Trade CFDs on our synthetic indices that simulate real-world market movement/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/no commission/i)).toBeInTheDocument();
    });
});
