// import classNames             from 'classnames';
import React                  from 'react';
import { Icon, MobileDrawer } from '@deriv/components';
import { localize }           from '@deriv/translations';
import { NetworkStatus }      from 'App/Components/Layout/Footer';
import ServerTime             from 'App/Containers/server-time.jsx';

class ToggleMenuDrawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_open: false,
        };
    }

    toggleDrawer = () => {
        this.setState({ is_open: !this.state.is_open });
    }

    render() {
        return (
            <React.Fragment>
                <a
                    id='dt_mobile_drawer_toggle'
                    onClick={this.toggleDrawer}
                    className='header__mobile-drawer-toggle'
                >
                    <Icon
                        icon='IcHamburger'
                        width='16px'
                        height='16px'
                        className='header__mobile-drawer-icon'
                    />
                </a>
                <MobileDrawer
                    icon_class='header__menu-toggle'
                    is_open={this.state.is_open}
                    toggle={this.toggleDrawer}
                    id='dt_mobile_drawer'
                    className='mobile-drawer'
                    enableApp={this.props.enableApp}
                    disableApp={this.props.disableApp}
                    title={localize('Menu')}
                    height='100vh'
                    width='295px'
                >
                    <MobileDrawer.Header>
                        {this.props.platform_switcher}
                    </MobileDrawer.Header>
                    <MobileDrawer.Body>
                        <div
                            className='header__menu-mobile-platform-switcher'
                            id='dc_mobile_platform_switcher'
                        />
                        {'testing'}
                    </MobileDrawer.Body>
                    <MobileDrawer.Footer>
                        <ServerTime />
                        <NetworkStatus />
                    </MobileDrawer.Footer>
                </MobileDrawer>
            </React.Fragment>
        );
    }
}

export default ToggleMenuDrawer;
