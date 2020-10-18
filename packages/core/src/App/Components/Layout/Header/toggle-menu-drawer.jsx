import classNames from 'classnames';
import React from 'react';
import { Div100vhContainer, Icon, MobileDrawer, ToggleSwitch } from '@deriv/components';
import { routes, PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { WS } from 'Services';
import { NetworkStatus } from 'App/Components/Layout/Footer';
import ServerTime from 'App/Containers/server-time.jsx';
import { BinaryLink } from 'App/Components/Routes';
import getRoutesConfig from 'App/Constants/routes-config';
import { getAllowedLanguages, currentLanguage, changeLanguage } from 'Utils/Language';
import LiveChat from '../../Elements/live-chat.jsx';

const MenuLink = ({ link_to, icon, is_active, is_disabled, is_language, suffix_icon, text, onClickLink }) => {
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
                    changeLanguage(link_to);
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
            <span className='header__menu-mobile-link-text'>{text}</span>
            {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
        </BinaryLink>
    );
};

class ToggleMenuDrawer extends React.Component {
    static contextType = PlatformContext;

    constructor(props) {
        super(props);
        // TODO: find better fix for no-op issue
        this.is_mounted = false;
        this.state = {
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
                const { status } = this.props.account_status;

                const allow_document_upload = status?.includes('allow_document_upload');
                if (this.is_mounted) this.setState({ allow_document_upload });
            }
        });
        this.processRoutes();
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    componentDidUpdate(prevProps) {
        // since ToggleMenuDrawer is rendered only once after initial load,
        // we need to add this update once account_status changes
        // TODO: Refactor ToggleMenuDrawer into functional component with hooks to eliminate need for componentDidUpdate
        if (this.props.account_status !== prevProps.account_status) {
            const allow_document_upload = this.props.account_status?.status?.includes('allow_document_upload');
            if (this.is_mounted) this.setState({ allow_document_upload });
        }
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

    getRoutesWithSubMenu = (route_config, idx) => {
        const { allow_document_upload } = this.state;
        const { needs_financial_assessment } = this.props;

        const has_access = route_config.is_authenticated ? this.props.is_logged_in : true;
        if (!has_access) return null;

        if (!route_config.routes) {
            return (
                <MobileDrawer.Item key={idx}>
                    <MenuLink
                        link_to={route_config.path}
                        icon={route_config.icon_component}
                        text={route_config.getTitle()}
                        onClickLink={this.toggleDrawer}
                    />
                </MobileDrawer.Item>
            );
        }
        const has_subroutes = route_config.routes.some(route => route.subroutes);
        return (
            <MobileDrawer.SubMenu
                key={idx}
                has_subheader
                submenu_icon={route_config.icon_component}
                submenu_title={route_config.getTitle()}
                submenu_suffix_icon='IcChevronRight'
                onToggle={this.onToggleSubmenu}
            >
                {!has_subroutes &&
                    route_config.routes.map((route, index) => {
                        if (
                            (route.path !== routes.cashier_pa || this.props.is_payment_agent_visible) &&
                            (route.path !== routes.cashier_pa_transfer ||
                                this.props.is_payment_agent_transfer_visible) &&
                            (route.path !== routes.cashier_p2p || this.props.is_p2p_enabled) &&
                            (route.path !== routes.cashier_onramp || this.props.is_onramp_tab_visible)
                        ) {
                            return (
                                <MobileDrawer.Item key={index}>
                                    <MenuLink
                                        link_to={route.path}
                                        icon={route.icon_component}
                                        text={route.getTitle()}
                                        onClickLink={this.toggleDrawer}
                                    />
                                </MobileDrawer.Item>
                            );
                        }
                        return undefined;
                    })}
                {has_subroutes &&
                    route_config.routes.map((route, index) => (
                        <MobileDrawer.SubMenuSection
                            key={index}
                            section_icon={route.icon}
                            section_title={route.getTitle()}
                        >
                            {route.subroutes.map((subroute, subindex) => (
                                <MenuLink
                                    key={subindex}
                                    is_disabled={
                                        (!allow_document_upload && /proof-of-address/.test(subroute.path)) ||
                                        (!allow_document_upload && /proof-of-identity/.test(subroute.path)) ||
                                        (!needs_financial_assessment && /financial-assessment/.test(subroute.path)) ||
                                        subroute.is_disabled
                                    }
                                    link_to={subroute.path}
                                    text={subroute.getTitle()}
                                    onClickLink={this.toggleDrawer}
                                />
                            ))}
                        </MobileDrawer.SubMenuSection>
                    ))}
            </MobileDrawer.SubMenu>
        );
    };

    getLanguageRoutes = () => {
        return (
            <MobileDrawer.SubMenu
                has_subheader
                submenu_icon='IcLanguage'
                submenu_title={localize('Language')}
                submenu_suffix_icon='IcChevronRight'
                onToggle={this.onToggleSubmenu}
            >
                {Object.keys(getAllowedLanguages()).map((lang, idx) => (
                    <MobileDrawer.Item key={idx}>
                        <MenuLink
                            is_language
                            is_active={currentLanguage === lang}
                            link_to={lang}
                            icon={`IcFlag${lang.replace('_', '-')}`}
                            text={getAllowedLanguages()[lang]}
                            onClickLink={this.toggleDrawer}
                        />
                    </MobileDrawer.Item>
                ))}
            </MobileDrawer.SubMenu>
        );
    };

    processRoutes() {
        const { is_deriv_crypto } = this.context;
        const routes_config = getRoutesConfig({ is_deriv_crypto });
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
                                {primary_routes_config.map((route_config, idx) =>
                                    this.getRoutesWithSubMenu(route_config, idx)
                                )}
                                {this.getLanguageRoutes()}
                                {this.props.platform_header !== 'DBot' && (
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
                                            <span className='header__menu-mobile-link-text'>
                                                {localize('Dark theme')}
                                            </span>
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
                                )}

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
