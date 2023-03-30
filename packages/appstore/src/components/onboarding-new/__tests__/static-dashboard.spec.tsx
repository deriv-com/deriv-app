import React from 'react';
// import { StoreProvider } from '@deriv/stores';
// import type { TStores } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import StaticDashboard from '../static-dashboard';

// jest.mock('Stores', () => ({
//     ...jest.requireActual('Stores'),
//     useStores: jest.fn(),
// }));

// const mocked_store_values = {};

const StaticDashboardComponent = StaticDashboard;

describe('StaticDashboard component', () => {
    it('should render <StaticDashboard /> to be in page', () => {
        render(
            <StaticDashboardComponent
                is_blurry={{
                    icon: false,
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
                }}
                is_onboarding_animated={{
                    text: false,
                    trade: false,
                    topup: false,
                    button: false,
                    get: false,
                }}
            />
        );
        expect(screen.getByTestId('dt_static_dashboard')).toBeInTheDocument();
    });

    it('should render Options & Multipliers wrapper', () => {
        render(
            <StaticDashboardComponent
                is_blurry={{
                    icon: false,
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
                }}
                is_onboarding_animated={{
                    text: false,
                    trade: false,
                    topup: false,
                    button: false,
                    get: false,
                }}
            />
        );
        const div_element = screen.getByTestId('dt_static_dashboard');
        expect(div_element).toBeInTheDocument();
    });

    it('should render CFDs wraper', () => {
        render(
            <StaticDashboardComponent
                is_blurry={{
                    icon: false,
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
                }}
                is_onboarding_animated={{
                    text: false,
                    trade: false,
                    topup: false,
                    button: false,
                    get: false,
                }}
            />
        );
        const div_element = screen.getByTestId('dt_static_dashboard');
        expect(div_element).toBeInTheDocument();
    });
});
