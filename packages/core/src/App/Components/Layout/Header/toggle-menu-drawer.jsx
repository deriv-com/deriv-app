import classNames from 'classnames';
import React from 'react';
import { Div100vhContainer, Icon, MobileDrawer, ToggleSwitch } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { WS } from 'Services';
import { NetworkStatus } from 'App/Components/Layout/Footer';
import ServerTime from 'App/Containers/server-time.jsx';
import { BinaryLink } from 'App/Components/Routes';
import getRoutesConfig from 'App/Constants/routes-config';
import LiveChat from '../../Elements/live-chat.jsx';

const MenuLink = ({ counter, link_to, icon, is_disabled, suffix_icon, text, onClickLink }) => (
    <React.Fragment>
        {!link_to ? (
            <div
                className={classNames('header__menu-mobile-link', {
                    'header__menu-mobile-link--disabled': is_disabled,
                })}
            >
                <Icon className='header__menu-mobile-link-icon' icon={icon} />
                <span className='header__menu-mobile-link-text'>{text}</span>
                {counter && <span className='header__menu-mobile-link-counter'>{counter}</span>}
                {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
            </div>
        ) : (
            <BinaryLink
                to={link_to}
                className={classNames('header__menu-mobile-link', {
                    'header__menu-mobile-link--disabled': is_disabled,
                })}
                active_class='header__menu-mobile-link--active'
                onClick={onClickLink}
            >
                <Icon className='header__menu-mobile-link-icon' icon={icon} />
                <span className='header__menu-mobile-link-text'>{text}</span>
                {counter && <span className='header__menu-mobile-link-counter'>{counter}</span>}
                {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
            </BinaryLink>
        )}
    </React.Fragment>
);

class ToggleMenuDrawer extends React.Component {
    constructor(props) {
        super(props);
        // TODO: find better fix for no-op issue
        this.is_mounted = false;
        this.state = {
            needs_financial_assessment: false,
            is_open: false,
            needs_verification: false,
            primary_routes_config: [],
            secondary_routes_config: [],
            is_submenu_expanded: false,
        };
    }

    componentDidMount() {
        this.is_mounted = true;
        WS.wait('authorize', 'get_account_status').then(() => {
            if (this.props.account_status) {
                const { authentication, status } = this.props.account_status;
                const needs_financial_assessment =
                    this.props.is_high_risk || status.includes('financial_information_not_complete');
                const needs_verification =
                    authentication.needs_verification.includes('identity') ||
                    authentication.needs_verification.includes('document');

                if (this.is_mounted) this.setState({ needs_financial_assessment, needs_verification });
            }
        });
        this.processRoutes();
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    toggleDrawer = () => {
        this.setState({ is_open: !this.state.is_open, is_submenu_expanded: false });
    };

    onToggleSubmenu = is_submenu_expanded => {
        this.setState({ is_submenu_expanded });
    };

    getFilteredRoutesConfig = (all_routes_config, routes_to_filter) => {
        const subroutes_config = all_routes_config.flatMap(i => i.routes || []);

        return routes_to_filter
            .map(path => all_routes_config.find(r => r.path === path) || subroutes_config.find(r => r.path === path))
            .filter(route => route);
    };

    getRoutesWithSubMenu = route_config => {
        const { needs_financial_assessment, needs_verification } = this.state;
        const has_access = route_config.is_authenticated ? this.props.is_logged_in : true;
        if (!has_access) return null;

        if (!route_config.routes) {
            return (
                <MobileDrawer.Item key={route_config.title}>
                    <MenuLink
                        counter={route_config.counter}
                        link_to={route_config.path}
                        icon={route_config.icon_component}
                        text={route_config.title}
                        onClickLink={this.toggleDrawer}
                    />
                </MobileDrawer.Item>
            );
        }

        const has_subroutes = route_config.routes.some(route => route.subroutes);
        return (
            <MobileDrawer.SubMenu
                key={route_config.title}
                has_subheader
                submenu_counter={route_config.counter}
                submenu_icon={route_config.icon_component}
                submenu_title={route_config.title}
                submenu_suffix_icon='IcChevronRight'
                onToggle={this.onToggleSubmenu}
            >
                {!has_subroutes &&
                    route_config.routes.map(route => {
                        if (
                            (route.path !== routes.cashier_pa || this.props.is_payment_agent_visible) &&
                            (route.path !== routes.cashier_pa_transfer ||
                                this.props.is_payment_agent_transfer_visible) &&
                            (route.path !== routes.cashier_p2p || this.props.is_p2p_visible) &&
                            (route.path !== routes.cashier_onramp || this.props.is_onramp_tab_visible)
                        ) {
                            return (
                                <MobileDrawer.Item key={route.title}>
                                    <MenuLink
                                        counter={route.counter}
                                        link_to={route.path}
                                        icon={route.icon_component}
                                        text={route.title}
                                        onClickLink={this.toggleDrawer}
                                    />
                                </MobileDrawer.Item>
                            );
                        }
                        return undefined;
                    })}
                {has_subroutes &&
                    route_config.routes.map(route => (
                        <MobileDrawer.SubMenuSection
                            key={route.title}
                            section_icon={route.icon}
                            section_title={route.title}
                        >
                            {route.subroutes.map(subroute => (
                                <MenuLink
                                    counter={subroute.counter}
                                    key={subroute.title}
                                    is_disabled={
                                        (!needs_verification &&
                                            !needs_financial_assessment &&
                                            /proof-of-identity|proof-of-address|financial-assessment/.test(
                                                subroute.path
                                            )) ||
                                        subroute.is_disabled
                                    }
                                    link_to={subroute.path}
                                    text={subroute.title}
                                    onClickLink={this.toggleDrawer}
                                />
                            ))}
                        </MobileDrawer.SubMenuSection>
                    ))}
            </MobileDrawer.SubMenu>
        );
    };

    processRoutes() {
        const routes_config = getRoutesConfig();
        const primary_routes = [routes.reports, routes.account, routes.cashier];
        const secondary_routes = [];

        this.setState({
            primary_routes_config: this.getFilteredRoutesConfig(routes_config, primary_routes),
            secondary_routes_config: this.getFilteredRoutesConfig(routes_config, secondary_routes),
        });
    }

    render() {
        const { primary_routes_config, secondary_routes_config } = this.state;

        return (
            <React.Fragment>
                <a id='dt_mobile_drawer_toggle' onClick={this.toggleDrawer} className='header__mobile-drawer-toggle'>
                    <Icon icon='IcHamburger' width='16px' height='16px' className='header__mobile-drawer-icon' />
                </a>
                <MobileDrawer
                    alignment='left'
                    icon_class='header__menu-toggle'
                    is_open={this.state.is_open}
                    toggle={this.toggleDrawer}
                    id='dt_mobile_drawer'
                    enableApp={this.props.enableApp}
                    disableApp={this.props.disableApp}
                    title={localize('Menu')}
                    livechat={<LiveChat is_mobile_drawer />}
                    height='100vh'
                    width='295px'
                >
                    <Div100vhContainer height_offset='40px'>
                        <div className='header__menu-mobile-body-wrapper'>
                            <MobileDrawer.SubHeader
                                className={classNames({
                                    'dc-mobile-drawer__subheader--hidden': this.state.is_submenu_expanded,
                                })}
                            >
                                {this.props.platform_switcher}
                            </MobileDrawer.SubHeader>
                            <MobileDrawer.Body>
                                <div className='header__menu-mobile-platform-switcher' id='mobile_platform_switcher' />
                                <MobileDrawer.Item>
                                    <MenuLink
                                        link_to={routes.trade}
                                        icon='IcTrade'
                                        text={localize('Trade')}
                                        onClickLink={this.toggleDrawer}
                                    />
                                </MobileDrawer.Item>
                                {primary_routes_config.map(route_config => this.getRoutesWithSubMenu(route_config))}
                                <MobileDrawer.Item
                                    className='header__menu-mobile-theme'
                                    onClick={e => {
                                        e.preventDefault();
                                        this.props.toggleTheme(!this.props.is_dark_mode);
                                    }}
                                >
                                    <div
                                        className={classNames('header__menu-mobile-link', {
                                            'header__menu-mobile-link--active': this.props.is_dark_mode,
                                        })}
                                    >
                                        <Icon className='header__menu-mobile-link-icon' icon={'IcTheme'} />
                                        <span className='header__menu-mobile-link-text'>{localize('Dark theme')}</span>
                                        <ToggleSwitch
                                            id='dt_mobile_drawer_theme_toggler'
                                            classNameLabel='header__menu-mobile-link-toggler-label'
                                            classNameButton={classNames('header__menu-mobile-link-toggler-button', {
                                                'header__menu-mobile-link-toggler-button--active': this.props
                                                    .is_dark_mode,
                                            })}
                                            handleToggle={() => this.props.toggleTheme(!this.props.is_dark_mode)}
                                            is_enabled={this.props.is_dark_mode}
                                        />
                                    </div>
                                </MobileDrawer.Item>
                                {secondary_routes_config.map(route_config => this.getRoutesWithSubMenu(route_config))}
                                {this.props.is_logged_in && (
                                    <MobileDrawer.Item
                                        onClick={() => {
                                            this.props.logoutClient();
                                            this.toggleDrawer();
                                        }}
                                    >
                                        <MenuLink icon='IcLogout' text={localize('Log out')} />
                                    </MobileDrawer.Item>
                                )}
                            </MobileDrawer.Body>
                        </div>
                        <MobileDrawer.Footer>
                            <ServerTime is_mobile />
                            <NetworkStatus is_mobile />
                        </MobileDrawer.Footer>
                    </Div100vhContainer>
                </MobileDrawer>
            </React.Fragment>
        );
    }
}

export default ToggleMenuDrawer;
