import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { CFDDemoAccountDisplay } from '../cfd-demo-account-display';

describe('<CFDDemoAccountDisplay />', () => {
    const TESTED_CASES = {
        EU: 'eu',
        NON_EU_DMT5: 'non_eu_dmt5',
        NON_EU_DXTRADE: 'non_eu_dxtrade',
    };

    let props;

    beforeEach(() => {
        props = {
            current_list: {},
            has_cfd_account: false,
            has_cfd_account_error: false,
            has_maltainvest_account: false,
            is_eu: false,
            is_eu_country: false, // depends on client IP address
            is_loading: false,
            is_logged_in: true,
            isSyntheticCardVisible: jest.fn(() => true),
            isFinancialCardVisible: jest.fn(() => true),
            isFinancialStpCardVisible: jest.fn(() => true),
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

    const checkAccountCardsRendering = tested_case => {
        const first_account_card = 'Synthetic';
        const second_account_card = {
            eu: 'CFDs',
            non_eu: 'Financial',
        };
        const third_account_card = 'Financial STP';

        expect(screen.getByTestId('dt_cfd_demo_accounts_display')).toBeInTheDocument();

        if (tested_case === TESTED_CASES.NON_EU_DMT5 || tested_case === TESTED_CASES.NON_EU_DXTRADE) {
            expect(screen.getByText(first_account_card)).toBeInTheDocument();
            expect(screen.getByText(second_account_card.non_eu)).toBeInTheDocument();
        }
        if (tested_case === TESTED_CASES.NON_EU_DXTRADE || tested_case === TESTED_CASES.EU) {
            expect(screen.queryByText(third_account_card)).not.toBeInTheDocument();
        }
        if (tested_case === TESTED_CASES.NON_EU_DMT5) {
            expect(screen.getByText(third_account_card)).toBeInTheDocument();
        } else if (tested_case === TESTED_CASES.EU) {
            expect(screen.queryByText(first_account_card)).not.toBeInTheDocument();
            expect(screen.getByText(second_account_card.eu)).toBeInTheDocument();
            expect(screen.queryByText(second_account_card.non_eu)).not.toBeInTheDocument();
        }
    };

    it('should render Synthetic, Financial & Financial STP cards with enabled buttons on DMT5 when is_logged_in=true, standpoint.iom=false & has_maltainvest_account=false', () => {
        render(<CFDDemoAccountDisplay {...props} />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        const add_demo_account_buttons = screen.getAllByRole('button', { name: /add demo account/i });
        expect(add_demo_account_buttons.length).toBe(3);

        fireEvent.click(add_demo_account_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'synthetic', category: 'demo' });

        fireEvent.click(add_demo_account_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial', category: 'demo' });

        fireEvent.click(add_demo_account_buttons[2]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial_stp', category: 'demo' });
    });

    it('should render Synthetic, Financial & Financial STP cards without "Add demo account" buttons on DMT5 when is_logged_in=false & is_eu_country=false', () => {
        render(<CFDDemoAccountDisplay {...props} is_logged_in={false} />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        expect(screen.queryAllByRole('button', { name: /add demo account/i }).length).toBe(0);
    });

    it('should render a CFDs card only with enabled "Add demo account" button on DMT5 when EU, is_logged_in=true, standpoint.iom=true & has_maltainvest_account=false', () => {
        props.standpoint.iom = true;
        props.isSyntheticCardVisible = jest.fn(() => false);
        props.isFinancialStpCardVisible = jest.fn(() => false);
        render(<CFDDemoAccountDisplay {...props} is_eu />);

        checkAccountCardsRendering(TESTED_CASES.EU);
        const add_demo_account_button = screen.getByRole('button', { name: /add demo account/i });
        expect(add_demo_account_button).toBeEnabled();

        fireEvent.click(add_demo_account_button);
        expect(props.openAccountNeededModal).toHaveBeenCalledWith('maltainvest', 'Deriv Multipliers', 'demo CFDs');
    });

    it('should render a CFDs card only without "Add demo account" button on DMT5 when is_logged_in=false & is_eu_country=true (also when redirected from Deriv X platform)', () => {
        props.isSyntheticCardVisible = jest.fn(() => false);
        props.isFinancialStpCardVisible = jest.fn(() => false);
        render(<CFDDemoAccountDisplay {...props} is_logged_in={false} is_eu_country />);

        expect(screen.getByTestId('dt_cfd_demo_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.queryByText('Synthetic')).not.toBeInTheDocument();
        expect(screen.queryByText('Financial')).not.toBeInTheDocument();
        expect(screen.queryByText('Financial STP')).not.toBeInTheDocument();
        expect(screen.getAllByRole('table').length).toBe(1);
        expect(screen.queryAllByRole('button', { name: /add demo account/i }).length).toBe(0);
    });

    it('should render Synthetic & Financial cards with enabled buttons on Deriv X when is_logged_in=true & is_eu=false', () => {
        props.isFinancialStpCardVisible = jest.fn(() => false);
        render(<CFDDemoAccountDisplay {...props} platform='dxtrade' />);

        const add_demo_account_buttons = screen.getAllByRole('button', { name: /add demo account/i });

        expect(screen.getByTestId('dt_cfd_demo_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.queryByText('Financial STP')).not.toBeInTheDocument();
        expect(screen.getAllByRole('table').length).toBe(2);
        expect(screen.getAllByRole('cell', { name: /leverage/i }).length).toBe(2);
        expect(screen.getAllByRole('cell', { name: /margin call/i }).length).toBe(2);
        expect(screen.getAllByRole('cell', { name: /stop out level/i }).length).toBe(2);
        expect(screen.getAllByRole('cell', { name: /number of assets/i }).length).toBe(2);
        expect(add_demo_account_buttons.length).toBe(2);

        fireEvent.click(add_demo_account_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'synthetic', category: 'demo' });

        fireEvent.click(add_demo_account_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial', category: 'demo' });
    });

    it('should render Synthetic & Financial cards without "Add demo account" buttons on Deriv X when is_logged_in=false & is_eu_country=false', () => {
        props.isFinancialStpCardVisible = jest.fn(() => false);
        render(<CFDDemoAccountDisplay {...props} is_logged_in={false} platform='dxtrade' />);

        expect(screen.getByTestId('dt_cfd_demo_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.queryByText('Financial STP')).not.toBeInTheDocument();
        expect(screen.getAllByRole('table').length).toBe(2);
        expect(screen.queryAllByRole('button', { name: /add demo account/i }).length).toBe(0);
    });

    it('should render 1 open DMT5 account with an enabled password reset button, and "Fund top up" & "Trade on web terminal" buttons', () => {
        props.current_list['mt5.demo.financial@p01_ts02'] = mt5_demo_financial_account;
        const { container } = render(<CFDDemoAccountDisplay {...props} />);

        expect(screen.getByTestId('dt_cfd_demo_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('Financial STP')).toBeInTheDocument();
        expect(screen.getAllByRole('table').length).toBe(3);
        expect(screen.getAllByRole('button', { name: /add demo account/i }).length).toBe(2);
        const password_table_cells = screen.getAllByRole('cell', { name: /•••••••••••••••/i });
        expect(password_table_cells.length).toBe(1);
        const change_password_button = within(password_table_cells[0]).getByRole('button');
        const within_financial = within(container.querySelector('#demo-financial'));
        const fund_transfer_button = within_financial.getByRole('button', { name: /fund top up/i });
        const trade_on_web_terminal_button = within_financial.getByRole('link', { name: /trade on web terminal/i });
        expect(trade_on_web_terminal_button).toHaveAttribute(
            'href',
            'https://trade.mql5.com/trade?servers=Deriv-Demo&trade_server=Deriv-Demo&login=20103240'
        );

        fireEvent.click(change_password_button);
        expect(props.openPasswordManager).toHaveBeenCalledTimes(1);

        fireEvent.click(fund_transfer_button);
        expect(props.openAccountTransfer).toHaveBeenCalledWith(props.current_list['mt5.demo.financial@p01_ts02'], {
            category: 'demo',
            type: 'financial',
        });
    });

    it('should disable all "Add demo account" buttons when has_cfd_account_error=true', () => {
        render(<CFDDemoAccountDisplay {...props} has_cfd_account_error />);

        const add_demo_account_buttons = screen.getAllByRole('button', { name: /add demo account/i });
        expect(screen.getByTestId('dt_cfd_demo_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('Financial STP')).toBeInTheDocument();
        expect(add_demo_account_buttons[0]).toBeDisabled();
        expect(add_demo_account_buttons[1]).toBeDisabled();
        expect(add_demo_account_buttons[2]).toBeDisabled();
    });

    it('should show loading when is_loading=true', () => {
        render(<CFDDemoAccountDisplay {...props} is_loading />);

        expect(screen.getByTestId('dt_barspinner')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_cfd_demo_accounts_display')).not.toBeInTheDocument();
        expect(screen.queryByText('Synthetic')).not.toBeInTheDocument();
        expect(screen.queryByText('Financial')).not.toBeInTheDocument();
        expect(screen.queryByText('Financial STP')).not.toBeInTheDocument();
    });

    it('should show special specifications on Financial card when residence="au"', () => {
        const { rerender, container } = render(<CFDDemoAccountDisplay {...props} residence='au' />);

        const within_financial = within(container.querySelector('#demo-financial'));
        expect(within_financial.getByRole('row', { name: /leverage up to 1:30/i })).toBeInTheDocument();
        expect(within_financial.getByRole('row', { name: /margin call 100%/i })).toBeInTheDocument();
        expect(within_financial.getByRole('row', { name: /stop out level 50%/i })).toBeInTheDocument();
        expect(within_financial.getByRole('row', { name: /number of assets 100\+/i })).toBeInTheDocument();

        rerender(<CFDDemoAccountDisplay {...props} platform='dxtrade' />);

        expect(within_financial.getByRole('row', { name: /number of assets 90\+/i })).toBeInTheDocument();
    });

    it('should render enabled "Select" buttons instead of "Add demo account" buttons when has_cfd_account=true', () => {
        render(<CFDDemoAccountDisplay {...props} has_cfd_account />);

        expect(screen.getByTestId('dt_cfd_demo_accounts_display')).toBeInTheDocument();
        expect(screen.queryAllByRole('button', { name: /add demo account/i }).length).toBe(0);

        const select_buttons = screen.getAllByText(/select/i);

        fireEvent.click(select_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'synthetic', category: 'demo' });

        fireEvent.click(select_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial', category: 'demo' });

        fireEvent.click(select_buttons[2]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial_stp', category: 'demo' });
    });
});
