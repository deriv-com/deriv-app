import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountActions } from '../account-actions';
import { useLocation } from 'react-router-dom';
import { useStore } from '@deriv/stores';
import { formatMoney, isTabletOs, routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';

// Mock dependencies
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}));

jest.mock('@deriv/stores', () => ({
    useStore: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    formatMoney: jest.fn(),
    isTabletOs: false,
    routes: {
        cashier: '/cashier',
        personal_details: '/account/personal-details',
    },
}));

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(),
}));

// Mock child components
jest.mock('../login-button.jsx', () => ({
    LoginButton: () => <div data-testid='dt_login_button'>Login Button</div>,
}));

jest.mock('../signup-button.jsx', () => ({
    SignupButton: () => <div data-testid='dt_signup_button'>Signup Button</div>,
}));

jest.mock('../toggle-notifications.jsx', () => ({
    __esModule: true,
    default: ({
        count,
        is_visible,
        toggleDialog,
    }: {
        count?: number;
        is_visible?: boolean;
        toggleDialog?: () => void;
    }) => (
        <div data-testid='dt_toggle_notifications' onClick={toggleDialog}>
            Toggle Notifications {count} {is_visible ? 'visible' : 'hidden'}
        </div>
    ),
}));

jest.mock('../../../Routes/index.js', () => ({
    BinaryLink: ({ children, to }: { children: React.ReactNode; to: string }) => (
        <a href={to} data-testid='dt_binary_link'>
            {children}
        </a>
    ),
}));

jest.mock('App/Components/Layout/Header/account-info.jsx', () => ({
    __esModule: true,
    default: ({
        acc_switcher_disabled_message,
        account_type,
        balance,
        is_disabled,
        is_eu,
        is_virtual,
        currency,
        is_dialog_on,
        toggleDialog,
    }: {
        acc_switcher_disabled_message?: string;
        account_type?: string;
        balance?: string | number;
        is_disabled?: boolean;
        is_eu?: boolean;
        is_virtual?: boolean;
        currency?: string;
        is_dialog_on?: boolean;
        toggleDialog?: () => void;
    }) => (
        <div
            data-testid='dt_account_info'
            onClick={toggleDialog}
            className={`${is_disabled ? 'disabled' : ''} ${is_virtual ? 'virtual' : ''}`}
        >
            Account Info: {account_type} {balance} {currency} {is_dialog_on ? 'open' : 'closed'}
        </div>
    ),
}));

describe('AccountActions component', () => {
    // Default props
    const default_props = {
        acc_switcher_disabled_message: 'Account switcher disabled',
        account_type: 'real',
        balance: 1000,
        currency: 'USD',
        disableApp: jest.fn(),
        enableApp: jest.fn(),
        is_acc_switcher_on: false,
        is_acc_switcher_disabled: false,
        is_eu: false,
        is_notifications_visible: false,
        is_logged_in: true,
        is_traders_hub_routes: false,
        is_virtual: false,
        notifications_count: 0,
        onClickDeposit: jest.fn(),
        toggleAccountsDialog: jest.fn(),
        toggleNotifications: jest.fn(),
        openRealAccountSignup: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useLocation as jest.Mock).mockReturnValue({ pathname: '/some-path' });
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (formatMoney as jest.Mock).mockImplementation((currency, balance) => `${balance} ${currency}`);
    });

    it('should render LoggedOutView when is_logged_in is false', () => {
        render(<AccountActions {...default_props} is_logged_in={false} />);

        expect(screen.getByTestId('dt_login_button')).toBeInTheDocument();
        expect(screen.getByTestId('dt_signup_button')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_account_info')).not.toBeInTheDocument();
    });

    it('should render CurrencyButton when currency is not provided and not virtual', () => {
        render(<AccountActions {...default_props} currency='' />);

        expect(screen.getByText('Set currency')).toBeInTheDocument();
        expect(screen.queryByText('Deposit')).not.toBeInTheDocument();
    });

    it('should render DepositButton when currency is provided and not on traders hub or cashier', () => {
        render(<AccountActions {...default_props} />);

        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.queryByText('Set currency')).not.toBeInTheDocument();
    });

    it('should not render DepositButton when on cashier page', () => {
        (useLocation as jest.Mock).mockReturnValue({ pathname: '/cashier/deposit' });

        render(<AccountActions {...default_props} />);

        expect(screen.queryByText('Deposit')).not.toBeInTheDocument();
    });

    it('should not render DepositButton when on traders hub routes', () => {
        render(<AccountActions {...default_props} is_traders_hub_routes={true} />);

        expect(screen.queryByText('Deposit')).not.toBeInTheDocument();
    });

    it('should not render DepositButton on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<AccountActions {...default_props} />);

        expect(screen.queryByText('Deposit')).not.toBeInTheDocument();
    });

    it('should render AccountInfo when not on traders hub routes', () => {
        render(<AccountActions {...default_props} />);

        expect(screen.getByTestId('dt_account_info')).toBeInTheDocument();
    });

    it('should not render AccountInfo when on traders hub routes', () => {
        render(<AccountActions {...default_props} is_traders_hub_routes={true} />);

        expect(screen.queryByTestId('dt_account_info')).not.toBeInTheDocument();
    });

    it('should render NotificationsToggle with correct props', () => {
        render(<AccountActions {...default_props} notifications_count={5} is_notifications_visible={true} />);

        const notifications = screen.getByTestId('dt_toggle_notifications');
        expect(notifications).toBeInTheDocument();
        expect(notifications).toHaveTextContent(/Toggle Notifications 5 visible/);
    });

    it('should call toggleNotifications when NotificationsToggle is clicked', async () => {
        render(<AccountActions {...default_props} />);

        const notifications = screen.getByTestId('dt_toggle_notifications');
        await userEvent.click(notifications);

        expect(default_props.toggleNotifications).toHaveBeenCalledTimes(1);
    });

    it('should render AccountSettingsToggle when not on mobile', () => {
        render(<AccountActions {...default_props} />);

        expect(screen.getByTestId('dt_binary_link')).toBeInTheDocument();
    });

    it('should not render AccountSettingsToggle on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<AccountActions {...default_props} />);

        expect(screen.queryByTestId('dt_binary_link')).not.toBeInTheDocument();
    });

    it('should call onClickDeposit when DepositButton is clicked', async () => {
        render(<AccountActions {...default_props} />);

        const deposit_button = screen.getByText('Deposit');
        await userEvent.click(deposit_button);

        expect(default_props.onClickDeposit).toHaveBeenCalledTimes(1);
    });

    it('should call openRealAccountSignup when CurrencyButton is clicked', async () => {
        render(<AccountActions {...default_props} currency='' />);

        const currency_button = screen.getByText('Set currency');
        await userEvent.click(currency_button);

        expect(default_props.openRealAccountSignup).toHaveBeenCalledWith('set_currency');
    });

    it('should call toggleAccountsDialog when AccountInfo is clicked', async () => {
        render(<AccountActions {...default_props} />);

        const account_info = screen.getByTestId('dt_account_info');
        await userEvent.click(account_info);

        expect(default_props.toggleAccountsDialog).toHaveBeenCalledTimes(1);
    });

    it('should render AccountInfo with formatted balance', () => {
        render(<AccountActions {...default_props} balance={1234.56} currency='EUR' />);

        expect(screen.getByTestId('dt_account_info')).toHaveTextContent(/1234\.56 EUR/);
    });
});
