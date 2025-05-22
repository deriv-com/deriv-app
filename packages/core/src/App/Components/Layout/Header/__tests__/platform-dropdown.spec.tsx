import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { StoreProvider, mockStore } from '@deriv/stores';
import { routes } from '@deriv/shared';
import { PlatformDropdown, PlatformBox } from '../platform-dropdown';

type TMockPlatformDropdown = {
    platform_config: {
        link_to?: string;
        href?: string;
        name: string;
        description: () => string;
    }[];
};

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useIsHubRedirectionEnabled: () => ({
        isHubRedirectionEnabled: false,
    }),
}));

const history = createBrowserHistory();
const store = mockStore({});

const MockPlatformDropdown = ({ platform_config }: TMockPlatformDropdown) => {
    return (
        <Router history={history}>
            <StoreProvider store={store}>
                <PlatformDropdown
                    platform_config={platform_config}
                    app_routing_history={[{ pathname: '' }]}
                    closeDrawer={jest.fn()}
                    setTogglePlatformType={jest.fn()}
                />
            </StoreProvider>
        </Router>
    );
};

describe('PlatformBox component', () => {
    it('should render "icon" and "description"', () => {
        const platform = {
            icon: 'test',
            description: () => 'test description',
        };
        render(<PlatformBox platform={platform} />);
        const icon = screen.getByTestId('dt_platform_box_icon');
        const description = screen.getByText('test description');
        expect(icon).toBeInTheDocument();
        expect(description).toBeInTheDocument();
    });
});

describe('PlatformDropdown component', () => {
    const tradershub_redirect = "Looking for CFDs? Go to Trader's Hub";
    const dtrader_description = 'DTrader description';
    const dtrader_platform_config = {
        link_to: routes.trade,
        name: 'DTrader',
        description: () => 'DTrader description',
    };
    const dtrader_url_params = '?chart_type=area&interval=1t&symbol=1HZ100V&trade_type=accumulator';

    beforeAll(() => (ReactDOM.createPortal = jest.fn(element => element) as jest.Mock));
    afterEach(() => (ReactDOM.createPortal as jest.Mock).mockClear());

    it('should render TradersHubRedirect & proper components based on whether or not "link_to" property is passed', () => {
        const { rerender } = render(<MockPlatformDropdown platform_config={[dtrader_platform_config]} />);
        expect(screen.getByTestId('dt_platform_dropdown')).toBeInTheDocument();
        expect(screen.getByText(tradershub_redirect)).toBeInTheDocument();

        rerender(
            <MockPlatformDropdown
                platform_config={[
                    {
                        ...dtrader_platform_config,
                        link_to: undefined,
                        href: routes.trade,
                    },
                ]}
            />
        );
        expect(screen.getByTestId('dt_platform_dropdown_link')).toBeInTheDocument();
        expect(screen.getByText(tradershub_redirect)).toBeInTheDocument();
    });
    it('should update URL when clicking on another (non-selected) platform', async () => {
        history.push(routes.bot);
        render(<MockPlatformDropdown platform_config={[dtrader_platform_config]} />);

        await userEvent.click(screen.getByText(dtrader_description));
        expect(history.location.pathname).toBe(routes.trade);
        expect(history.location.search).toBe('');
    });
    it('should not update URL when clicking on an already selected platform', async () => {
        history.push(routes.trade + dtrader_url_params);
        render(<MockPlatformDropdown platform_config={[dtrader_platform_config]} />);

        await userEvent.click(screen.getByText(dtrader_description));
        expect(history.location.pathname).toBe(routes.trade);
        expect(history.location.search).toBe(dtrader_url_params);
    });
});
