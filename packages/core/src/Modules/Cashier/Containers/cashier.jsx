import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import {
    PageOverlay,
    VerticalTab,
    DesktopWrapper,
    MobileWrapper,
    Div100vhContainer,
    FadeWrapper,
} from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile, isTouchDevice } from '@deriv/shared/utils/screen';
import routes from 'Constants/routes';
import { connect } from 'Stores/connect';

const el_landscape_blocker = document.getElementById('landscape_blocker');

class Cashier extends React.Component {
    state = { device_height: window.innerHeight };

    componentDidMount() {
        this.props.toggleCashier();
        // we still need to populate the tabs shown on cashier
        this.props.onMount();

        // TODO: Remove L21, L31, and L38 code blocks once landscape design is ready
        // doughflow iframe inconjunction with android's virtual keyboard causes issues with css screen height calculation (thus falsely triggering landscape blocker in Android)
        // this is due to the onscreen virtual keyboard resizing the innerHeight of the window and ignoring the actual height of content within the iframe
        if (isMobile() && isTouchDevice()) {
            window.addEventListener('resize', this.handleOnScreenKeyboard);
        }
    }

    componentWillUnmount() {
        this.props.toggleCashier();

        // cleanup onscreen keyboard class suffix and eventlistener for landscape blocker upon unMount
        if (isMobile() && isTouchDevice()) {
            window.removeEventListener('resize', this.handleOnScreenKeyboard);
            if (el_landscape_blocker) el_landscape_blocker.classList.remove('landscape-blocker--keyboard-visible');
        }
    }

    handleOnScreenKeyboard = () => {
        // We are listening to resize window resize events on mobile,
        // and comparing the android device's height onMount and the height after the keyboard causes the resize event
        const is_android_keyboard = this.state.device_height !== window.innerHeight;
        if (el_landscape_blocker) {
            if (is_android_keyboard) {
                el_landscape_blocker.classList.add('landscape-blocker--keyboard-visible');
            } else {
                el_landscape_blocker.classList.remove('landscape-blocker--keyboard-visible');
            }
        }
    };

    onClickClose = () => this.props.routeBackInApp(this.props.history);

    getRoutedCashier() {
        const route =
            this.props.routes.find(r => r.path === this.props.location.pathname || r.path === r.default) ||
            this.props.routes[0];
        if (!route) return null;

        const Content = route.component;
        return <Content component_icon={route.icon_component} />;
    }

    render() {
        const menu_options = () => {
            const options = [];

            // TODO: remove show_dp2p hash check once released
            this.props.routes.forEach(route => {
                if (
                    (route.path !== routes.cashier_pa || this.props.is_payment_agent_visible) &&
                    (route.path !== routes.cashier_pa_transfer || this.props.is_payment_agent_transfer_visible) &&
                    (route.path !== routes.cashier_p2p ||
                        (this.props.is_p2p_visible && /show_p2p/.test(this.props.location.hash)))
                ) {
                    options.push({
                        ...(route.path === routes.cashier_p2p && { count: this.props.p2p_notification_count }),
                        default: route.default,
                        icon: route.icon_component,
                        label: route.title,
                        value: route.component,
                        path: route.path,
                        has_side_note: route.path !== routes.cashier_p2p, // Set to true to create the 3-column effect without passing any content. If there is content, the content should be passed in.
                    });
                }
            });

            return options;
        };

        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='cashier-page-wrapper'
                keyname='cashier-page-wrapper'
            >
                <div className='cashier'>
                    <PageOverlay header={localize('Cashier')} onClickClose={this.onClickClose} has_side_note>
                        <DesktopWrapper>
                            <VerticalTab
                                alignment='center'
                                id='cashier'
                                classNameHeader='cashier__tab-header'
                                current_path={this.props.location.pathname}
                                is_floating
                                is_full_width
                                is_routed
                                list={menu_options()}
                            />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <Div100vhContainer className='cashier__wrapper--is-mobile' height_offset='80px'>
                                {this.getRoutedCashier()}
                            </Div100vhContainer>
                        </MobileWrapper>
                    </PageOverlay>
                </div>
            </FadeWrapper>
        );
    }
}

Cashier.propTypes = {
    history: PropTypes.object,
    is_p2p_visible: PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_visible: PropTypes.bool,
    location: PropTypes.object,
    onMount: PropTypes.func,
    p2p_notification_count: PropTypes.number,
    routes: PropTypes.arrayOf(PropTypes.object),
    toggleCashier: PropTypes.func,
};

export default connect(({ common, modules, ui }) => ({
    routeBackInApp: common.routeBackInApp,
    is_p2p_visible: modules.cashier.is_p2p_visible,
    is_visible: ui.is_cashier_visible,
    is_payment_agent_visible: modules.cashier.is_payment_agent_visible,
    is_payment_agent_transfer_visible: modules.cashier.is_payment_agent_transfer_visible,
    onMount: modules.cashier.onMountCommon,
    p2p_notification_count: modules.cashier.p2p_notification_count,
    toggleCashier: ui.toggleCashier,
}))(withRouter(Cashier));
