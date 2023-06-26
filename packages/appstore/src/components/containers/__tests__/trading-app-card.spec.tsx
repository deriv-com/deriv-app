import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import TradingAppCard from '../trading-app-card';
import userEvent from '@testing-library/user-event';
import TradingPlatformIcon from 'Assets/svgs/trading-platform';
// import { CFD_PLATFORMS, ContentFlag, getStaticUrl } from '@deriv/shared';
// import { getStatusBadgeConfig } from '@deriv/account';

jest.mock('Components/trade-button', () => jest.fn(() => <button>TradeButton</button>));
jest.mock('Components/containers/trading-app-card-actions', () =>
    jest.fn(() => <button>TradingAppCardActions</button>)
);
jest.mock('Assets/svgs/trading-platform', () => jest.fn(props => <span>trading-platform-icon__{props.icon}</span>));

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({ icon: '', text: '' })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
}));

const mock = mockStore({
    modules: {
        cfd: {
            is_account_being_created: true,
        },
    },
});

describe('TradingAppCard', () => {
    let mocked_props: React.ComponentProps<typeof TradingAppCard>;
    beforeEach(() => {
        mocked_props = {
            availability: 'All',
            name: 'Test Name',
            icon: 'Demo',
            action_type: 'get',
            clickable_icon: true,
            description: 'Test Description',
            is_deriv_platform: false,
            onAction: jest.fn,
            sub_title: 'Test Subtitle',
            has_divider: false,
            platform: 'mt5', // 'dxtrade' | 'mt5' | 'derivez'
            short_code_and_region: 'svg',
            mt5_acc_auth_status: '',
            selected_mt5_jurisdiction: { platform: 'mt5', category: '', jurisdiction: 'svg' },
            openFailedVerificationModal: jest.fn,
        };
    });

    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    // <TradingAppCard
    //                             action_type={existing_account.action_type}
    //                             availability={selected_region}
    //                             clickable_icon
    //                             icon={existing_account.icon}
    //                             sub_title={existing_account?.sub_title}
    //                             name={!has_mt5_account_status ? existing_account?.name : ''}
    //                             short_code_and_region={existing_account?.short_code_and_region}
    //                             platform={existing_account.platform}
    //                             description={existing_account.description}
    //                             key={existing_account.key}
    //                             has_divider={(!is_eu_user || is_demo) && getHasDivider(index, list_size, 3)}
    //                             onAction={(e?: React.MouseEvent<HTMLButtonElement>) => {
    //                                 if (existing_account.action_type === 'get') {
    //                                     if (real_account_creation_unlock_date && no_real_mf_account_eu_regulator) {
    //                                         setShouldShowCooldownModal(true);
    //                                     } else if (no_real_cr_non_eu_regulator || no_real_mf_account_eu_regulator) {
    //                                         openDerivRealAccountNeededModal();
    //                                     } else {
    //                                         setAccountType({
    //                                             category: selected_account_type,
    //                                             type: existing_account.market_type,
    //                                         });
    //                                         setAppstorePlatform(existing_account.platform);
    //                                         getAccount();
    //                                     }
    //                                 } else if (existing_account.action_type === 'multi-action') {
    //                                     const button_name = e?.currentTarget?.name;
    //                                     if (button_name === 'transfer-btn') {
    //                                         toggleAccountTransferModal();
    //                                         setSelectedAccount(existing_account);
    //                                     } else if (button_name === 'topup-btn') {
    //                                         showTopUpModal(existing_account);
    //                                         setAppstorePlatform(existing_account.platform);
    //                                     } else {
    //                                         startTrade(existing_account.platform, existing_account);
    //                                     }
    //                                 }
    //                             }}
    //                             mt5_acc_auth_status={has_mt5_account_status}
    //                             selected_mt5_jurisdiction={{
    //                                 platform: existing_account.platform,
    //                                 category: selected_account_type,
    //                                 type: existing_account.market_type,
    //                                 jurisdiction: existing_account.landing_company_short,
    //                             }}
    //                             openFailedVerificationModal={openFailedVerificationModal}
    //                         />

    it('should render container with proper class', () => {
        const { container } = render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        expect(container.childNodes[0]).toHaveClass('trading-app-card');
    });

    it('should render TradingPlatformIcon with right icon', () => {
        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        // const icon = screen.queryByTestId(`dt_trading-platform-icon-${mocked_props.icon}`);
        const icon = screen.queryByText(`trading-platform-icon__${mocked_props.icon}`);
        expect(icon).toBeInTheDocument();
    });

    // it('should render TradingPlatformIcon with right icon 2', async () => {
    //     mocked_props.clickable_icon = false;
    //     const props: React.ComponentProps<typeof TradingPlatformIcon> = {
    //         icon: mocked_props.icon,
    //         onClick: undefined,
    //         // onClick: jest.fn,
    //         size: 48,
    //         // className: '',
    //     };
    //     // const testSpy = jest.spyOn(TradingPlatformIcon);

    //     const { container } = render(<TradingAppCard {...mocked_props} />, {
    //         wrapper,
    //     });

    //     expect(TradingPlatformIcon).toHaveBeenLastCalledWith(props);
    // });

    it('should render all the details correctly', () => {
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

    it('should render Demo subtitle for demo account', () => {
        mock.traders_hub.is_real = false;

        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const demo_text = screen.queryByText(/Test Subtitle Demo/i);
        expect(demo_text).toBeInTheDocument();
    });

    it('should render a clickable icon when clickable_icon is true', () => {
        // render(<TradingAppCard {...defaultProps} clickable_icon={true} />);
        mocked_props.clickable_icon = true;
        // render(<TradingAppCard {...mocked_props} />, {
        //     wrapper,
        // });

        const { container } = render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        expect(container.childNodes[0]).toHaveClass('trading-app-card');
        expect(container.childNodes[0].childNodes[0]).toHaveClass('trading-app-card__icon--container__clickable');

        // const icon = screen.getByTestId('test-icon');
        // expect(icon).toHaveClass('trading-app-card__icon--container__clickable');
    });

    // it('should call onAction when action button is clicked', () => {
    //     // render(<TradingAppCard {...defaultProps} />);
    //     render(<TradingAppCard {...mocked_props} />, {
    //         wrapper,
    //     });

    //     const button = screen.getByText('Trade');
    //     button.click();
    //     expect(mocked_props.onAction).toHaveBeenCalledTimes(1);
    // });

    // it('should render the correct app description and link', () => {
    //     const appstorePlatforms = [
    //         {
    //             name: 'Test App',
    //             app_desc: 'Test App Description',
    //             link_to: 'https://test-app.com',
    //             is_external: true,
    //             new_tab: true,
    //         },
    //     ];

    //     render(<TradingAppCard {...mocked_props} />, {
    //         wrapper,
    //     });

    //     // render(<TradingAppCard {...defaultProps} is_eu_user={false} appstorePlatforms={appstorePlatforms} />);
    //     const description = screen.queryByText('Test App Description');
    //     expect(description).toBeInTheDocument();
    //     const link = screen.getByText('Trade now');
    //     expect(link).toHaveAttribute('href', 'https://test-app.com');
    //     expect(link).toHaveAttribute('target', '_blank');
    // });
});
