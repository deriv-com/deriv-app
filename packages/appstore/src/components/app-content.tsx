import React, { useEffect } from 'react';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Analytics } from '@deriv-com/analytics';
import Routes from 'Components/routes/routes';
import classNames from 'classnames';
import './app.scss';

const AppContent: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;

    useEffect(() => {
        Analytics.trackEvent('ce_tradershub_dashboard_form', {
            action: 'open',
            form_name: 'traders_hub_default',
            account_mode: document.getElementById('dropdown-display')?.innerText,
        });
    }, []);

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
