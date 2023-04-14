import React from 'react';
import { render, screen } from '@testing-library/react';
import StaticDashboard from '../static-dashboard';
import { StoreProvider } from '@deriv/stores';

describe('<StaticDashboard />', () => {
    let mockRootStore: any;
    beforeEach(() => {
        mockRootStore = {
            client: {
                is_eu_country: false,
                is_logged_in: true,
            },
            traders_hub: {
                content_flag: 'something',
            },
        };
    });

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
            <StoreProvider store={mockRootStore}>
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
        expect(screen.getByTestId('dt_static_dashboard_wrapper_mt5synhetic')).toBeInTheDocument();
        expect(screen.getByTestId('dt_static_dashboard_wrapper_mt5financial')).toBeInTheDocument();
        expect(screen.getByTestId('dt_static_dashboard_wrapper_ctrader')).toBeInTheDocument();
        expect(screen.getByTestId('dt_static_dashboard_wrapper_derivx')).toBeInTheDocument();
    });
});
