import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import WS from 'Services/ws-methods';
import { DesktopWrapper, MobileWrapper, ThemedScrollbars } from '@deriv/components';
import { CookieStorage, isMobile, TRACKING_STATUS_KEY, PlatformContext, platforms, routes } from '@deriv/shared';
import { RudderStack } from '@deriv/analytics';
import { connect } from 'Stores/connect';
import CookieBanner from '../../Components/Elements/CookieBanner/cookie-banner.jsx';
import { useStore } from '@deriv/stores';
import { getLanguage } from '@deriv/translations';

const tracking_status_cookie = new CookieStorage(TRACKING_STATUS_KEY);

const AppContents = ({
    children,
    is_app_disabled,
    is_cashier_visible,
    is_dark_mode,
    is_eu_country,
    is_logged_in,
    is_logging_in,
    is_cfd_page,
    is_positions_drawer_on,
    is_route_modal_on,
    notifyAppInstall,
    platform,
    pushDataLayer,
    setAppContentsScrollRef,
}) => {
    const [show_cookie_banner, setShowCookieBanner] = React.useState(false);
    const [is_gtm_tracking, setIsGtmTracking] = React.useState(false);
    const { is_appstore } = React.useContext(PlatformContext);
    const {
        client: { user_id },
    } = useStore();

    const tracking_status = tracking_status_cookie.get(TRACKING_STATUS_KEY);

    const scroll_ref = React.useRef(null);

    React.useEffect(() => {
        // rudderstack page view trigger
        WS.wait('authorize').then(() => {
            RudderStack.identifyEvent(user_id, {
                language: getLanguage().toLowerCase() || 'en',
            });
            const current_page = window.location.hostname + window.location.pathname;
            RudderStack.pageView(current_page);
        });

        if (scroll_ref.current) setAppContentsScrollRef(scroll_ref);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const allow_tracking = !is_eu_country || tracking_status === 'accepted';
        if (allow_tracking && !is_gtm_tracking) {
            pushDataLayer({ event: 'allow_tracking' });
            setIsGtmTracking(true);
        }
    }, [is_gtm_tracking, is_eu_country, pushDataLayer, tracking_status]);

    React.useEffect(() => {
        if (!tracking_status && !is_logged_in && !is_logging_in) {
            WS.wait('website_status').then(() => {
                setShowCookieBanner(is_eu_country);
            });
        }
    }, [tracking_status, is_logged_in, is_eu_country, is_logging_in]);

    React.useEffect(() => {
        const handleInstallPrompt = e => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            // Update UI notify the user they can install the PWA
            notifyAppInstall(e);
        };
        window.addEventListener('beforeinstallprompt', handleInstallPrompt);

        return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    }, [notifyAppInstall]);

    // handle accept/decline cookies
    const onAccept = () => {
        tracking_status_cookie.set(TRACKING_STATUS_KEY, 'accepted', { sameSite: 'none', secure: true });
        pushDataLayer({ event: 'allow_tracking' });
        setShowCookieBanner(false);
        setIsGtmTracking(true);
    };

    const onDecline = () => {
        tracking_status_cookie.set(TRACKING_STATUS_KEY, 'declined', { sameSite: 'none', secure: true });
        setShowCookieBanner(false);
    };

    return (
        <div
            id='app_contents'
            className={classNames('app-contents', {
                'app-contents--show-positions-drawer': is_positions_drawer_on,
                'app-contents--is-disabled': is_app_disabled,
                'app-contents--is-mobile': isMobile(),
                'app-contents--is-route-modal': is_route_modal_on,
                'app-contents--is-scrollable': is_cfd_page || is_cashier_visible,
                'app-contents--is-dashboard': is_appstore,
                'app-contents--is-hidden': platforms[platform],
                'app-contents--is-onboarding': window.location.pathname === routes.onboarding,
            })}
            ref={scroll_ref}
        >
            <MobileWrapper>{children}</MobileWrapper>
            <DesktopWrapper>
                {/* Calculate height of user screen and offset height of header and footer */}
                {window.location.pathname === routes.onboarding ? (
                    <ThemedScrollbars style={{ maxHeight: '', height: '100%' }}>{children}</ThemedScrollbars>
                ) : (
                    <ThemedScrollbars height='calc(100vh - 84px)' has_horizontal>
                        {children}
                    </ThemedScrollbars>
                )}
            </DesktopWrapper>
            {show_cookie_banner && (
                <CookieBanner
                    onAccept={onAccept}
                    onDecline={onDecline}
                    is_open={show_cookie_banner}
                    is_dark_mode={is_dark_mode}
                />
            )}
        </div>
    );
};

AppContents.propTypes = {
    children: PropTypes.any,
    is_app_disabled: PropTypes.bool,
    is_cashier_visible: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_cfd_page: PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_route_modal_on: PropTypes.bool,
    is_dark_mode: PropTypes.bool,
    is_eu_country: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    identifyEvent: PropTypes.func,
    pageView: PropTypes.func,
    pushDataLayer: PropTypes.func,
    notifyAppInstall: PropTypes.func,
    platform: PropTypes.string,
    setAppContentsScrollRef: PropTypes.func,
};

export default withRouter(
    connect(({ client, common, gtm, ui }) => ({
        is_eu_country: client.is_eu_country,
        is_eu: client.is_eu,
        is_logged_in: client.is_logged_in,
        is_logging_in: client.is_logging_in,
        pushDataLayer: gtm.pushDataLayer,
        is_app_disabled: ui.is_app_disabled,
        is_cashier_visible: ui.is_cashier_visible,
        is_dark_mode: ui.is_dark_mode_on,
        is_cfd_page: ui.is_cfd_page,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        is_route_modal_on: ui.is_route_modal_on,
        notifyAppInstall: ui.notifyAppInstall,
        platform: common.platform,
        setAppContentsScrollRef: ui.setAppContentsScrollRef,
    }))(AppContents)
);
