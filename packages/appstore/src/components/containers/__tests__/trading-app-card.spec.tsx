import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import TradingAppCard from '../trading-app-card';
// import { CFD_PLATFORMS, ContentFlag, getStaticUrl } from '@deriv/shared';
// import { getStatusBadgeConfig } from '@deriv/account';

jest.mock('Components/trade-button', () => jest.fn(() => <button>TradeButton</button>));
jest.mock('Components/containers/trading-app-card-actions', () =>
    jest.fn(() => <button>TradingAppCardActions</button>)
);

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
            name: '',
            icon: 'Demo',
            action_type: 'get',
            clickable_icon: false,
            description: '',
            is_deriv_platform: false,
            onAction: jest.fn,
            sub_title: '',
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

    it('should render TradigPlatformIconProps with right icon', () => {
        render(<TradingAppCard {...mocked_props} />, {
            wrapper,
        });

        const icon = screen.queryByTestId(`dt_trading-platform-icon-${mocked_props.icon}`);
        expect(icon).toBeInTheDocument();
    });
});
