import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useIsRealAccountNeededForCashier } from '@deriv/hooks';
import { getStaticUrl, isMobile, PlatformContext, routes } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { MenuLink } from 'App/Components/Layout/Header/menu-link';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T,>(Component: T) =>
            Component,
}));
jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div>Mock Link Icon</div>),
    };
});
jest.mock('@deriv/hooks', () => {
    const original_module = jest.requireActual('@deriv/hooks');
    return {
        ...original_module,
        useIsRealAccountNeededForCashier: jest.fn(() => false),
    };
});
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    getStaticUrl: jest.fn(() => 'MockUrl'),
}));

describe('MenuLink', () => {
    const mockRootStore = mockStore({});
    let mock_props: React.ComponentProps<typeof MenuLink>;
    beforeEach(() => {
        mock_props = {
            link_to: '',
            data_testid: 'dt_menu_link',
            text: 'Mock text',
            onClickLink: jest.fn(),
        };
    });

    const renred_check = () => {
        expect(screen.getByText('Mock Link Icon')).toBeInTheDocument();
        expect(screen.getByText('Mock text')).toBeInTheDocument();
    };

    it('should render no links with icon and text without passing link_to', () => {
        render(<MenuLink {...mock_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        renred_check();
        const link = screen.getByTestId('dt_menu_link');
        expect(link.onclick).toBeFalsy();
    });
    it('should render menu link if deriv_static_url', () => {
        const history = createBrowserHistory();
        mock_props.link_to = 'MockLink';

        render(<MenuLink {...mock_props} />, {
            wrapper: ({ children }) => (
                <StoreProvider store={mockRootStore}>
                    <Router history={history}>{children}</Router>
                </StoreProvider>
            ),
        });

        renred_check();
        const link = screen.getByTestId('dt_menu_link');
        userEvent.click(link);
        expect(mock_props.onClickLink).toHaveBeenCalled();
    });
    it('should render with passing link_to', () => {
        (getStaticUrl as jest.Mock).mockReturnValue('');
        const history = createBrowserHistory();
        mock_props.link_to = 'MockLink';

        render(<MenuLink {...mock_props} />, {
            wrapper: ({ children }) => (
                <StoreProvider store={mockRootStore}>
                    <Router history={history}>{children}</Router>
                </StoreProvider>
            ),
        });

        renred_check();
        const link = screen.getByTestId('dt_menu_link');
        userEvent.click(link);
        expect(mock_props.onClickLink).toHaveBeenCalled();
    });
    it('should not render if  is_hidden is passed', () => {
        mock_props.is_hidden = true;

        render(<MenuLink {...mock_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.queryByText('Mock Link Icon')).not.toBeInTheDocument();
        expect(screen.queryByText('Mock text')).not.toBeInTheDocument();
        const link = screen.queryByTestId('dt_menu_link');
        expect(link).not.toBeInTheDocument();
    });
    it('should render menu link for mobile and two icons with passed suffix_icon', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        mock_props.link_to = '/account/languages';
        mock_props.suffix_icon = 'suffix_icon';

        render(<MenuLink {...mock_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        const icons = screen.getAllByText('Mock Link Icon');
        expect(icons.length).toBe(2);
        const link = screen.getByTestId('dt_menu_link');
        expect(link).toBeInTheDocument();
        userEvent.click(link);
        expect(mockRootStore.common.setMobileLanguageMenuOpen).toHaveBeenCalled();
    });
    it('should render menu link for cashier for real account on traders hub', () => {
        (useIsRealAccountNeededForCashier as jest.Mock).mockReturnValue(true);
        mock_props.link_to = '/cashier/deposit';
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { pathname: routes.traders_hub },
        });

        render(<MenuLink {...mock_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        renred_check();
        const link = screen.getByTestId('dt_menu_link');
        userEvent.click(link);
        expect(mockRootStore.ui.toggleNeedRealAccountForCashierModal).toHaveBeenCalled();
        expect(mock_props.onClickLink).toHaveBeenCalled();
    });
    it('should render menu link for cashier for virtual account on traders hub', () => {
        (useIsRealAccountNeededForCashier as jest.Mock).mockReturnValue(false);
        mockRootStore.client.is_virtual = true;
        mock_props.link_to = '/cashier/deposit';
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { pathname: routes.traders_hub },
        });

        render(<MenuLink {...mock_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        renred_check();
        const link = screen.getByTestId('dt_menu_link');
        userEvent.click(link);
        expect(mockRootStore.ui.toggleReadyToDepositModal).toHaveBeenCalled();
        expect(mock_props.onClickLink).toHaveBeenCalled();
    });
});
