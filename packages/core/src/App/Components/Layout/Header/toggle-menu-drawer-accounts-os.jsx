import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Div100vhContainer, Icon, MobileDrawer } from '@deriv/components';
import {
    useAccountTransferVisible,
    useAuthorize,
    useIsP2PEnabled,
    useOnrampVisible,
    useP2PSettings,
    usePaymentAgentTransferVisible,
} from '@deriv/hooks';
import { getOSNameWithUAParser, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';

import getRoutesConfig from 'App/Constants/routes-config';

import MenuLink from './menu-link';

const ToggleMenuDrawerAccountsOS = observer(() => {
    const { ui, client, modules } = useStore();
    const {
        disableApp,
        enableApp,
        is_mobile,
        is_mobile_language_menu_open,
        setMobileLanguageMenuOpen,
        setIsForcedToExitPnv,
    } = ui;
    const {
        account_status,
        has_wallet,
        is_authorize,
        is_logged_in,
        is_virtual,
        logout: logoutClient,
        should_allow_authentication,
        should_allow_poinc_authentication,
        landing_company_shortcode: active_account_landing_company,
        is_proof_of_ownership_enabled,
        is_passkey_supported,
    } = client;
    const { cashier } = modules;
    const { payment_agent } = cashier;
    const { is_payment_agent_visible } = payment_agent;
    const is_account_transfer_visible = useAccountTransferVisible();
    const { isSuccess } = useAuthorize();
    const is_onramp_visible = useOnrampVisible();
    const { data: is_payment_agent_transfer_visible } = usePaymentAgentTransferVisible();
    const { is_p2p_enabled } = useIsP2PEnabled();

    const { pathname: route } = useLocation();

    const is_trading_hub_category =
        route === routes.traders_hub || route.startsWith(routes.cashier) || route.startsWith(routes.account);

    const [is_open, setIsOpen] = React.useState(false);
    const [transitionExit, setTransitionExit] = React.useState(false);
    const [primary_routes_config, setPrimaryRoutesConfig] = React.useState([]);

    const timeout = React.useRef();
    const history = useHistory();
    const {
        subscribe,
        rest: { isSubscribed },
        p2p_settings,
    } = useP2PSettings();

    React.useEffect(() => {
        if (isSuccess && !isSubscribed && is_authorize) {
            subscribe();
        }
    }, [isSuccess, p2p_settings, subscribe, isSubscribed, is_authorize]);

    React.useEffect(() => {
        const processRoutes = () => {
            const routes_config = getRoutesConfig();
            setPrimaryRoutesConfig(getFilteredRoutesConfig(routes_config, [routes.account]));
        };

        if (account_status || should_allow_authentication) {
            processRoutes();
        }

        return () => clearTimeout(timeout.current);
    }, [
        account_status,
        should_allow_authentication,
        has_wallet,
        is_trading_hub_category,
        is_mobile,
        is_passkey_supported,
        is_p2p_enabled,
    ]);

    const toggleDrawer = React.useCallback(() => {
        if (is_mobile_language_menu_open) setMobileLanguageMenuOpen(false);
        if (!is_open) setIsOpen(!is_open);
        else {
            setTransitionExit(true);
            timeout.current = setTimeout(() => {
                setIsOpen(false);
                setTransitionExit(false);
            }, 400);
        }
    }, [is_open, is_mobile_language_menu_open, setMobileLanguageMenuOpen]);

    const handleLogout = React.useCallback(async () => {
        toggleDrawer();
        if (window.location.pathname.startsWith(routes.phone_verification)) {
            setIsForcedToExitPnv(true);
            // Add a small delay to ensure state is updated before navigation because adding await doesn't work here
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        history.push(routes.traders_hub);
        await logoutClient();
    }, [history, logoutClient, toggleDrawer]);

    const passkeysMenuOpenActionEventTrack = React.useCallback(() => {
        Analytics.trackEvent('ce_passkey_account_settings_form', {
            action: 'open',
            form_name: 'ce_passkey_account_settings_form',
            operating_system: getOSNameWithUAParser(),
        });
    }, []);

    const getFilteredRoutesConfig = (all_routes_config, routes_to_filter) => {
        const subroutes_config = all_routes_config.flatMap(i => i.routes || []);

        return routes_to_filter
            .map(path => all_routes_config.find(r => r.path === path) || subroutes_config.find(r => r.path === path))
            .filter(route => route);
    };

    const getRoutesWithSubMenu = (route_config, idx) => {
        const has_access = route_config.is_authenticated ? is_logged_in : true;
        if (!has_access) return null;

        if (!route_config.routes) {
            return (
                <MobileDrawer.Item key={idx}>
                    <MenuLink
                        link_to={route_config.path}
                        icon={route_config.icon_component}
                        text={route_config.getTitle()}
                        onClickLink={toggleDrawer}
                    />
                </MobileDrawer.Item>
            );
        }

        const has_subroutes = route_config.routes.some(route => route.subroutes);
        const should_hide_passkeys_route = !is_mobile || !is_passkey_supported;

        const disableRoute = route_path => {
            if (/financial-assessment/.test(route_path)) {
                return is_virtual;
            } else if (/trading-assessment/.test(route_path)) {
                return is_virtual || active_account_landing_company !== 'maltainvest';
            } else if (/proof-of-address/.test(route_path) || /proof-of-identity/.test(route_path)) {
                return !should_allow_authentication;
            } else if (/proof-of-income/.test(route_path)) {
                return !should_allow_poinc_authentication;
            } else if (/proof-of-ownership/.test(route_path)) {
                return is_virtual || !is_proof_of_ownership_enabled;
            }
            return false;
        };

        const hideRoute = route_path => {
            if (/passkeys/.test(route_path)) {
                return should_hide_passkeys_route;
            } else if (/languages/.test(route_path)) {
                return has_wallet;
            }
            return false;
        };

        return (
            <React.Fragment key={idx}>
                {!has_subroutes &&
                    route_config.routes.map((route, index) => {
                        if (
                            !route.is_invisible &&
                            (route.path !== routes.cashier_pa || is_payment_agent_visible) &&
                            (route.path !== routes.cashier_pa_transfer || is_payment_agent_transfer_visible) &&
                            (route.path !== routes.cashier_p2p || is_p2p_enabled) &&
                            (route.path !== routes.cashier_onramp || is_onramp_visible) &&
                            (route.path !== routes.cashier_acc_transfer || is_account_transfer_visible)
                        ) {
                            return (
                                <MobileDrawer.Item key={index}>
                                    <MenuLink
                                        link_to={route.path}
                                        icon={route.icon_component}
                                        text={route.getTitle()}
                                        onClickLink={toggleDrawer}
                                    />
                                </MobileDrawer.Item>
                            );
                        }
                        return undefined;
                    })}
                {has_subroutes &&
                    route_config.routes.map((route, index) => {
                        return route.subroutes ? (
                            <MobileDrawer.SubMenuSection
                                key={index}
                                section_icon={route.icon}
                                section_title={route.getTitle()}
                            >
                                {route.subroutes.map((subroute, subindex) => (
                                    <MenuLink
                                        key={subindex}
                                        is_disabled={disableRoute(subroute.path) || subroute.is_disabled}
                                        link_to={subroute.path}
                                        text={subroute.getTitle()}
                                        onClickLink={() => {
                                            toggleDrawer();
                                            if (subroute.path === routes.passkeys) {
                                                passkeysMenuOpenActionEventTrack();
                                            }
                                        }}
                                        is_hidden={hideRoute(subroute.path)}
                                    />
                                ))}
                            </MobileDrawer.SubMenuSection>
                        ) : (
                            <MobileDrawer.Item key={index}>
                                <MenuLink
                                    link_to={route.path}
                                    icon={route.icon_component}
                                    text={route.getTitle()}
                                    onClickLink={toggleDrawer}
                                />
                            </MobileDrawer.Item>
                        );
                    })}
            </React.Fragment>
        );
    };
    return (
        <React.Fragment>
            <a id='dt_mobile_drawer_toggle' onClick={toggleDrawer} className='header__mobile-drawer-toggle'>
                <Icon icon='IcHamburger' width='16px' height='16px' className='header__mobile-drawer-icon' />
            </a>
            <MobileDrawer
                alignment='left'
                icon_class='header__menu-toggle'
                is_open={is_open}
                transitionExit={transitionExit}
                toggle={toggleDrawer}
                id='dt_mobile_drawer'
                enableApp={enableApp}
                disableApp={disableApp}
                title={<div>{localize('Account settings')}</div>}
                height='100vh'
                width='295px'
                className='pre-appstore'
            >
                <Div100vhContainer height_offset='40px'>
                    <div className='header__menu-mobile-body-wrapper'>
                        <React.Fragment>
                            <MobileDrawer.Body className='tradershub-os-header'>
                                <div className='header__menu-mobile-platform-switcher' id='mobile_platform_switcher' />
                                {primary_routes_config.map((route_config, idx) =>
                                    getRoutesWithSubMenu(route_config, idx)
                                )}
                                {is_logged_in && (
                                    <MobileDrawer.Item onClick={handleLogout} className='dc-mobile-drawer__item'>
                                        <MenuLink icon='IcLogout' text={localize('Log out')} />
                                    </MobileDrawer.Item>
                                )}
                            </MobileDrawer.Body>
                        </React.Fragment>
                    </div>
                </Div100vhContainer>
            </MobileDrawer>
        </React.Fragment>
    );
});

ToggleMenuDrawerAccountsOS.displayName = 'ToggleMenuDrawerAccountsOS';

export default ToggleMenuDrawerAccountsOS;
