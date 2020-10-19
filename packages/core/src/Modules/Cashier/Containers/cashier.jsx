import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
    DesktopWrapper,
    Div100vhContainer,
    FadeWrapper,
    MobileWrapper,
    PageOverlay,
    VerticalTab,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getSelectedRoute, isCryptocurrency, isMobile, isTouchDevice, routes } from '@deriv/shared';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import 'Sass/app/modules/cashier.scss';

const el_landscape_blocker = document.getElementById('landscape_blocker');

class Cashier extends React.Component {
    state = { device_height: window.innerHeight };

    async componentDidMount() {
        this.props.toggleCashier();
        // we still need to populate the tabs shown on cashier
        await WS.wait('authorize');
        if (!this.props.is_virtual) {
            this.props.onMount();
            this.props.setAccountSwitchListener();

            // TODO: Remove L21, L31, and L38 code blocks once landscape design is ready
            // doughflow iframe inconjunction with android's virtual keyboard causes issues with css screen height calculation (thus falsely triggering landscape blocker in Android)
            // this is due to the onscreen virtual keyboard resizing the innerHeight of the window and ignoring the actual height of content within the iframe
            if (isMobile() && isTouchDevice()) {
                window.addEventListener('resize', this.handleOnScreenKeyboard);
            }
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
    render() {
        const menu_options = () => {
            const options = [];

            // TODO: remove show_dp2p hash check once released
            this.props.routes.forEach(route => {
                if (
                    (route.path !== routes.cashier_pa || this.props.is_payment_agent_visible) &&
                    (route.path !== routes.cashier_pa_transfer || this.props.is_payment_agent_transfer_visible) &&
                    (route.path !== routes.cashier_p2p || this.props.is_p2p_enabled) &&
                    (route.path !== routes.cashier_onramp || this.props.is_onramp_tab_visible)
                ) {
                    options.push({
                        ...(route.path === routes.cashier_p2p && { count: this.props.p2p_notification_count }),
                        default: route.default,
                        icon: route.icon_component,
                        label: route.getTitle(),
                        value: route.component,
                        path: route.path,
                        has_side_note: route.path !== routes.cashier_p2p, // Set to true to create the 3-column effect without passing any content. If there is content, the content should be passed in.
                    });
                }
            });

            return options;
        };

        const { routes: routes_config, location } = this.props;
        const selected_route = isMobile()
            ? getSelectedRoute({ routes: routes_config, pathname: location.pathname })
            : null;
        const should_show_tab_headers_note =
            !this.props.is_virtual &&
            !this.props.is_eu &&
            !isCryptocurrency(this.props.loggedin_currency) &&
            (location.pathname.startsWith(routes.cashier_deposit) ||
                location.pathname.startsWith(routes.cashier_withdrawal));

        const is_default_route = !!getSelectedRoute({ routes: routes_config, pathname: location.pathname }).default;

        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='cashier-page-wrapper'
                keyname='cashier-page-wrapper'
            >
                <div className='cashier'>
                    <PageOverlay
                        header={isMobile() ? selected_route.getTitle() : localize('Cashier')}
                        onClickClose={this.onClickClose}
                    >
                        <DesktopWrapper>
                            <VerticalTab
                                alignment='center'
                                id='cashier'
                                classNameHeader='cashier__tab-header'
                                current_path={this.props.location.pathname}
                                is_floating
                                setVerticalTabIndex={this.props.setTabIndex}
                                vertical_tab_index={is_default_route ? 0 : this.props.tab_index}
                                is_full_width
                                is_routed
                                list={menu_options()}
                                tab_headers_note={
                                    should_show_tab_headers_note ? (
                                        <p className='cashier__tab-header-note'>
                                            <Localize
                                                i18n_default_text='Want to exchange between e-wallet currencies? Try <0>bestchange.com</0>'
                                                components={[
                                                    <a
                                                        key={0}
                                                        href='https://www.bestchange.com/?p=1095016'
                                                        rel='noopener noreferrer'
                                                        target='_blank'
                                                        className='link'
                                                    />,
                                                ]}
                                            />
                                        </p>
                                    ) : undefined
                                }
                            />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <Div100vhContainer className='cashier__wrapper--is-mobile' height_offset='80px'>
                                {selected_route && (
                                    <selected_route.component component_icon={selected_route.icon_component} />
                                )}
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
    is_onramp_tab_visible: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_p2p_enabled: PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_visible: PropTypes.bool,
    location: PropTypes.object,
    onMount: PropTypes.func,
    p2p_notification_count: PropTypes.number,
    setTabIndex: PropTypes.func,
    tab_index: PropTypes.number,
    routes: PropTypes.arrayOf(PropTypes.object),
    toggleCashier: PropTypes.func,
};

export default connect(({ client, common, modules, ui }) => ({
    routeBackInApp: common.routeBackInApp,
    tab_index: modules.cashier.cashier_route_tab_index,
    setTabIndex: modules.cashier.setCashierTabIndex,
    loggedin_currency: client.currency,
    is_onramp_tab_visible: modules.cashier.onramp.is_onramp_tab_visible,
    is_eu: client.is_eu,
    is_p2p_enabled: modules.cashier.is_p2p_enabled,
    is_virtual: client.is_virtual,
    is_visible: ui.is_cashier_visible,
    is_payment_agent_visible: modules.cashier.is_payment_agent_visible,
    is_payment_agent_transfer_visible: modules.cashier.is_payment_agent_transfer_visible,
    onMount: modules.cashier.onMountCommon,
    p2p_notification_count: modules.cashier.p2p_notification_count,
    routeTo: common.routeTo,
    setAccountSwitchListener: modules.cashier.setAccountSwitchListener,
    toggleCashier: ui.toggleCashier,
}))(withRouter(Cashier));
