import React, { useEffect } from 'react';
import { routes } from '@deriv/shared';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Analytics } from '@deriv-com/analytics';
import Routes from 'Components/routes/routes';
import classNames from 'classnames';
import './app.scss';
import './temporary-overrides.scss';

const AppContent: React.FC = observer(() => {
    const { ui, traders_hub, client } = useStore();
    const { is_dark_mode_on } = ui;
    const { selected_account_type } = traders_hub;

    const [is_traders_dashboard_tracking_enabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'ce_tradershub_dashboard_tracking',
        defaultValue: false,
    });

    useEffect(() => {
        client.setTradersHubTracking(is_traders_dashboard_tracking_enabled);
    }, [is_traders_dashboard_tracking_enabled]);

    useEffect(() => {
        if (selected_account_type) {
            if (is_traders_dashboard_tracking_enabled) {
                Analytics.trackEvent('ce_tradershub_dashboard_form', {
                    action: 'open',
                    form_name: 'traders_hub_default',
                    account_mode: selected_account_type,
                });
            }
        }
    }, [selected_account_type]);

    return (
        <main
            className={classNames('dashboard', {
                'theme--light': !is_dark_mode_on,
                'theme--dark': is_dark_mode_on,
                'dashboard-onboarding': window.location.pathname === routes.onboarding,
            })}
        >
            <div className='dw-dashboard'>
                <Routes />
            </div>
        </main>
    );
});

export default AppContent;
