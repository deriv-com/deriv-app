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
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getSelectedRoute, isMobile, isTouchDevice, routes } from '@deriv/shared';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import 'Sass/cashier.scss';

const el_landscape_blocker = document.getElementById('landscape_blocker');

const Cashier = ({
    history,
    is_account_transfer_visible,
    is_onramp_tab_visible,
    is_p2p_enabled,
    is_payment_agent_transfer_visible,
    is_payment_agent_visible,
    is_virtual,
    is_visible,
    location,
    onMount,
    p2p_notification_count,
    routes: routes_config,
    routeBackInApp,
    setAccountSwitchListener,
    setTabIndex,
    tab_index,
    toggleCashier,
}) => {
    const device_height = window.innerHeight;

    React.useEffect(() => {
        toggleCashier();
        // we still need to populate the tabs shown on cashier
        (async () => {
            await WS.wait('authorize');
        })();

        onMount();
        setAccountSwitchListener();

        // TODO: Remove L21, L31, and L38 code blocks once landscape design is ready
        // doughflow iframe inconjunction with android's virtual keyboard causes issues with css screen height calculation (thus falsely triggering landscape blocker in Android)
        // this is due to the onscreen virtual keyboard resizing the innerHeight of the window and ignoring the actual height of content within the iframe
        if (isMobile() && isTouchDevice()) {
            window.addEventListener('resize', handleOnScreenKeyboard);
        }

        return () => {
            toggleCashier();

            // cleanup onscreen keyboard class suffix and eventlistener for landscape blocker upon unMount
            if (isMobile() && isTouchDevice()) {
                window.removeEventListener('resize', handleOnScreenKeyboard);
                if (el_landscape_blocker) el_landscape_blocker.classList.remove('landscape-blocker--keyboard-visible');
            }
        };
    }, []);

    const handleOnScreenKeyboard = () => {
        // We are listening to resize window resize events on mobile,
        // and comparing the android device's height onMount and the height after the keyboard causes the resize event
        const is_android_keyboard = device_height !== window.innerHeight;
        if (el_landscape_blocker) {
            if (is_android_keyboard) {
                el_landscape_blocker.classList.add('landscape-blocker--keyboard-visible');
            } else {
                el_landscape_blocker.classList.remove('landscape-blocker--keyboard-visible');
            }
        }
    };

    const onClickClose = () => routeBackInApp(history);
    const getMenuOptions = () => {
        const options = [];

        // TODO: remove show_dp2p hash check once released
        routes_config.forEach(route => {
            if (
                (route.path !== routes.cashier_pa || is_payment_agent_visible) &&
                (route.path !== routes.cashier_pa_transfer || is_payment_agent_transfer_visible) &&
                (route.path !== routes.cashier_p2p || is_p2p_enabled) &&
                (route.path !== routes.cashier_onramp || is_onramp_tab_visible) &&
                (route.path !== routes.cashier_acc_transfer || is_account_transfer_visible)
            ) {
                options.push({
                    ...(route.path === routes.cashier_p2p && { count: p2p_notification_count }),
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

    const selected_route = isMobile()
        ? getSelectedRoute({ routes: routes_config, pathname: location.pathname })
        : null;
    const should_show_tab_headers_note =
        !is_virtual &&	
        (location.pathname.startsWith(routes.cashier_deposit) ||	
            location.pathname.startsWith(routes.cashier_withdrawal));

    const is_default_route = !!getSelectedRoute({ routes: routes_config, pathname: location.pathname }).default;

    return (
        <FadeWrapper is_visible={is_visible} className='cashier-page-wrapper' keyname='cashier-page-wrapper'>
            <div className='cashier'>
                <PageOverlay
                    header={isMobile() ? selected_route.getTitle() : localize('Cashier')}
                    onClickClose={onClickClose}
                >
                    <DesktopWrapper>
                        <VerticalTab
                            alignment='center'
                            id='cashier'
                            classNameHeader='cashier__tab-header'
                            current_path={location.pathname}
                            is_floating
                            setVerticalTabIndex={setTabIndex}
                            vertical_tab_index={is_default_route ? 0 : tab_index}
                            is_full_width
                            is_routed
                            list={getMenuOptions()}
                            tab_headers_note={
                                should_show_tab_headers_note ? (
                                    <Text as='p' size='xxs' className='cashier__tab-header-note'>
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
                                    history={history}
                                    menu_options={getMenuOptions()}
                                />
                            )}
                        </Div100vhContainer>
                    </MobileWrapper>
                </PageOverlay>
            </div>
        </FadeWrapper>
    );
};

Cashier.propTypes = {
    history: PropTypes.object,
    is_onramp_tab_visible: PropTypes.bool,
    is_p2p_enabled: PropTypes.bool,
    is_account_transfer_visible: PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_visible: PropTypes.bool,
    location: PropTypes.object,
    onMount: PropTypes.func,
    p2p_notification_count: PropTypes.number,
    routes: PropTypes.arrayOf(PropTypes.object),
    routeBackInApp: PropTypes.func,
    setAccountSwitchListener: PropTypes.func,
    setTabIndex: PropTypes.func,
    tab_index: PropTypes.number,
    toggleCashier: PropTypes.func,
};

export default connect(({ client, common, modules, ui }) => ({
    routeBackInApp: common.routeBackInApp,
    tab_index: modules.cashier.cashier_route_tab_index,
    setTabIndex: modules.cashier.setCashierTabIndex,
    is_onramp_tab_visible: modules.cashier.onramp.is_onramp_tab_visible,
    is_p2p_enabled: modules.cashier.is_p2p_enabled,
    is_virtual: client.is_virtual,
    is_visible: ui.is_cashier_visible,
    is_account_transfer_visible: modules.cashier.is_account_transfer_visible,
    is_payment_agent_visible: modules.cashier.is_payment_agent_visible,
    is_payment_agent_transfer_visible: modules.cashier.is_payment_agent_transfer_visible,
    onMount: modules.cashier.onMountCommon,
    p2p_notification_count: modules.cashier.p2p_notification_count,
    routeTo: common.routeTo,
    setAccountSwitchListener: modules.cashier.setAccountSwitchListener,
    toggleCashier: ui.toggleCashier,
}))(withRouter(Cashier));
