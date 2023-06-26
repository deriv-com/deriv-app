import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import TradingAppCard from '../trading-app-card';
import userEvent from '@testing-library/user-event';

jest.mock('Components/trade-button', () => jest.fn(() => <button>TradeButton</button>));
jest.mock('Components/containers/trading-app-card-actions', () =>
    jest.fn(props => (
        <>
            <button onClick={props.onAction}>TradingAppCardActions</button>
            <a href={props.link_to}>TradingAppCardActions Link</a>
        </>
    ))
);
jest.mock('Assets/svgs/trading-platform', () =>
    jest.fn(props => (
        <span data-testid={`dt_trading-platform-icon-${props.onClick ? 'function' : 'none'}`}>
            trading-platform-icon__{props.icon}
        </span>
    ))
);
jest.mock('Constants/platform-config');

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({ icon: 'getStatusBadgeConfig-icon', text: 'getStatusBadgeConfig-text' })),
}));

describe('TradingAppCard', () => {
    let mock = mockStore({});
    let mocked_props: React.ComponentProps<typeof TradingAppCard>;
    beforeEach(() => {
        mocked_props = {
            availability: 'All',
            name: 'Test Name',
            icon: 'Demo',
            action_type: 'get',
            description: 'Test Description',
            onAction: jest.fn(),
            sub_title: 'Test Subtitle',
            has_divider: false,
            platform: 'mt5',
            short_code_and_region: 'svg',
            mt5_acc_auth_status: '',
            selected_mt5_jurisdiction: { platform: 'mt5', category: '', jurisdiction: 'svg' },
            openFailedVerificationModal: jest.fn(),
        };

        mock = mockStore({
            modules: {
                cfd: {
                    is_account_being_created: true,
                },
            },
        });
    });

    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    it('Should render container with proper class', () => {
        const { container } = render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        expect(container.childNodes[0]).toHaveClass('trading-app-card');
    });

    it('Should render TradingPlatformIcon with onClick === undefined', () => {
        mocked_props.clickable_icon = false;

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const icon = screen.getByTestId('dt_trading-platform-icon-none');
        expect(icon).toBeInTheDocument();
    });

    it('Should render TradingPlatformIcon with onClick === function', () => {
        mocked_props.clickable_icon = true;

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const icon = screen.getByTestId('dt_trading-platform-icon-function');
        expect(icon).toBeInTheDocument();
    });

    it('Should render all the details correctly', () => {
        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const title = screen.queryByText(/Test Name/i);
        const subTitle = screen.queryByText(/Test Subtitle/i);
        const description = screen.queryByText(/Test Description/i);
        const shortCodeAndRegion = screen.queryByText('svg');
        expect(title).toBeInTheDocument();
        expect(subTitle).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(shortCodeAndRegion).toBeInTheDocument();
    });

    it('Should render Demo subtitle for demo account', () => {
        mock = mockStore({
            modules: {
                cfd: {
                    is_account_being_created: true,
                },
            },
            traders_hub: {
                is_real: false,
            },
        });

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const demo_text = screen.queryByText(/Test Subtitle Demo/i);
        expect(demo_text).toBeInTheDocument();
    });

    it('Should render NOT Demo subtitle for real account', () => {
        mock = mockStore({
            modules: {
                cfd: {
                    is_account_being_created: true,
                },
            },
            traders_hub: {
                is_real: true,
            },
        });

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const demo_subtitle_text = screen.queryByText(/Test Subtitle Demo/i);
        expect(demo_subtitle_text).not.toBeInTheDocument();
        const subtitle_text = screen.queryByText(/Test Subtitle/i);
        expect(subtitle_text).toBeInTheDocument();
    });

    it('Should NOT render subtitle', () => {
        mocked_props.sub_title = '';

        mock = mockStore({
            modules: {
                cfd: {
                    is_account_being_created: true,
                },
            },
            traders_hub: {
                is_real: false,
            },
        });

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const subtitle_text = screen.queryByText(/Test Subtitle/i);
        expect(subtitle_text).not.toBeInTheDocument();
    });

    it('Should render name', () => {
        mock = mockStore({
            modules: {
                cfd: {
                    is_account_being_created: true,
                },
            },
            traders_hub: {
                is_real: true,
            },
        });

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const name_text = screen.queryByText(/Test Name/i);
        expect(name_text).toBeInTheDocument();
        const demo_name_text = screen.queryByText(/Test Name Demo/i);
        expect(demo_name_text).not.toBeInTheDocument();
    });

    it('Should render DEMO name', () => {
        mocked_props.sub_title = '';

        mock = mockStore({
            modules: {
                cfd: {
                    is_account_being_created: true,
                },
            },
            traders_hub: {
                is_real: false,
            },
        });

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const demo_name_text = screen.queryByText(/Test Name Demo/i);
        expect(demo_name_text).toBeInTheDocument();
    });

    it('Should render general color when action_type !== trade', () => {
        mocked_props.action_type = 'get';

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const name_text = screen.queryByText(/Test Name/i);
        const style = name_text?.getAttribute('style');
        expect(style?.indexOf('--text-color: var(--text-general)')).toBeGreaterThanOrEqual(0);
        expect(style?.indexOf('--text-color: var(--text-prominent)')).toBe(-1);
    });

    it('Should render prominent color when action_type === trade', () => {
        mocked_props.action_type = 'trade';

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const name_text = screen.queryByText(/Test Name/i);
        const style = name_text?.getAttribute('style');
        expect(style?.indexOf('--text-color: var(--text-prominent)')).toBeGreaterThanOrEqual(0);
        expect(style?.indexOf('--text-color: var(--text-general)')).toBe(-1);
    });

    it('Should render TradingPlatformIcon with right icon', () => {
        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const icon = screen.queryByText(`trading-platform-icon__${mocked_props.icon}`);
        expect(icon).toBeInTheDocument();
    });

    it('Should render a clickable icon when clickable_icon is true', () => {
        mocked_props.clickable_icon = true;

        const { container } = render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        expect(container.childNodes[0]).toHaveClass('trading-app-card');
        expect(container.childNodes[0].childNodes[0]).toHaveClass('trading-app-card__icon--container__clickable');
    });

    it('Should call onAction when action button is clicked', () => {
        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const button = screen.getByText('TradingAppCardActions');
        userEvent.click(button);
        expect(mocked_props.onAction).toHaveBeenCalledTimes(1);
    });

    it('Should render the correct app description and link', () => {
        mocked_props.name = 'Test Appstore Name';

        mock = mockStore({
            modules: {
                cfd: {
                    is_account_being_created: true,
                },
            },
            traders_hub: {
                is_eu_user: false,
            },
        });

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const description = screen.getByText(/getAppstorePlatforms description/i);
        expect(description).toBeInTheDocument();

        const link = screen.getByText('TradingAppCardActions Link');
        expect(link).toHaveAttribute('href', 'getAppstorePlatforms.com');
    });

    it('Should render the correct app description and link for MF', () => {
        mocked_props.name = 'Test Appstore Name';

        mock = mockStore({
            modules: {
                cfd: {
                    is_account_being_created: true,
                },
            },
            traders_hub: {
                is_eu_user: true,
                content_flag: 'eu_real',
                is_demo_low_risk: false,
            },
        });

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });
        const description = screen.getByText(/getMFAppstorePlatforms description/i);
        expect(description).toBeInTheDocument();

        const link = screen.getByText('TradingAppCardActions Link');
        expect(link).toHaveAttribute('href', 'getMFAppstorePlatforms.com');
    });

    it('Should render StatusBadge component', () => {
        mocked_props.mt5_acc_auth_status = 'pending';

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const text = screen.queryByText(/getStatusBadgeConfig-text/i);
        expect(text).toBeInTheDocument();
    });

    it('Should NOT render StatusBadge component', () => {
        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const text = screen.queryByText(/getStatusBadgeConfig-text/i);
        expect(text).not.toBeInTheDocument();
    });
});
