import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { CFDDemoAccountDisplay } from '../cfd-demo-account-display';

const mock_connect_props = {
    dxtrade_tokens: {
        demo: '',
        real: '',
    },
    setMT5TradeAccount: jest.fn(),
    isEligibleForMoreDemoMt5Svg: () => true,
};

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => props => Component({ ...props, ...mock_connect_props }),
}));

describe('<CFDDemoAccountDisplay />', () => {
    const TESTED_CASES = {
        EU: 'eu',
        LOADING: 'loading',
        NON_EU_DMT5: 'non_eu_dmt5',
        NON_EU_DXTRADE: 'non_eu_dxtrade',
    };

    let props;

    beforeEach(() => {
        props = {
            current_list: {},
            has_cfd_account_error: false,
            has_maltainvest_account: false,
            is_eu: false,
            is_eu_country: false, // depends on client IP address
            is_loading: false,
            is_logged_in: true,
            isSyntheticCardVisible: jest.fn(() => true),
            isFinancialCardVisible: jest.fn(() => true),
            onSelectAccount: jest.fn(),
            openAccountNeededModal: jest.fn(),
            openAccountTransfer: jest.fn(),
            openPasswordManager: jest.fn(),
            platform: 'mt5',
            residence: 'id',
            standpoint: {
                financial_company: 'svg',
                gaming_company: 'svg',
                iom: false,
                malta: false,
                maltainvest: false,
                svg: true,
            },
            toggleMT5TradeModal: jest.fn(),
        };
    });

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

    const checkAccountCardsRendering = tested_case => {
        const component_testid = 'dt_cfd_demo_accounts_display';
        const first_account_card = 'Derived';
        const second_account_card = {
            eu: 'CFDs',
            non_eu: 'Financial',
        };

        if (tested_case === TESTED_CASES.LOADING) {
            expect(screen.queryByTestId(component_testid)).not.toBeInTheDocument();
            expect(screen.queryByText(first_account_card)).not.toBeInTheDocument();
            expect(screen.queryByText(second_account_card.eu)).not.toBeInTheDocument();
            expect(screen.queryByText(second_account_card.non_eu)).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId(component_testid)).toBeInTheDocument();
        }

        if (tested_case === TESTED_CASES.EU) {
            expect(screen.queryByText(first_account_card)).not.toBeInTheDocument();
            expect(screen.getByText(second_account_card.eu)).toBeInTheDocument();
            expect(screen.queryByText(second_account_card.non_eu)).not.toBeInTheDocument();
        } else if (tested_case === TESTED_CASES.NON_EU_DMT5 || tested_case === TESTED_CASES.NON_EU_DXTRADE) {
            expect(screen.getByText(first_account_card)).toBeInTheDocument();
            expect(screen.getByText(second_account_card.non_eu)).toBeInTheDocument();
        }
    };

    it('should render Derived & Financial cards with enabled buttons on DMT5 when non-EU, non-IoM, is_logged_in=true & has_maltainvest_account=false', () => {
        render(<CFDDemoAccountDisplay {...props} />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        const add_demo_account_buttons = screen.getAllByRole('button', { name: /add demo account/i });
        expect(add_demo_account_buttons.length).toBe(2);

        fireEvent.click(add_demo_account_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'synthetic', category: 'demo', platform: 'mt5' });

        fireEvent.click(add_demo_account_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial', category: 'demo', platform: 'mt5' });
    });

    it('should render Derived & Financial cards without "Add demo account" buttons on DMT5 when is_logged_in=false & is_eu_country=false', () => {
        render(<CFDDemoAccountDisplay {...props} is_logged_in={false} />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        expect(screen.queryAllByRole('button', { name: /add demo account/i }).length).toBe(0);
    });

    it('should render a CFDs card only with enabled "Add demo account" button on DMT5 when EU, is_logged_in=true, standpoint.iom=true & has_maltainvest_account=false', () => {
        props.standpoint.iom = true;
        props.isSyntheticCardVisible = jest.fn(() => false);
        render(<CFDDemoAccountDisplay {...props} is_eu />);

        checkAccountCardsRendering(TESTED_CASES.EU);
        const add_demo_account_button = screen.getByRole('button', { name: /add demo account/i });
        expect(add_demo_account_button).toBeEnabled();

        fireEvent.click(add_demo_account_button);
        expect(props.openAccountNeededModal).toHaveBeenCalledWith('maltainvest', 'Deriv Multipliers', 'demo CFDs');
    });

    it('should render a CFDs card only without "Add demo account" button on DMT5 when is_logged_in=false & is_eu_country=true (also when redirected from Deriv X platform)', () => {
        props.isSyntheticCardVisible = jest.fn(() => false);
        render(<CFDDemoAccountDisplay {...props} is_logged_in={false} is_eu_country />);

        checkAccountCardsRendering(TESTED_CASES.EU);
        expect(screen.queryAllByRole('button', { name: /add demo account/i }).length).toBe(0);
    });

    it('should render Derived & Financial cards with enabled buttons on Deriv X when is_logged_in=true & is_eu=false', () => {
        render(<CFDDemoAccountDisplay {...props} platform='dxtrade' />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DXTRADE);
        const add_demo_account_buttons = screen.getAllByRole('button', { name: /add demo account/i });
        expect(add_demo_account_buttons.length).toBe(2);

        fireEvent.click(add_demo_account_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({
            type: 'synthetic',
            category: 'demo',
            platform: 'dxtrade',
        });

        fireEvent.click(add_demo_account_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({
            type: 'financial',
            category: 'demo',
            platform: 'dxtrade',
        });
    });

    it('should render Derived & Financial cards without "Add demo account" buttons on Deriv X when is_logged_in=false & is_eu_country=false', () => {
        render(<CFDDemoAccountDisplay {...props} is_logged_in={false} platform='dxtrade' />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DXTRADE);
        expect(screen.queryAllByRole('button', { name: /add demo account/i }).length).toBe(0);
    });

    it('should render 1 open account with an enabled "Top up" ("Fund top up" for Deriv X) & "Trade" ("Trade on web terminal" in Deriv X) buttons', () => {
        props.current_list['mt5.demo.financial@p01_ts02'] = mt5_demo_financial_account;
        const { container, rerender } = render(<CFDDemoAccountDisplay {...props} />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        expect(screen.getAllByRole('button', { name: /add demo account/i }).length).toBe(1);
        const dmt5_top_up_button = screen.getByRole('button', { name: /top up/i });
        const dmt5_trade_button = screen.getByRole('button', { name: /trade/i });

        fireEvent.click(dmt5_top_up_button);
        expect(props.openAccountTransfer).toHaveBeenCalledWith(props.current_list['mt5.demo.financial@p01_ts02'], {
            category: 'demo',
            type: 'financial',
        });
        fireEvent.click(dmt5_trade_button);
        expect(props.toggleMT5TradeModal).toHaveBeenCalledTimes(1);

        rerender(
            <CFDDemoAccountDisplay
                {...props}
                platform='dxtrade'
                current_list={{
                    'dxtrade.demo.synthetic@synthetic': dxtrade_demo_synthetic_account,
                }}
            />
        );
        checkAccountCardsRendering(TESTED_CASES.NON_EU_DXTRADE);
        const dxtrade_fund_top_up_button = screen.getByRole('button', { name: /top up/i });
        const dxtrade_trade_on_web_terminal_button = screen.getByRole('link', { name: /trade on web terminal/i });
        expect(dxtrade_trade_on_web_terminal_button).toHaveAttribute('href', 'https://dx-demo.deriv.com');

        fireEvent.click(dxtrade_fund_top_up_button);
        expect(props.openAccountTransfer).toHaveBeenCalledTimes(2);
    });

    it('should disable all "Add demo account" buttons when has_cfd_account_error=true', () => {
        render(<CFDDemoAccountDisplay {...props} has_cfd_account_error />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        const add_demo_account_buttons = screen.getAllByRole('button', { name: /add demo account/i });
        expect(add_demo_account_buttons[0]).toBeDisabled();
        expect(add_demo_account_buttons[1]).toBeDisabled();
    });

    it('should show loading when is_loading=true', () => {
        render(<CFDDemoAccountDisplay {...props} is_loading />);

        expect(screen.getByTestId('dt_barspinner')).toBeInTheDocument();
        checkAccountCardsRendering(TESTED_CASES.LOADING);
    });
});
