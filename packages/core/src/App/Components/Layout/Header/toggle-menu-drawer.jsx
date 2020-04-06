import classNames from 'classnames';
import React from 'react';
import { Div100vhContainer, Icon, MobileDrawer, ToggleSwitch } from '@deriv/components';
import { getAllRoutesConfig } from '@deriv/shared/utils/route';
import { localize } from '@deriv/translations';
import { WS } from 'Services';
import routes from 'Constants/routes';
import { NetworkStatus } from 'App/Components/Layout/Footer';
import ServerTime from 'App/Containers/server-time.jsx';
import { BinaryLink } from 'App/Components/Routes';

const MenuLink = ({ link_to, icon, is_disabled, suffix_icon, text, onClickLink }) => (
    <React.Fragment>
        {!link_to ? (
            <div
                className={classNames('header__menu-mobile-link', {
                    'header__menu-mobile-link--disabled': is_disabled,
                })}
            >
                <Icon className='header__menu-mobile-link-icon' icon={icon} />
                <span className='header__menu-mobile-link-text'>{text}</span>
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
            is_high_risk_client: false,
            is_open: false,
            needs_verification: false,
        };
    }

    componentDidMount() {
        this.is_mounted = true;
        WS.wait('authorize', 'get_account_status').then(() => {
            if (this.props.account_status) {
                const { authentication } = this.props.account_status;
                const is_high_risk_client = this.props.is_high_risk;
                const needs_verification =
                    authentication.needs_verification.includes('identity') ||
                    authentication.needs_verification.includes('document');
                if (this.is_mounted) this.setState({ is_high_risk_client, needs_verification });
            }
        });
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    toggleDrawer = () => {
        this.setState({ is_open: !this.state.is_open });
    };

    getRoutesWithSubMenu = route_config => {
        const { is_high_risk_client, needs_verification } = this.state;
        const has_access = route_config.is_authenticated ? this.props.is_logged_in : true;
        if (!has_access || !route_config.routes) return null;
        const has_subroutes = route_config.routes.some(route => route.subroutes);
        return (
            <MobileDrawer.SubMenu
                key={route_config.title}
                has_subheader
                submenu_icon={route_config.icon_component}
                submenu_title={route_config.title}
                submenu_suffix_icon='IcChevronRight'
            >
                {!has_subroutes &&
                    route_config.routes.map(route => {
                        // TODO: Remove path checks below once the cashier routes below are ready to be enabled on mobile
                        if (route.path === '/cashier/p2p' || route.path === '/cashier/payment-agent-transfer')
                            return undefined;
                        return (
                            <MobileDrawer.Item key={route.title}>
                                <MenuLink
                                    link_to={route.path}
                                    icon={route.icon_component}
                                    text={route.title}
                                    onClickLink={this.toggleDrawer}
                                />
                            </MobileDrawer.Item>
                        );
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
                                    key={subroute.title}
                                    is_disabled={
                                        (!needs_verification &&
                                            !is_high_risk_client &&
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

    render() {
        const all_routes_config = getAllRoutesConfig();
        const allowed_routes = [routes.reports, routes.account, routes.cashier];
        const routes_config = allowed_routes
            .map(path => all_routes_config.find(r => r.path === path))
            .filter(route => route);
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
                    height='100vh'
                    width='295px'
                >
                    <Div100vhContainer height_offset='166px'>
                        <MobileDrawer.SubHeader>{this.props.platform_switcher}</MobileDrawer.SubHeader>
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
                            {routes_config.map(route_config => this.getRoutesWithSubMenu(route_config))}
                            <MobileDrawer.Item
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
                                    <span className='header__menu-mobile-link-text'>{localize('Dark Theme')}</span>
                                    <ToggleSwitch
                                        id='dt_mobile_drawer_theme_toggler'
                                        classNameLabel='header__menu-mobile-link-toggler-label'
                                        classNameButton={classNames('header__menu-mobile-link-toggler-button', {
                                            'header__menu-mobile-link-toggler-button--active': this.props.is_dark_mode,
                                        })}
                                        handleToggle={() => this.props.toggleTheme(!this.props.is_dark_mode)}
                                        is_enabled={this.props.is_dark_mode}
                                    />
                                </div>
                            </MobileDrawer.Item>
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
