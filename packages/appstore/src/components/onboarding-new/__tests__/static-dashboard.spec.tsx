import React from 'react';
import { ContentFlag } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import StaticDashboard, { TStaticDashboard } from '../static-dashboard';

describe('StaticDashboard', () => {
    const render_container = (mock_store_override = {}) => {
        const mock_store = mockStore(mock_store_override);
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );
        const mock_props: TStaticDashboard = {
            is_blurry: {
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
            },
            is_onboarding_animated: {
                text: false,
                trade: false,
                topup: false,
                button: false,
                get: false,
            },
        };
        return render(<StaticDashboard {...mock_props} />, {
            wrapper,
        });
    };

    it('should display the component', () => {
        const { container } = render_container();
        expect(container).toBeInTheDocument();
    });

    it('should display both CFDs and Multipliers section', () => {
        render_container();
        const dashboard_sections = screen.getByTestId('dt_onboarding_dashboard');
        expect(dashboard_sections?.textContent?.match(/Multipliers/)).not.toBeNull();
        expect(dashboard_sections?.textContent?.match(/CFDs/)).not.toBeNull();
    });

    it('should display Multipliers and CFDs section in order if the user is non eu', () => {
        render_container({
            client: { is_logged_in: true },
            traders_hub: { content_flag: ContentFlag.LOW_RISK_CR_NON_EU },
        });
        const dashboard_sections = screen.getByTestId('dt_onboarding_dashboard');
        expect(dashboard_sections).not.toHaveClass('static-dashboard--eu');
    });

    it('should display Multipliers and CFDs section in reverse order if the user is eu', () => {
        render_container({ client: { is_logged_in: true }, traders_hub: { content_flag: ContentFlag.EU_REAL } });
        const dashboard_sections = screen.getByTestId('dt_onboarding_dashboard');
        expect(dashboard_sections).toHaveClass('static-dashboard--eu');
    });
});
