import React from 'react';

import { deriv_urls, isEmptyObject, isProduction } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

import { WS } from 'Services';

import RedirectToHomePopup from './redirect-to-home-popup';

import './redirect-to-home.scss';

export const REDIRECT_COUNTDOWN_SECONDS = 10;
export const MAX_MIGRATION_RECHECKS = 2;

const SUCCESS_MIGRATION_STATUSES = ['parked', 'already_migrated', 'migration_in_progress'] as const;
const PENDING_MIGRATION_STATUSES = ['parked', 'migration_in_progress'] as const;

type TPopupView = 'prompt' | 'success' | 'error';
type TMigrationResponse = {
    client_migration?: string;
    error?: { code?: string; message?: string };
};

const getMigrationStatus = (response: TMigrationResponse | null | undefined): string | undefined => {
    const status = response?.client_migration;
    return typeof status === 'string' ? status : undefined;
};

const isSuccessfulMigration = (status: unknown): status is (typeof SUCCESS_MIGRATION_STATUSES)[number] =>
    typeof status === 'string' &&
    SUCCESS_MIGRATION_STATUSES.includes(status as (typeof SUCCESS_MIGRATION_STATUSES)[number]);

const isPendingMigration = (status: unknown): boolean =>
    typeof status === 'string' &&
    PENDING_MIGRATION_STATUSES.includes(status as (typeof PENDING_MIGRATION_STATUSES)[number]);

const isMigrationParkError = (error?: { code?: string }) => error?.code === 'MigrationParkError';

/** On recheck, any error other than MigrationParkError means migration finished and the account left v1. */
const isMigrationComplete = (response: TMigrationResponse) =>
    getMigrationStatus(response) === 'already_migrated' ||
    (Boolean(response.error) && !isMigrationParkError(response.error));

const RedirectToHome = observer(() => {
    const { client } = useStore();
    const { account_status, is_logged_in, is_authorize, is_client_store_initialized, logout } = client;

    const [popup_view, setPopupView] = React.useState<TPopupView>('prompt');
    const [pending_action, setPendingAction] = React.useState<'migrate' | 'support' | 'home' | null>(null);
    const [error_message, setErrorMessage] = React.useState('');
    const [countdown, setCountdown] = React.useState(REDIRECT_COUNTDOWN_SECONDS);
    const [is_go_now_enabled, setIsGoNowEnabled] = React.useState(false);
    const [is_checking_status, setIsCheckingStatus] = React.useState(false);
    const [is_migration_delayed, setIsMigrationDelayed] = React.useState(false);
    const [poll_cycle, setPollCycle] = React.useState(0);

    const has_redirected_ref = React.useRef(false);
    const is_go_now_enabled_ref = React.useRef(false);
    const is_waiting_for_migration_ref = React.useRef(false);
    const is_checking_status_ref = React.useRef(false);
    const recheck_count_ref = React.useRef(0);

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

    const requestClientMigration = React.useCallback(async () => {
        return WS.authorized.send({ client_migration: 1 }) as Promise<TMigrationResponse>;
    }, []);

    const completeMigrationAndRedirect = React.useCallback(() => {
        is_waiting_for_migration_ref.current = false;
        setIsGoNowEnabled(true);
        is_go_now_enabled_ref.current = true;
        setPendingAction('home');
        logoutAndRedirect(home_dashboard_url);
    }, [home_dashboard_url, logoutAndRedirect]);

    const checkMigrationStatus = React.useCallback(async () => {
        if (has_redirected_ref.current || is_checking_status_ref.current) return;

        is_checking_status_ref.current = true;
        setIsCheckingStatus(true);

        try {
            const response = await requestClientMigration();
            const status = getMigrationStatus(response);

            if (isMigrationParkError(response.error)) {
                is_waiting_for_migration_ref.current = false;
                setErrorMessage(response.error?.message || '');
                setPendingAction(null);
                setPopupView('error');
                return;
            }

            if (isMigrationComplete(response)) {
                completeMigrationAndRedirect();
                return;
            }

            if (isPendingMigration(status)) {
                recheck_count_ref.current += 1;

                if (recheck_count_ref.current >= MAX_MIGRATION_RECHECKS) {
                    is_waiting_for_migration_ref.current = false;
                    setIsMigrationDelayed(true);
                    return;
                }

                setPollCycle(cycle => cycle + 1);
            }
        } finally {
            is_checking_status_ref.current = false;
            setIsCheckingStatus(false);
        }
    }, [completeMigrationAndRedirect, requestClientMigration]);

    React.useEffect(() => {
        if (popup_view !== 'success' || is_migration_delayed) return undefined;

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
    }, [is_migration_delayed, popup_view, poll_cycle]);

    React.useEffect(() => {
        if (
            popup_view !== 'success' ||
            countdown !== 0 ||
            has_redirected_ref.current ||
            is_migration_delayed ||
            is_checking_status_ref.current
        ) {
            return;
        }

        // Pending parked / migration_in_progress: always recheck, never redirect on timer alone.
        if (is_waiting_for_migration_ref.current) {
            checkMigrationStatus();
            return;
        }

        if (is_go_now_enabled_ref.current) {
            setPendingAction('home');
            logoutAndRedirect(home_dashboard_url);
        }
    }, [checkMigrationStatus, countdown, home_dashboard_url, is_migration_delayed, logoutAndRedirect, popup_view]);

    const handleContinue = React.useCallback(async () => {
        if (pending_action) return;

        setPendingAction('migrate');
        setErrorMessage('');

        let response = await requestClientMigration();

        if (response?.error) {
            response = await requestClientMigration();
        }

        const status = getMigrationStatus(response);

        if (isSuccessfulMigration(status)) {
            const is_pending = isPendingMigration(status);
            const can_go_now = status === 'already_migrated';

            is_waiting_for_migration_ref.current = is_pending;
            recheck_count_ref.current = 0;
            setIsMigrationDelayed(false);
            setIsGoNowEnabled(can_go_now);
            is_go_now_enabled_ref.current = can_go_now;
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
        if (pending_action || !is_go_now_enabled || is_waiting_for_migration_ref.current) return;
        setPendingAction('home');
        logoutAndRedirect(home_dashboard_url);
    }, [home_dashboard_url, is_go_now_enabled, logoutAndRedirect, pending_action]);

    if (!is_ready || isEmptyObject(account_status) || has_unwelcome_status) return null;

    return (
        <RedirectToHomePopup
            view={popup_view}
            is_migrating={is_migrating}
            is_contacting_support={is_contacting_support}
            is_redirecting={is_redirecting}
            is_checking_status={is_checking_status}
            is_go_now_enabled={is_go_now_enabled}
            is_migration_delayed={is_migration_delayed}
            error_message={error_message}
            countdown={countdown}
            onContinue={handleContinue}
            onContactSupport={handleContactSupport}
            onGoNow={handleGoToHome}
        />
    );
});

export default RedirectToHome;
