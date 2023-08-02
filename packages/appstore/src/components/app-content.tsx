import React from 'react';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import Routes from 'Components/routes/routes';
import classNames from 'classnames';
import './app.scss';

const AppContent: React.FC = observer(() => {
    const { ui } = useStore();

    return (
        <main
            className={classNames('dashboard', {
                'theme--light': !ui.is_dark_mode_on,
                'theme--dark': ui.is_dark_mode_on,
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
