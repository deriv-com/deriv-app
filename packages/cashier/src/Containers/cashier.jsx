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
    Text,
    Loading,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getSelectedRoute, isMobile, routes } from '@deriv/shared';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import 'Sass/cashier.scss';

class Cashier extends React.Component {
    state = { device_height: window.innerHeight };

    async componentDidMount() {
        this.props.toggleCashier();
        // we still need to populate the tabs shown on cashier
        await WS.wait('authorize');

        this.props.onMount();
        this.props.setAccountSwitchListener();
    }

    componentWillUnmount() {
        this.props.toggleCashier();
    }

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
                    (route.path !== routes.cashier_onramp || this.props.is_onramp_tab_visible) &&
                    (route.path !== routes.cashier_acc_transfer || this.props.is_account_transfer_visible)
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
            (location.pathname.startsWith(routes.cashier_deposit) ||
                location.pathname.startsWith(routes.cashier_withdrawal));

        const is_default_route = !!getSelectedRoute({ routes: routes_config, pathname: location.pathname }).default;

        if (!this.props.is_logged_in && this.props.is_logging_in) {
            return <Loading is_fullscreen />;
        }
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
                                        <Text as='p' size='xxs' className='cashier__tab-header-note'>
                                            <Localize
                                                i18n_default_text='Want to exchange between e-wallet currencies? Try <0>Ewallet.Exchange</0>'
                                                components={[
                                                    <a
                                                        key={0}
                                                        href='https://ewallet.exchange'
                                                        rel='noopener noreferrer'
                                                        target='_blank'
                                                        className='link'
                                                    />,
                                                ]}
                                            />
                                        </Text>
                                    ) : undefined
                                }
                            />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <Div100vhContainer className='cashier__wrapper--is-mobile' height_offset='80px'>
                                {selected_route && (
                                    <selected_route.component
                                        component_icon={selected_route.icon_component}
                                        history={this.props.history}
                                        menu_options={menu_options()}
                                    />
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
    is_account_transfer_visible: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    is_onramp_tab_visible: PropTypes.bool,
    is_p2p_enabled: PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_visible: PropTypes.bool,
    location: PropTypes.object,
    onMount: PropTypes.func,
    p2p_notification_count: PropTypes.number,
    routes: PropTypes.arrayOf(PropTypes.object),
    setTabIndex: PropTypes.func,
    tab_index: PropTypes.number,
    toggleCashier: PropTypes.func,
};

export default connect(({ client, common, modules, ui }) => ({
    loggedin_currency: client.currency,
    is_account_transfer_visible: modules.cashier.is_account_transfer_visible,
    is_eu: client.is_eu,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    is_onramp_tab_visible: modules.cashier.onramp.is_onramp_tab_visible,
    is_p2p_enabled: modules.cashier.is_p2p_enabled,
    is_payment_agent_transfer_visible: modules.cashier.is_payment_agent_transfer_visible,
    is_payment_agent_visible: modules.cashier.is_payment_agent_visible,
    is_virtual: client.is_virtual,
    is_visible: ui.is_cashier_visible,
    onMount: modules.cashier.onMountCommon,
    p2p_notification_count: modules.cashier.p2p_notification_count,
    routeBackInApp: common.routeBackInApp,
    routeTo: common.routeTo,
    setAccountSwitchListener: modules.cashier.setAccountSwitchListener,
    setTabIndex: modules.cashier.setCashierTabIndex,
    tab_index: modules.cashier.cashier_route_tab_index,
    toggleCashier: ui.toggleCashier,
}))(withRouter(Cashier));
