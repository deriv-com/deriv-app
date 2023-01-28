import classNames from 'classnames';
import React from 'react';
import { Div100vhContainer, Icon, MobileDrawer, ToggleSwitch, Text, Button } from '@deriv/components';
import { routes, PlatformContext, getStaticUrl, whatsapp_url } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, getAllowedLanguages, getLanguage } from '@deriv/translations';
import NetworkStatus from 'App/Components/Layout/Footer';
import ServerTime from 'App/Containers/server-time.jsx';
import { BinaryLink } from 'App/Components/Routes';
import getRoutesConfig from 'App/Constants/routes-config';
import { changeLanguage } from 'Utils/Language';
import LiveChat from 'App/Components/Elements/LiveChat';
import { useLocation, useHistory } from 'react-router-dom';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat.ts';
import PlatformSwitcher from './platform-switcher';

const MenuLink = observer(({ link_to, icon, is_active, is_disabled, is_language, suffix_icon, text, onClickLink }) => {
    const { common } = useStore();
    const { changeCurrentLanguage } = common;
    const deriv_static_url = getStaticUrl(link_to);

    if (is_language) {
        return (
            <span
                className={classNames('header__menu-mobile-link', {
                    'header__menu-mobile-link--disabled': is_disabled,
                    'header__menu-mobile-link--active': is_active,
                })}
                active_class='header__menu-mobile-link--active'
                onClick={() => {
                    onClickLink();
                    changeLanguage(link_to, changeCurrentLanguage);
                }}
            >
                <Icon className='header__menu-mobile-link-flag-icon' size={32} icon={icon} />
                <span className='header__menu-mobile-link-text'>{text}</span>
                {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
            </span>
        );
    } else if (!link_to) {
        return (
            <div
                className={classNames('header__menu-mobile-link', {
                    'header__menu-mobile-link--disabled': is_disabled,
                })}
            >
                <Icon className='header__menu-mobile-link-icon' icon={icon} />
                <span className='header__menu-mobile-link-text'>{text}</span>
                {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
            </div>
        );
    } else if (deriv_static_url) {
        return (
            <a
                className={classNames('header__menu-mobile-link', {
                    'header__menu-mobile-link--disabled': is_disabled,
                    'header__menu-mobile-link--active': is_active,
                })}
                href={link_to}
            >
                <Icon className='header__menu-mobile-link-icon' icon={icon} />
                <Text
                    className={text === localize('Trade') ? '' : 'header__menu-mobile-link-text'}
                    as='h3'
                    size='xs'
                    weight={window.location.pathname === '/' && text === localize('Trade') ? 'bold' : null}
                >
                    {text}
                </Text>
                {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
            </a>
        );
    }

    return (
        <BinaryLink
            to={link_to}
            className={classNames('header__menu-mobile-link', {
                'header__menu-mobile-link--disabled': is_disabled,
                'header__menu-mobile-link--active': is_active,
            })}
            active_class='header__menu-mobile-link--active'
            onClick={onClickLink}
        >
            <Icon className='header__menu-mobile-link-icon' icon={icon} />
            <Text
                className={text === localize('Trade') ? '' : 'header__menu-mobile-link-text'}
                as='h3'
                size='xs'
                weight={window.location.pathname === '/' && text === localize('Trade') ? 'bold' : null}
            >
                {text}
            </Text>
            {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
        </BinaryLink>
    );
});

const ToggleMenuDrawer = observer(({ platform_config }) => {
    const { common, ui, client, modules } = useStore();
    const { app_routing_history } = common;
    const { disableApp, enableApp, is_dark_mode_on: is_dark_mode, setDarkMode: toggleTheme } = ui;
    const {
        account_status,
        is_logged_in,
        is_logging_in,
        is_virtual,
        logout: logoutClient,
        should_allow_authentication,
        is_risky_client,
        landing_company_shortcode: active_account_landing_company,
        is_landing_company_loaded,
    } = client;
    const { cashier } = modules;
    const { onramp, general_store, payment_agent_transfer, payment_agent, account_transfer } = cashier;
    const { is_onramp_tab_visible } = onramp;
    const { is_p2p_enabled } = general_store;
    const { is_payment_agent_transfer_visible } = payment_agent_transfer;
    const { is_payment_agent_visible } = payment_agent;
    const { is_account_transfer_visible } = account_transfer;

    const liveChat = useLiveChat();
    const [is_open, setIsOpen] = React.useState(false);
    const [transitionExit, setTransitionExit] = React.useState(false);
    const [primary_routes_config, setPrimaryRoutesConfig] = React.useState([]);
    const [secondary_routes_config, setSecondaryRoutesConfig] = React.useState([]);
    const [is_submenu_expanded, expandSubMenu] = React.useState(false);

    const { is_appstore, is_pre_appstore, setIsPreAppStore } = React.useContext(PlatformContext);
    const timeout = React.useRef();

    React.useEffect(() => {
        const processRoutes = () => {
            const routes_config = getRoutesConfig({ is_appstore, is_pre_appstore });
            let primary_routes = [];
            let secondary_routes = [];
            const location = window.location.pathname;

            if (is_appstore) {
                primary_routes = [
                    routes.my_apps,
                    routes.explore,
                    routes.wallets,
                    routes.platforms,
                    routes.trade_types,
                    routes.markets,
                ];
                secondary_routes = [];
            } else if ((is_pre_appstore && location === routes.trading_hub) || is_trading_hub_category) {
                primary_routes = [routes.account, routes.cashier];
                secondary_routes = [];
            } else {
                primary_routes = [routes.reports, routes.account, routes.cashier];
                secondary_routes = [];
            }

            setPrimaryRoutesConfig(getFilteredRoutesConfig(routes_config, primary_routes));
            setSecondaryRoutesConfig(getFilteredRoutesConfig(routes_config, secondary_routes));
        };

        if (account_status || should_allow_authentication) {
            processRoutes();
        }

        return () => clearTimeout(timeout);
    }, [is_appstore, is_pre_appstore, account_status, should_allow_authentication]);

    const toggleDrawer = React.useCallback(() => {
        if (!is_open) setIsOpen(!is_open);
        else {
            setTransitionExit(true);
            timeout.current = setTimeout(() => {
                setIsOpen(false);
                setTransitionExit(false);
            }, 400);
        }
        expandSubMenu(false);
    }, [expandSubMenu, is_open]);

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

        const disableRoute = route_path => {
            if (/financial-assessment/.test(route_path)) {
                return is_virtual || (active_account_landing_company === 'maltainvest' && !is_risky_client);
            } else if (/trading-assessment/.test(route_path)) {
                return is_virtual || active_account_landing_company !== 'maltainvest';
            } else if (/proof-of-address/.test(route_path) || /proof-of-identity/.test(route_path)) {
                return !should_allow_authentication;
            } else if (/proof-of-ownership/.test(route_path)) {
                return is_virtual;
            }
            return false;
        };

        return (
            <MobileDrawer.SubMenu
                key={idx}
                has_subheader
                submenu_icon={route_config.icon_component}
                submenu_title={route_config.getTitle()}
                submenu_suffix_icon='IcChevronRight'
                onToggle={expandSubMenu}
                route_config_path={route_config.path}
            >
                {!has_subroutes &&
                    route_config.routes.map((route, index) => {
                        if (
                            !route.is_invisible &&
                            (route.path !== routes.cashier_pa || is_payment_agent_visible) &&
                            (route.path !== routes.cashier_pa_transfer || is_payment_agent_transfer_visible) &&
                            (route.path !== routes.cashier_p2p || is_p2p_enabled) &&
                            (route.path !== routes.cashier_onramp || is_onramp_tab_visible) &&
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
                                        onClickLink={toggleDrawer}
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
            </MobileDrawer.SubMenu>
        );
    };

    const getLanguageRoutes = () => {
        const currentLanguage = getLanguage();

        return (
            <MobileDrawer.SubMenu
                has_subheader
                submenu_icon='IcLanguage'
                submenu_title={localize('Language')}
                submenu_suffix_icon='IcChevronRight'
                onToggle={expandSubMenu}
            >
                {Object.keys(getAllowedLanguages()).map((lang, idx) => (
                    <MobileDrawer.Item key={idx}>
                        <MenuLink
                            is_language
                            is_active={currentLanguage === lang}
                            link_to={lang}
                            icon={`IcFlag${lang.replace('_', '-')}`}
                            text={getAllowedLanguages()[lang]}
                            onClickLink={toggleDrawer}
                        />
                    </MobileDrawer.Item>
                ))}
            </MobileDrawer.SubMenu>
        );
    };

    const HelpCentreRoute = has_border_bottom => {
        return (
            <MobileDrawer.Item className={classNames({ 'header__menu-mobile-theme': has_border_bottom })}>
                <MenuLink
                    link_to={getStaticUrl('/help-centre')}
                    icon='IcHelpCentre'
                    text={localize('Help centre')}
                    onClickLink={toggleDrawer}
                />
            </MobileDrawer.Item>
        );
    };

    const { pathname: route } = useLocation();

    const history = useHistory();

    const is_trading_hub_category =
        route.startsWith(routes.trading_hub) || route.startsWith(routes.cashier) || route.startsWith(routes.account);

    const tradingHubRedirect = () => {
        if (is_pre_appstore) {
            setIsPreAppStore(false);
            toggleDrawer();
            history.push(routes.root);
        } else {
            setIsPreAppStore(true);
            toggleDrawer();
            history.push(routes.trading_hub);
        }
    };

    return (
        <React.Fragment>
            <a id='dt_mobile_drawer_toggle' onClick={toggleDrawer} className='header__mobile-drawer-toggle'>
                <Icon
                    icon={is_appstore && !is_logged_in ? 'IcHamburgerWhite' : 'IcHamburger'}
                    width='16px'
                    height='16px'
                    className='header__mobile-drawer-icon'
                />
            </a>
            <MobileDrawer
                alignment={is_appstore ? 'right' : 'left'}
                icon_class='header__menu-toggle'
                is_open={is_open}
                transitionExit={transitionExit}
                toggle={toggleDrawer}
                id='dt_mobile_drawer'
                enableApp={enableApp}
                disableApp={disableApp}
                title={localize('Menu')}
                height='100vh'
                width='295px'
            >
                <Div100vhContainer height_offset='40px'>
                    <div className='header__menu-mobile-body-wrapper'>
                        {is_appstore && (
                            <MobileDrawer.Body>
                                {primary_routes_config.map((route_config, idx) =>
                                    getRoutesWithSubMenu(route_config, idx)
                                )}
                            </MobileDrawer.Body>
                        )}
                        {is_pre_appstore && (
                            <React.Fragment>
                                {is_logged_in && is_trading_hub_category ? (
                                    <MobileDrawer.SubHeader
                                        className={classNames({
                                            'dc-mobile-drawer__subheader--hidden': is_submenu_expanded,
                                        })}
                                    >
                                        <Button
                                            className={`header__menu--exit-trading-hub ${
                                                is_dark_mode ? 'header__menu--exit-trading-hub--dark' : ''
                                            }`}
                                            type='button'
                                            large
                                            onClick={tradingHubRedirect}
                                        >
                                            <div className='header__menu--trading-hub-container'>
                                                <Text className='header__menu--trading-hub-text' size='xs'>
                                                    {localize("Exit Trader's hub")}
                                                </Text>
                                                <Icon
                                                    className='header__menu--exit-trading-hub-beta-icon'
                                                    icon='IcAppstoreTradingHubBeta'
                                                    size={30}
                                                />
                                                <Icon
                                                    className='header__menu-mobile-right-arrow'
                                                    icon='IcArrowRight'
                                                    size={18}
                                                    color='red'
                                                />
                                            </div>
                                        </Button>
                                    </MobileDrawer.SubHeader>
                                ) : (
                                    <MobileDrawer.SubHeader
                                        className={classNames({
                                            'dc-mobile-drawer__subheader--hidden': is_submenu_expanded,
                                        })}
                                    >
                                        <PlatformSwitcher
                                            app_routing_history={app_routing_history}
                                            is_mobile
                                            is_landing_company_loaded={is_landing_company_loaded}
                                            is_logged_in={is_logged_in}
                                            is_logging_in={is_logging_in}
                                            platform_config={platform_config}
                                            toggleDrawer={toggleDrawer}
                                        />
                                    </MobileDrawer.SubHeader>
                                )}
                                <MobileDrawer.Body>
                                    <div
                                        className='header__menu-mobile-platform-switcher'
                                        id='mobile_platform_switcher'
                                    />
                                    {is_logged_in && !is_trading_hub_category && (
                                        <MobileDrawer.Item className='header__menu--trading-hub'>
                                            <Button
                                                className={`header__menu--explore-trading-hub ${
                                                    is_dark_mode ? 'header__menu--explore-trading-hub--dark' : ''
                                                }`}
                                                type='button'
                                                large
                                                onClick={tradingHubRedirect}
                                            >
                                                <div className='header__menu--trading-hub-container'>
                                                    <Text className='header__menu--trading-hub-text' size='xs'>
                                                        {localize("Exit Trader's hub")}
                                                    </Text>
                                                    <Icon
                                                        className='header__menu--exit-trading-hub-beta-icon'
                                                        icon='IcAppstoreTradingHubBeta'
                                                        size={30}
                                                    />
                                                    <Icon
                                                        className='header__menu-mobile-right-arrow'
                                                        icon='IcArrowRight'
                                                        size={18}
                                                        color='red'
                                                    />
                                                </div>
                                            </Button>
                                        </MobileDrawer.Item>
                                    )}
                                    {is_logged_in && (
                                        <MobileDrawer.Item>
                                            <MenuLink
                                                link_to={routes.trading_hub}
                                                icon={is_dark_mode ? 'IcAppstoreHomeDark' : 'IcAppstoreHome'}
                                                text={localize("Trader's hub")}
                                                onClickLink={toggleDrawer}
                                            />
                                        </MobileDrawer.Item>
                                    )}
                                    {is_logged_in && !is_trading_hub_category && (
                                        <MobileDrawer.Item>
                                            <MenuLink
                                                link_to={routes.trade}
                                                icon='IcTrade'
                                                text={localize('Trade')}
                                                onClickLink={toggleDrawer}
                                            />
                                        </MobileDrawer.Item>
                                    )}
                                    {primary_routes_config.map((route_config, idx) =>
                                        getRoutesWithSubMenu(route_config, idx)
                                    )}
                                    <MobileDrawer.Item
                                        className='header__menu-mobile-theme'
                                        onClick={e => {
                                            e.preventDefault();
                                            toggleTheme(!is_dark_mode);
                                        }}
                                    >
                                        <div className={classNames('header__menu-mobile-link')}>
                                            <Icon className='header__menu-mobile-link-icon' icon={'IcTheme'} />
                                            <span className='header__menu-mobile-link-text'>
                                                {localize('Dark theme')}
                                            </span>
                                            <ToggleSwitch
                                                id='dt_mobile_drawer_theme_toggler'
                                                handleToggle={() => toggleTheme(!is_dark_mode)}
                                                is_enabled={is_dark_mode}
                                            />
                                        </div>
                                    </MobileDrawer.Item>
                                    {is_logged_in && (
                                        <React.Fragment>
                                            {HelpCentreRoute()}
                                            <MobileDrawer.Item>
                                                <MenuLink
                                                    link_to={routes.account_limits}
                                                    icon='IcAccountLimits'
                                                    text={localize('Account Limits')}
                                                    onClickLink={toggleDrawer}
                                                />
                                            </MobileDrawer.Item>
                                            <MobileDrawer.Item>
                                                <MenuLink
                                                    link_to={getStaticUrl('/responsible')}
                                                    icon='IcVerification'
                                                    text={localize('Responsible trading')}
                                                    onClickLink={toggleDrawer}
                                                />
                                            </MobileDrawer.Item>
                                            <MobileDrawer.Item>
                                                <MenuLink
                                                    link_to={getStaticUrl('/regulatory')}
                                                    icon='IcRegulatoryInformation'
                                                    text={localize('Regulatory information')}
                                                    onClickLink={toggleDrawer}
                                                />
                                            </MobileDrawer.Item>
                                            <MobileDrawer.Item className='header__menu-mobile-theme--trader-hub'>
                                                <MenuLink
                                                    link_to={getStaticUrl('/')}
                                                    icon='IcDerivOutline'
                                                    text={localize('Go to Deriv.com')}
                                                    onClickLink={toggleDrawer}
                                                />
                                            </MobileDrawer.Item>
                                            {liveChat.isReady && (
                                                <MobileDrawer.Item className='header__menu-mobile-whatsapp'>
                                                    <Icon icon='IcWhatsApp' className='drawer-icon' />
                                                    <a
                                                        className='header__menu-mobile-whatsapp-link'
                                                        href={whatsapp_url}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        onClick={toggleDrawer}
                                                    >
                                                        {localize('WhatsApp')}
                                                    </a>
                                                </MobileDrawer.Item>
                                            )}
                                            <MobileDrawer.Item className='header__menu-mobile-livechat'>
                                                {is_appstore ? null : <LiveChat is_mobile_drawer />}
                                            </MobileDrawer.Item>
                                            <MobileDrawer.Item
                                                onClick={() => {
                                                    logoutClient();
                                                    toggleDrawer();
                                                }}
                                                className='dc-mobile-drawer__item'
                                            >
                                                <MenuLink
                                                    link_to={routes.index}
                                                    icon='IcLogout'
                                                    text={localize('Log out')}
                                                />
                                            </MobileDrawer.Item>
                                            <MobileDrawer.Footer className='dc-mobile-drawer__footer--servertime'>
                                                <ServerTime is_mobile />
                                                <NetworkStatus is_mobile />
                                            </MobileDrawer.Footer>
                                        </React.Fragment>
                                    )}
                                </MobileDrawer.Body>
                            </React.Fragment>
                        )}

                        {!is_appstore && !is_pre_appstore && (
                            <React.Fragment>
                                <MobileDrawer.SubHeader
                                    className={classNames({
                                        'dc-mobile-drawer__subheader--hidden': is_submenu_expanded,
                                    })}
                                >
                                    <PlatformSwitcher
                                        app_routing_history={app_routing_history}
                                        is_mobile
                                        is_landing_company_loaded={is_landing_company_loaded}
                                        is_logged_in={is_logged_in}
                                        is_logging_in={is_logging_in}
                                        platform_config={platform_config}
                                        toggleDrawer={toggleDrawer}
                                    />
                                </MobileDrawer.SubHeader>
                                <MobileDrawer.Body>
                                    <div
                                        className='header__menu-mobile-platform-switcher'
                                        id='mobile_platform_switcher'
                                    />
                                    <MobileDrawer.Item className='header__menu--trading-hub'>
                                        <Button
                                            className={`header__menu--explore-trading-hub ${
                                                is_dark_mode ? 'header__menu--explore-trading-hub--dark' : ''
                                            }`}
                                            type='button'
                                            large
                                            onClick={tradingHubRedirect}
                                        >
                                            <div className='header__menu--trading-hub-container'>
                                                <Text className='header__menu--trading-hub-text' size='xs'>
                                                    {localize("Explore Trader's hub")}
                                                </Text>
                                                <Icon
                                                    className='header__menu--trading-hub-beta-icon'
                                                    icon='IcAppstoreTradingHubBeta'
                                                    size={30}
                                                />
                                                <Icon
                                                    className='header__menu-mobile-right-arrow'
                                                    icon='IcArrowRight'
                                                    size={18}
                                                    color='red'
                                                />
                                            </div>
                                        </Button>
                                    </MobileDrawer.Item>
                                    <MobileDrawer.Item>
                                        <MenuLink
                                            link_to={routes.trade}
                                            icon='IcTrade'
                                            text={localize('Trade')}
                                            onClickLink={toggleDrawer}
                                        />
                                    </MobileDrawer.Item>
                                    {primary_routes_config.map((route_config, idx) =>
                                        getRoutesWithSubMenu(route_config, idx)
                                    )}
                                    {getLanguageRoutes()}
                                    {
                                        <React.Fragment>
                                            <MobileDrawer.Item
                                                onClick={e => {
                                                    e.preventDefault();
                                                    toggleTheme(!is_dark_mode);
                                                }}
                                            >
                                                <div className={classNames('header__menu-mobile-link')}>
                                                    <Icon className='header__menu-mobile-link-icon' icon={'IcTheme'} />
                                                    <span className='header__menu-mobile-link-text'>
                                                        {localize('Dark theme')}
                                                    </span>
                                                    <ToggleSwitch
                                                        id='dt_mobile_drawer_theme_toggler'
                                                        handleToggle={() => toggleTheme(!is_dark_mode)}
                                                        is_enabled={is_dark_mode}
                                                    />
                                                </div>
                                            </MobileDrawer.Item>
                                            {HelpCentreRoute(true)}
                                        </React.Fragment>
                                    }
                                    {liveChat.isReady && (
                                        <MobileDrawer.Item className='header__menu-mobile-whatsapp'>
                                            <Icon icon='IcWhatsApp' className='drawer-icon' />
                                            <a
                                                className='header__menu-mobile-whatsapp-link'
                                                href={whatsapp_url}
                                                onClick={toggleDrawer}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                {localize('WhatsApp')}
                                            </a>
                                        </MobileDrawer.Item>
                                    )}
                                    <MobileDrawer.Item className='header__menu-mobile-livechat'>
                                        {is_appstore ? null : <LiveChat is_mobile_drawer />}
                                    </MobileDrawer.Item>
                                    {secondary_routes_config.map(route_config => getRoutesWithSubMenu(route_config))}
                                    {is_logged_in && (
                                        <MobileDrawer.Item
                                            onClick={() => {
                                                logoutClient();
                                                toggleDrawer();
                                            }}
                                        >
                                            <MenuLink icon='IcLogout' text={localize('Log out')} />
                                        </MobileDrawer.Item>
                                    )}
                                </MobileDrawer.Body>
                            </React.Fragment>
                        )}
                    </div>
                    {!is_pre_appstore && (
                        <MobileDrawer.Footer>
                            <ServerTime is_mobile />
                            <NetworkStatus is_mobile />
                        </MobileDrawer.Footer>
                    )}
                </Div100vhContainer>
            </MobileDrawer>
        </React.Fragment>
    );
});

ToggleMenuDrawer.displayName = 'ToggleMenuDrawer';

export default ToggleMenuDrawer;
