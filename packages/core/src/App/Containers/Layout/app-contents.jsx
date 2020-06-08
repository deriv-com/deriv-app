import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router';
import { DesktopWrapper, MobileWrapper, ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared/utils/screen';
import { connect } from 'Stores/connect';
import BinarySocket from '_common/base/socket_base';
import { isEuCountry } from '_common/utility';
import CookieBanner from '../../Components/Elements/CookieBanner/cookie-banner.jsx';
import { isBrowser, WindowContext } from '../window-context';
import { LocationProvider } from '../location-context';

const has_dataLayer = isBrowser() && window.dataLayer;
const cookie_expires = 7;

class AppContents extends React.Component {
    static contextType = WindowContext;
    state = {
        show_cookie_banner: false,
        clients_country: Cookies.get('clients_country'),
        is_window_loaded: false,
    };

    async componentDidMount() {
        this.props.identifyEvent();
        this.props.pageView();
        if (!this.state.clients_country) {
            const website_status = await BinarySocket.wait('website_status');
            const res = website_status.website_status.clients_country;
            this.setState({ clients_country: res });
            Cookies.set('clients_country', res, {
                expires: cookie_expires,
            });
        }
    }

    shouldComponentUpdate(next_props, next_state) {
        return (
            next_props !== this.props ||
            JSON.stringify(next_state) !== JSON.stringify(this.state) ||
            this.state.is_window_loaded !== this.context.is_window_loaded
        );
    }

    componentDidUpdate() {
        if (!this.props.is_logged_in) {
            const is_eu_country = isEuCountry(this.state.clients_country);
            const tracking_status = Cookies.get('tracking_status');

            if (is_eu_country && !tracking_status) {
                this.setState({
                    show_cookie_banner: true,
                    is_window_loaded: true,
                });
            }

            const allow_tracking = (!is_eu_country || tracking_status === 'accepted') && has_dataLayer;
            if (allow_tracking) {
                window.dataLayer.push({ event: 'allow_tracking' });
            }
        }
    }

    // handle accept/decline cookies
    onAccept = () => {
        Cookies.set('tracking_status', 'accepted', {
            expires: cookie_expires,
        });
        if (has_dataLayer) {
            window.dataLayer.push({ event: 'allow_tracking' });
        }
        this.setState({ show_cookie_banner: false });
    };

    onDecline = () => {
        Cookies.set('tracking_status', 'declined', {
            expires: cookie_expires,
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
            <LocationProvider
                is_eu_country={this.state.clients_country ? isEuCountry(this.state.clients_country) : undefined}
                show_cookie_banner={this.state.show_cookie_banner}
            >
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
                        <ThemedScrollbars autoHide style={{ height: 'calc(100vh - 83px)' }}>
                            {children}
                        </ThemedScrollbars>
                    </DesktopWrapper>
                    {this.state.show_cookie_banner && (
                        <CookieBanner
                            onAccept={this.onAccept}
                            onDecline={this.onDecline}
                            is_open={this.state.show_cookie_banner}
                        />
                    )}
                </div>
            </LocationProvider>
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
    connect(({ client, ui, segment }) => ({
        identifyEvent: segment.identifyEvent,
        is_app_disabled: ui.is_app_disabled,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        is_route_modal_on: ui.is_route_modal_on,
        pageView: segment.pageView,
        pwa_prompt_event: ui.pwa_prompt_event,
        is_mt5_page: ui.is_mt5_page,
        is_cashier_visible: ui.is_cashier_visible,
        is_logged_in: client.is_logged_in,
    }))(AppContents)
);
