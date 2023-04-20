import React from 'react';
import { render, screen } from '@testing-library/react';
import StaticDashboard from '../static-dashboard';
import { StoreProvider, useStore } from '@deriv/stores';
import { ContentFlag } from '@deriv/shared';
import { TRootStore } from 'Types';

describe('<StaticDashboard />', () => {
    type TMockRootStore = Pick<TRootStore, 'client' | 'traders_hub'> & {
        client: {
            is_eu_country: ReturnType<typeof useStore>['client']['is_eu_country'];
            is_logged_in: ReturnType<typeof useStore>['client']['is_logged_in'];
        };
        traders_hub: {
            content_flag: ReturnType<typeof useStore>['traders_hub']['content_flag'];
        };
    };

    const mock_root_store: TMockRootStore = {
        client: {
            is_eu_country: false,
            is_logged_in: true,
        },
        traders_hub: {
            content_flag: ContentFlag.CR_DEMO,
        },
    };

    const is_blurry = {
        icon: true,
        item: false,
        text: false,
        get: false,
        topup: false,
        trade: false,
        cfd_item: false,
        cfd_text: false,
        options_item: false,
        options_text: false,
        cfd_description: false,
        options_description: false,
        platformlauncher: false,
    };

    const is_onboarding_animated = {
        text: false,
        trade: false,
        topup: false,
        button: false,
        get: false,
    };

    it('should render dtrader, mt5financial, mt5synthetic, dbot, smarttrader, binarybot, derivgo, ctrader, and derivx in page if is_eu_country: false', () => {
        render(
            <StoreProvider store={mock_root_store}>
                <StaticDashboard is_blurry={is_blurry} is_onboarding_animated={is_onboarding_animated} />
            </StoreProvider>
        );

        expect(screen.getByTestId('dt_static_dashboard')).toBeInTheDocument();
        expect(screen.getByText('Options & Multipliers'));
        expect(screen.getByTestId('dt_static_dashboard_wrapper_dtrader')).toBeInTheDocument();
        expect(screen.getByTestId('dt_static_dashboard_wrapper_dbot')).toBeInTheDocument();
        expect(screen.getByTestId('dt_static_dashboard_wrapper_smarttrader')).toBeInTheDocument();
        expect(screen.getByTestId('dt_static_dashboard_wrapper_binarybot')).toBeInTheDocument();
        expect(screen.getByTestId('dt_static_dashboard_wrapper_derivgo')).toBeInTheDocument();
        expect(screen.getByText('CFDs'));
        expect(screen.getByTestId('dt_static_dashboard_wrapper_mt5synthetic')).toBeInTheDocument();
        expect(screen.getByTestId('dt_static_dashboard_wrapper_mt5financial')).toBeInTheDocument();
        expect(screen.getByTestId('dt_static_dashboard_wrapper_ctrader')).toBeInTheDocument();
        expect(screen.getByTestId('dt_static_dashboard_wrapper_derivx')).toBeInTheDocument();
    });

    it('should only render mt5financial, and dtrader if is_eu_country: true', () => {
        mock_root_store.client.is_eu_country = true;
        render(
            <StoreProvider store={mock_root_store}>
                <StaticDashboard is_blurry={is_blurry} is_onboarding_animated={is_onboarding_animated} />
            </StoreProvider>
        );

        expect(screen.getByTestId('dt_static_dashboard_wrapper_mt5financial')).toBeInTheDocument();
        expect(screen.getByTestId('dt_static_dashboard_wrapper_dtrader')).toBeInTheDocument();
        expect(screen.queryByText('dt_static_dashboard_wrapper_mt5synthetic')).not.toBeInTheDocument();
        expect(screen.queryByText('dt_static_dashboard_wrapper_dbot')).not.toBeInTheDocument();
        expect(screen.queryByText('dt_static_dashboard_wrapper_smarttrader')).not.toBeInTheDocument();
        expect(screen.queryByText('dt_static_dashboard_wrapper_binarybot')).not.toBeInTheDocument();
        expect(screen.queryByText('dt_static_dashboard_wrapper_derivgo')).not.toBeInTheDocument();
    });
});
