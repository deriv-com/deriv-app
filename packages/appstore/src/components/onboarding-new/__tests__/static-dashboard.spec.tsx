import React from 'react';
import { render, screen } from '@testing-library/react';
import StaticDashboard from '../static-dashboard';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('<StaticDashboard />', () => {
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

    test('should render derivez in page if !CFDs_restricted_countries (non-eu countries)', () => {
        const mock = mockStore({});

        render(
            <StoreProvider store={mock}>
                <StaticDashboard is_blurry={is_blurry} is_onboarding_animated={is_onboarding_animated} />
            </StoreProvider>
        );
        expect(screen.queryByText('Deriv EZ')).toBeInTheDocument();
    });

    test('should not render derivez if CFDs_restricted_countries: true (eu countries)', () => {
        const mock = mockStore({
            traders_hub: {
                CFDs_restricted_countries: true,
            },
        });

        render(
            <StoreProvider store={mock}>
                <StaticDashboard is_blurry={is_blurry} is_onboarding_animated={is_onboarding_animated} />
            </StoreProvider>
        );
        expect(screen.queryByText('Deriv Ez')).not.toBeInTheDocument();
    });
});
