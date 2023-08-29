import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import TradersHubHeader from '../traders-hub-header';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({ location: { pathname: '/appstore/traders-hub' } }),
}));
const mock_use_location = {
    pathname: '/appstore/traders-hub',
};
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => mock_use_location,
}));
jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => 'MockedIcon'),
        StaticUrl: jest.fn(() => 'MockedStaticUrl'),
        Popover: jest.fn(props => <span>{props.message}</span>),
    };
});
jest.mock('App/Components/Routes', () => ({ BinaryLink: 'MockedBinaryLink' }));
jest.mock('App/Components/Layout/Header', () => ({ MenuLinks: 'MockedMenuLinks' }));
jest.mock('App/Containers/RealAccountSignup', () => jest.fn(() => <div>MockedRealAccountSignup</div>));
jest.mock('App/Components/Layout/Header/account-info', () => jest.fn(() => 'MockedAccountInfo'));
jest.mock('App/Components/Layout/Header/toggle-menu-drawer.jsx', () => jest.fn(() => 'MockedToggleMenuDrawer'));
jest.mock('Assets/SvgComponents/header/deriv-rebranding-logo.svg', () => jest.fn(() => 'MockedDerivBrandLogo'));
jest.mock('../../../CurrencySelectionModal', () => jest.fn(() => <div>MockedCurrencySelectionModal</div>));
jest.mock('../show-notifications', () => jest.fn(() => <div>MockedShowNotifications</div>));

describe('TradersHubHeader', () => {
    const store = mockStore({
        client: {
            account_type: 'financial',
            balance: '2000',
            country_standpoint: {},
            currency: 'USD',
            has_any_real_account: true,
            is_eu: false,
            is_logged_in: true,
            is_mt5_allowed: true,
            is_virtual: false,
        },
        common: { platform: 'mt5' },
        traders_hub: {},
        ui: {
            is_accounts_switcher_on: true,
            is_app_disabled: false,
            is_route_modal_on: true,
            account_switcher_disabled_message: 'MockedAccountSwitcherDisabledMessage',
            toggleAccountsDialog: jest.fn(),
            toggleNeedRealAccountForCashierModal: jest.fn(),
            toggleReadyToDepositModal: jest.fn(),
        },
    });
    const renderComponent = (modified_store = store) => {
        return render(
            <StoreProvider store={modified_store}>
                <TradersHubHeader is_acc_switcher_disabled={false} />
            </StoreProvider>
        );
    };

    it('should render "CurrencySelectionModal" as a child component', () => {
        renderComponent();
        expect(screen.getByText('MockedCurrencySelectionModal')).toBeInTheDocument();
    });

    it('should render "RealAccountSignup" as a child component', () => {
        renderComponent();
        expect(screen.getByText('MockedRealAccountSignup')).toBeInTheDocument();
    });

    it('should render "View onboarding" option in the header', () => {
        renderComponent();
        expect(screen.getByText('View onboarding')).toBeInTheDocument();
    });

    it('should render "Notifications" option in the header', () => {
        renderComponent();
        expect(screen.getByText('MockedShowNotifications')).toBeInTheDocument();
    });

    it('should render "Manage account settings" option in the header', () => {
        renderComponent();
        expect(screen.getByText('Manage account settings')).toBeInTheDocument();
    });

    it('should render the Cashier button in mobile view', () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);
        renderComponent();
        expect(screen.getByRole('button', { name: 'Cashier' })).toBeInTheDocument();
    });
});
