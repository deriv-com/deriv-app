import classNames from 'classnames';
import React from 'react';
import { Div100vhContainer, Icon, MobileDrawer, ToggleSwitch } from '@deriv/components';
import { localize } from '@deriv/translations';
import routes from 'Constants/routes';
import { NetworkStatus } from 'App/Components/Layout/Footer';
import ServerTime from 'App/Containers/server-time.jsx';
import { BinaryLink } from 'App/Components/Routes';

const MenuLink = ({ link_to, icon, suffix_icon, text, onClickLink }) => (
    <React.Fragment>
        {!link_to ? (
            <div className='header__menu-mobile-link'>
                <Icon className='header__menu-mobile-link-icon' icon={icon} />
                <span className='header__menu-mobile-link-text'>{text}</span>
                {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
            </div>
        ) : (
            <BinaryLink
                to={link_to}
                className='header__menu-mobile-link'
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

class ToggleMenuDrawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_open: false,
        };
    }

    toggleDrawer = () => {
        this.setState({ is_open: !this.state.is_open });
    };

    render() {
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
                            {this.props.is_logged_in && (
                                <MobileDrawer.SubMenu
                                    has_subheader
                                    submenu_icon='IcReports'
                                    submenu_title={localize('Reports')}
                                    submenu_suffix_icon='IcChevronRight'
                                >
                                    <MobileDrawer.Item>
                                        <MenuLink
                                            link_to={routes.positions}
                                            icon='IcPortfolio'
                                            text={localize('Open positions')}
                                            onClickLink={this.toggleDrawer}
                                        />
                                    </MobileDrawer.Item>
                                    <MobileDrawer.Item>
                                        <MenuLink
                                            link_to={routes.profit}
                                            icon='IcProfitTable'
                                            text={localize('Profit table')}
                                            onClickLink={this.toggleDrawer}
                                        />
                                    </MobileDrawer.Item>
                                    <MobileDrawer.Item>
                                        <MenuLink
                                            link_to={routes.statement}
                                            icon='IcStatement'
                                            text={localize('Statements')}
                                            onClickLink={this.toggleDrawer}
                                        />
                                    </MobileDrawer.Item>
                                </MobileDrawer.SubMenu>
                            )}
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
