import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import MainTitleBar from '..';
import { isDesktop, isMobile } from '@deriv/shared';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

describe('MainTitleBar Desktop', () => {
    beforeEach(() => {
        isDesktop.mockImplementation(() => true);
        isMobile.mockImplementation(() => false);
    });

    it('should render the <RegulatorSwitcher/> when the conditions are met on desktop', () => {
        const mock = mockStore({
            client: {
                is_landing_company_loaded: true,
            },
            traders_hub: {
                content_flag: 'low_risk_cr_eu',
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<MainTitleBar />, { wrapper });
        const regulator_switcher = screen.queryByTestId('dt-regulators-switcher');

        expect(container).toBeInTheDocument();
        expect(regulator_switcher).toBeInTheDocument();
    });

    it('should not render the <RegulatorSwitcher/> when the conditions are not met on desktop', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<MainTitleBar />, { wrapper });
        const regulator_switcher = screen.queryByTestId('dt-regulators-switcher');

        expect(container).toBeInTheDocument();
        expect(regulator_switcher).not.toBeInTheDocument();
    });
});

describe('MainTitleBar Mobile', () => {
    beforeEach(() => {
        isDesktop.mockImplementation(() => false);
        isMobile.mockImplementation(() => true);
    });

    it('should render the the RegulatorSwitcher tab when the conditions are met on mobile', () => {
        const history = createBrowserHistory();
        const mock = mockStore({
            client: {
                is_landing_company_loaded: true,
            },
            traders_hub: {
                content_flag: 'low_risk_cr_non_eu',
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <Router history={history}>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </Router>
        );

        const { container } = render(<MainTitleBar />, { wrapper });
        const regulator_switcher_mobile = screen.queryByTestId('dt-regulators-switcher-mobile');
        const eu_btn = screen.queryByText('EU');
        const non_eu_btn = screen.queryByText('Non-EU');
        const ic_icon_info_outline = screen.queryByTestId('dt-ic-info-outline');

        expect(container).toBeInTheDocument();
        expect(regulator_switcher_mobile).toBeInTheDocument();
        expect(eu_btn).toBeInTheDocument();
        expect(non_eu_btn).toBeInTheDocument();
        expect(ic_icon_info_outline).toBeInTheDocument();
    });

    it('should render the the <RegulatorSwitcherLoader/> when "is_switching" is true on mobile', () => {
        const history = createBrowserHistory();
        const mock = mockStore({
            client: {
                is_landing_company_loaded: true,
                is_switching: true,
            },
            traders_hub: {
                content_flag: 'low_risk_cr_non_eu',
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <Router history={history}>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </Router>
        );

        const { container } = render(<MainTitleBar />, { wrapper });
        const regulator_switcher_mobile = screen.queryByTestId('dt-regulators-switcher-mobile');
        const regulator_switcher_mobile_loader = screen.queryByTestId('dt-regulators-switcher-loading-mobile');
        const eu_btn = screen.queryByText('EU');
        const non_eu_btn = screen.queryByText('Non-EU');
        const ic_icon_info_outline = screen.queryByTestId('dt-ic-info-outline');

        expect(container).toBeInTheDocument();
        expect(regulator_switcher_mobile).toBeInTheDocument();
        expect(regulator_switcher_mobile_loader).toBeInTheDocument();
        expect(eu_btn).not.toBeInTheDocument();
        expect(non_eu_btn).not.toBeInTheDocument();
        expect(ic_icon_info_outline).not.toBeInTheDocument();
    });

    it('should execute function when clicked on one of the tabs on the RegulatorSwitcher tab on mobile', () => {
        const history = createBrowserHistory();
        const mock = mockStore({
            client: {
                is_landing_company_loaded: true,
            },
            traders_hub: {
                content_flag: 'low_risk_cr_non_eu',
                handleTabItemClick: jest.fn(),
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <Router history={history}>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </Router>
        );

        const { container } = render(<MainTitleBar />, { wrapper });
        const regulator_switcher_mobile = screen.queryByTestId('dt-regulators-switcher-mobile');
        const eu_btn = screen.getByText('EU');
        const non_eu_btn = screen.getByText('Non-EU');
        const ic_icon_info_outline = screen.queryByTestId('dt-ic-info-outline');

        expect(container).toBeInTheDocument();
        expect(regulator_switcher_mobile).toBeInTheDocument();
        expect(eu_btn).toBeInTheDocument();
        expect(non_eu_btn).toBeInTheDocument();
        expect(ic_icon_info_outline).toBeInTheDocument();
        userEvent.click(non_eu_btn);
        expect(mock.traders_hub.handleTabItemClick).toBeCalled();
    });

    it('should execute function when clicked on the "Info" icon on the RegulatorSwitcher tab on mobile', () => {
        const history = createBrowserHistory();
        const mock = mockStore({
            client: {
                is_landing_company_loaded: true,
            },
            traders_hub: {
                content_flag: 'low_risk_cr_non_eu',
                handleTabItemClick: jest.fn(),
                toggleRegulatorsCompareModal: jest.fn(),
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <Router history={history}>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </Router>
        );

        const { container } = render(<MainTitleBar />, { wrapper });
        const regulator_switcher_mobile = screen.queryByTestId('dt-regulators-switcher-mobile');
        const eu_btn = screen.getByText('EU');
        const non_eu_btn = screen.getByText('Non-EU');
        const ic_icon_info_outline = screen.getByTestId('dt-ic-info-outline');

        expect(container).toBeInTheDocument();
        expect(regulator_switcher_mobile).toBeInTheDocument();
        expect(eu_btn).toBeInTheDocument();
        expect(non_eu_btn).toBeInTheDocument();
        expect(ic_icon_info_outline).toBeInTheDocument();
        userEvent.click(ic_icon_info_outline);
        expect(mock.traders_hub.toggleRegulatorsCompareModal).toBeCalled();
    });

    it('should not render the RegulatorSwitcher tab when the conditions are not met on mobile', () => {
        const history = createBrowserHistory();
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <Router history={history}>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </Router>
        );

        const { container } = render(<MainTitleBar />, { wrapper });
        const regulator_switcher_mobile = screen.queryByTestId('dt-regulators-switcher-mobile');
        const regulator_switcher_mobile_loader = screen.queryByTestId('dt-regulators-switcher-loading-mobile');
        const eu_btn = screen.queryByText('EU');
        const non_eu_btn = screen.queryByText('Non-EU');

        expect(container).toBeInTheDocument();
        expect(regulator_switcher_mobile).not.toBeInTheDocument();
        expect(regulator_switcher_mobile_loader).not.toBeInTheDocument();
        expect(eu_btn).not.toBeInTheDocument();
        expect(non_eu_btn).not.toBeInTheDocument();
    });
});
