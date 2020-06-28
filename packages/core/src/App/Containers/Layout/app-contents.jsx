import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router';
import { DesktopWrapper, MobileWrapper, ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared/utils/screen';
import { connect } from 'Stores/connect';
import { cookie_banner_expires_in_days } from '../../Constants/app-config';
import CookieBanner from '../../Components/Elements/CookieBanner/cookie-banner.jsx';
// import InstallPWA    from './install-pwa.jsx';

class AppContents extends React.Component {
    state = {
        show_cookie_banner: false,
    };

    async componentDidMount() {
        // Segment page view trigger
        this.props.identifyEvent();
        this.props.pageView();
        /*
        if (is_logged_in) {
        TODO: uncomment these after the issues with showing the prompt too often and in the app are fixed
        window.addEventListener('beforeinstallprompt', e => {
            console.log('Going to show the installation prompt'); // eslint-disable-line no-console
            e.preventDefault();
            this.props.setPWAPromptEvent(e);
            this.props.addNotificationBar({
                content : <InstallPWA />,
                autoShow: 10000, // show after 10 secs
                msg_type: 'pwa',
            });
        });
        }
        */
    }

    componentDidUpdate(prev_props) {
        const { is_eu_country, is_logged_in, is_window_loaded, is_tracking, pushDataLayer } = this.props;

        const tracking_status = Cookies.get('tracking_status');
        const allow_tracking = !is_eu_country || tracking_status === 'accepted';
        if (allow_tracking && !is_tracking) {
            pushDataLayer({ event: 'allow_tracking' });
        }

        if (is_window_loaded !== prev_props.is_window_loaded || is_logged_in !== prev_props.is_logged_in) {
            if (!is_logged_in && is_eu_country && !tracking_status) {
                this.setState({
                    show_cookie_banner: true,
                });
            }
        }
    }

    // handle accept/decline cookies
    onAccept = () => {
        Cookies.set('tracking_status', 'accepted', {
            expires: cookie_banner_expires_in_days,
        });
        this.props.pushDataLayer({ event: 'allow_tracking' });
        this.setState({ show_cookie_banner: false });
    };

    onDecline = () => {
        Cookies.set('tracking_status', 'declined', {
            expires: cookie_banner_expires_in_days,
        });
        this.setState({ show_cookie_banner: false });
    };

    render() {
        const {
            children,
            is_app_disabled,
            is_cashier_visible,
            is_mt5_page,
            is_positions_drawer_on,
            is_route_modal_on,
        } = this.props;
        return (
            <div
                id='app_contents'
                className={classNames('app-contents', {
                    'app-contents--show-positions-drawer': is_positions_drawer_on,
                    'app-contents--is-disabled': is_app_disabled,
                    'app-contents--is-mobile': isMobile(),
                    'app-contents--is-route-modal': is_route_modal_on,
                    'app-contents--is-scrollable': is_mt5_page || is_cashier_visible,
                })}
            >
                <MobileWrapper>{children}</MobileWrapper>
                <DesktopWrapper>
                    {/* Calculate height of user screen and offset height of header and footer */}
                    <ThemedScrollbars height='calc(100vh - 84px)'>{children}</ThemedScrollbars>
                </DesktopWrapper>
                {this.state.show_cookie_banner && (
                    <CookieBanner
                        onAccept={this.onAccept}
                        onDecline={this.onDecline}
                        is_open={this.state.show_cookie_banner}
                    />
                )}
            </div>
        );
    }
}

AppContents.propTypes = {
    children: PropTypes.any,
    is_app_disabled: PropTypes.bool,
    is_cashier_visible: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5_page: PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_route_modal_on: PropTypes.bool,
    pwa_prompt_event: PropTypes.object,
};

export default withRouter(
    connect(({ client, gtm, segment, ui }) => ({
        is_eu_country: client.is_eu_country,
        is_logged_in: client.is_logged_in,
        is_tracking: gtm.is_tracking,
        pushDataLayer: gtm.pushDataLayer,
        identifyEvent: segment.identifyEvent,
        pageView: segment.pageView,
        is_app_disabled: ui.is_app_disabled,
        is_cashier_visible: ui.is_cashier_visible,
        is_mt5_page: ui.is_mt5_page,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        is_route_modal_on: ui.is_route_modal_on,
        is_window_loaded: ui.is_window_loaded,
        pwa_prompt_event: ui.pwa_prompt_event,
        // setPWAPromptEvent     : ui.setPWAPromptEvent,
        // addNotificationBar    : ui.addNotificationBar,
    }))(AppContents)
);
