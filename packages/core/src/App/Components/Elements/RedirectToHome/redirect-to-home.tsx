import React from 'react';

import { deriv_urls, isEmptyObject, isProduction } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

import { WS } from 'Services';

import RedirectToHomePopup from './redirect-to-home-popup';

import './redirect-to-home.scss';

export const REDIRECT_COUNTDOWN_SECONDS = 10;

const SUCCESS_MIGRATION_STATUSES = ['parked', 'already_migrated', 'migration_in_progress'] as const;

type TPopupView = 'prompt' | 'success' | 'error';

const isSuccessfulMigration = (status: unknown): status is (typeof SUCCESS_MIGRATION_STATUSES)[number] =>
    typeof status === 'string' &&
    SUCCESS_MIGRATION_STATUSES.includes(status as (typeof SUCCESS_MIGRATION_STATUSES)[number]);

const RedirectToHome = observer(() => {
    const { client } = useStore();
    const { account_status, is_logged_in, is_authorize, is_client_store_initialized, logout } = client;

    const [popup_view, setPopupView] = React.useState<TPopupView>('prompt');
    const [pending_action, setPendingAction] = React.useState<'migrate' | 'support' | 'home' | null>(null);
    const [error_message, setErrorMessage] = React.useState('');
    const [countdown, setCountdown] = React.useState(REDIRECT_COUNTDOWN_SECONDS);

    const has_redirected_ref = React.useRef(false);

    const is_ready = is_logged_in && is_authorize && is_client_store_initialized;
    const has_unwelcome_status = Boolean(account_status?.cashier_validation?.includes('unwelcome_status'));
    const is_migrating = pending_action === 'migrate';
    const is_contacting_support = pending_action === 'support';
    const is_redirecting = pending_action === 'home';
    const home_url = isProduction() ? deriv_urls.HOME_PRODUCTION : deriv_urls.HOME_STAGING;
    const home_dashboard_url = `${home_url}/dashboard/`;
    const home_support_url = `${home_url}/dashboard/login?live_chat=true`;

    const logoutAndRedirect = React.useCallback(
        (url: string) => {
            if (has_redirected_ref.current) return;
            has_redirected_ref.current = true;
            logout();
            window.location.assign(url);
        },
        [logout]
    );

    React.useEffect(() => {
        if (popup_view !== 'success') return undefined;

        setCountdown(REDIRECT_COUNTDOWN_SECONDS);

        const timer_id = window.setInterval(() => {
            setCountdown(prev_count => {
                if (prev_count <= 1) {
                    window.clearInterval(timer_id);
                    return 0;
                }
                return prev_count - 1;
            });
        }, 1000);

        return () => window.clearInterval(timer_id);
    }, [popup_view]);

    React.useEffect(() => {
        if (popup_view === 'success' && countdown === 0 && !has_redirected_ref.current) {
            setPendingAction('home');
            logoutAndRedirect(home_dashboard_url);
        }
    }, [countdown, home_dashboard_url, logoutAndRedirect, popup_view]);

    const requestClientMigration = React.useCallback(async () => {
        return WS.authorized.send({ client_migration: 1 });
    }, []);

    const handleContinue = React.useCallback(async () => {
        if (pending_action) return;

        setPendingAction('migrate');
        setErrorMessage('');

        let response = await requestClientMigration();

        if (response?.error) {
            response = await requestClientMigration();
        }

        if (isSuccessfulMigration(response?.client_migration)) {
            setPendingAction(null);
            setPopupView('success');
            return;
        }

        setErrorMessage(response?.error?.message || '');
        setPendingAction(null);
        setPopupView('error');
    }, [pending_action, requestClientMigration]);

    const handleContactSupport = React.useCallback(() => {
        if (pending_action) return;
        setPendingAction('support');
        logoutAndRedirect(home_support_url);
    }, [home_support_url, logoutAndRedirect, pending_action]);

    const handleGoToHome = React.useCallback(() => {
        if (pending_action) return;
        setPendingAction('home');
        logoutAndRedirect(home_dashboard_url);
    }, [home_dashboard_url, logoutAndRedirect, pending_action]);

    if (!is_ready || isEmptyObject(account_status) || has_unwelcome_status) return null;

    return (
        <RedirectToHomePopup
            view={popup_view}
            is_migrating={is_migrating}
            is_contacting_support={is_contacting_support}
            is_redirecting={is_redirecting}
            error_message={error_message}
            countdown={countdown}
            onContinue={handleContinue}
            onContactSupport={handleContactSupport}
            onGoNow={handleGoToHome}
        />
    );
});

export default RedirectToHome;
