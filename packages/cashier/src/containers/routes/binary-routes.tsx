import React, { useEffect } from 'react';
import { Switch } from 'react-router-dom';

import { Loading } from '@deriv/components';
import { useIsHubRedirectionEnabled } from '@deriv/hooks';
import { getDomainUrl } from '@deriv/shared';
import { useStore } from '@deriv/stores';

import getRoutesConfig from 'Constants/routes-config';

import RouteWithSubRoutes from './route-with-sub-routes';

/** ---------------------------
 * RouteErrorBoundary Component
 -----------------------------*/

type ErrorBoundaryProps = { children: React.ReactNode };
type ErrorBoundaryState = { hasError: boolean; error: unknown | null };

class RouteErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
        if (error && typeof error === 'object' && 'name' in error && (error as Error).name === 'ChunkLoadError') {
            window.location.reload();
        }
        return { hasError: true, error };
    }

    componentDidCatch(error: unknown, info: React.ErrorInfo) {
        // eslint-disable-next-line no-console
        console.error('Error caught in RouteErrorBoundary:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 32, textAlign: 'center' }}>Error loading route: {String(this.state.error)}</div>
            );
        }
        return this.props.children;
    }
}

/** ---------------------------
 * BinaryRoutes Component
 -----------------------------*/

type TBinaryRoutesProps = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

const BinaryRoutes = ({ is_logged_in, is_logging_in }: TBinaryRoutesProps) => {
    const { client } = useStore();
    const {
        has_wallet,
        is_logging_out,
        prevent_redirect_to_hub,
        is_client_store_initialized,
        prevent_single_login,
        setPreventSingleLogin,
    } = client;

    const { isHubRedirectionEnabled, isHubRedirectionLoaded } = useIsHubRedirectionEnabled();

    const domain = getDomainUrl();
    const PRODUCTION_REDIRECT_URL = `https://hub.${domain}/tradershub`;
    const STAGING_REDIRECT_URL = `https://staging-hub.${domain}/tradershub`;

    useEffect(() => {
        if (has_wallet === undefined) {
            // eslint-disable-next-line no-console
            console.error('Unable to retrieve wallet information from API.');
        }

        const shouldRedirectToHub =
            isHubRedirectionEnabled &&
            has_wallet &&
            !is_logging_out &&
            is_logged_in &&
            !prevent_redirect_to_hub &&
            is_client_store_initialized;

        if (shouldRedirectToHub) {
            const redirect_base =
                process.env.NODE_ENV === 'production' ? PRODUCTION_REDIRECT_URL : STAGING_REDIRECT_URL;
            const url_params = new URLSearchParams(window.location.search);
            const account_currency = window.sessionStorage.getItem('account') || url_params.get('account');
            const redirect_url = `${redirect_base}/redirect?action=redirect_to&redirect_to=wallet${
                account_currency ? `&account=${account_currency}` : ''
            }`;

            localStorage.setItem('wallet_redirect_done', 'true');
            window.location.href = redirect_url;
        }

        const shouldStayInApp = !isHubRedirectionEnabled || !has_wallet || prevent_redirect_to_hub;

        if (prevent_single_login && isHubRedirectionLoaded && is_client_store_initialized && shouldStayInApp) {
            setPreventSingleLogin(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isHubRedirectionEnabled,
        isHubRedirectionLoaded,
        has_wallet,
        is_logging_out,
        is_logged_in,
        prevent_redirect_to_hub,
        prevent_single_login,
        is_client_store_initialized,
    ]);

    if (has_wallet && isHubRedirectionLoaded && isHubRedirectionEnabled) {
        return <Loading is_fullscreen />;
    }

    return (
        <RouteErrorBoundary>
            <React.Suspense fallback={<Loading className='cashier__loader' is_fullscreen={false} />}>
                <Switch>
                    {getRoutesConfig().map((route, idx) => (
                        <RouteWithSubRoutes
                            key={idx}
                            {...route}
                            is_logged_in={is_logged_in}
                            is_logging_in={is_logging_in}
                        />
                    ))}
                </Switch>
            </React.Suspense>
        </RouteErrorBoundary>
    );
};

export default BinaryRoutes;
