import React, { useEffect } from 'react';
import { routes, WS, cacheTrackEvents } from '@deriv/shared';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import Routes from 'Components/routes/routes';
import classNames from 'classnames';
import './app.scss';
import './temporary-overrides.scss';
import { useHistory } from 'react-router';

const AppContent: React.FC = observer(() => {
    const { ui, traders_hub, client } = useStore();
    const history = useHistory();

    const { is_dark_mode_on, setShouldShowOneTimeDepositModal } = ui;
    const { selected_account_type } = traders_hub;
    const { is_logged_in, is_logging_in } = client;

    /**
     * Trigger one time deposit modal after real account creation
     * if one_time_deposit query param is present
     *
     * Required to trigger after real account creation on OutSystems redirect
     */
    useEffect(() => {
        const url_params = new URLSearchParams(window.location.search);
        const one_time_deposit = url_params.get('one_time_deposit');
        url_params.delete('one_time_deposit');
        if (!is_logging_in && is_logged_in && one_time_deposit) {
            WS?.wait('authorize').then(() => {
                setShouldShowOneTimeDepositModal(true);
                // Remove one_time_deposit query param from URL
                history.push({
                    pathname: routes.traders_hub,
                    search: url_params.toString(),
                });
            });
        }
    }, [is_logging_in, is_logged_in, setShouldShowOneTimeDepositModal, history]);

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
                cacheTrackEvents.loadEvent([
                    {
                        event: {
                            name: 'ce_tradershub_dashboard_form',
                            properties: {
                                action: 'open',
                                form_name: 'traders_hub_default',
                                account_mode: selected_account_type,
                            },
                        },
                    },
                ]);
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
