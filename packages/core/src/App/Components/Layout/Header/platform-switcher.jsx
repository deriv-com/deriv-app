import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Icon } from '@deriv/components';
import { getPlatformInformation, isMobile } from '@deriv/shared';

import { PlatformSwitcherLoader } from './Components/Preloader/platform-switcher.jsx';
import { PlatformDropdown } from './platform-dropdown.jsx';
import 'Sass/app/_common/components/platform-switcher.scss';

class PlatformSwitcher extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { is_open: false };
    }

    toggleDrawer = () => this.setState(state => ({ is_open: !state.is_open }));
    closeDrawer = () => {
        this.setState({ is_open: false }, () => {
            if (typeof this.props.toggleDrawer === 'function') {
                this.props.toggleDrawer();
            }
        });
    };

    render = () => {
        return this.props.app_routing_history.length === 0 ? (
            <div
                className={classNames('platform-switcher__preloader', {
                    'platform-switcher__preloader--is-mobile': isMobile(),
                })}
            >
                <PlatformSwitcherLoader is_mobile={isMobile()} speed={3} />
            </div>
        ) : (
            <React.Fragment>
                <div
                    className={classNames(
                        'platform-switcher',
                        { 'platform-switcher--active': this.state.is_open },
                        { 'platform-switcher--is-mobile': isMobile() }
                    )}
                    onClick={this.toggleDrawer}
                >
                    <Icon
                        className='platform-switcher__icon'
                        icon={getPlatformInformation(this.props.app_routing_history).icon}
                        size={32}
                    />
                    <h1 className='platform-switcher__header'>
                        {getPlatformInformation(this.props.app_routing_history).header}
                    </h1>
                    <Icon className='platform-switcher__arrow' icon='IcChevronDownBold' />
                </div>
                <CSSTransition
                    mountOnEnter
                    appear
                    in={this.state.is_open}
                    classNames={{
                        enterDone: 'platform-dropdown--enter-done',
                    }}
                    timeout={!isMobile() && this.state.is_open ? 0 : 250}
                    unmountOnExit
                >
                    <PlatformDropdown
                        platform_config={this.props.platform_config}
                        closeDrawer={this.closeDrawer}
                        app_routing_history={this.props.app_routing_history}
                    />
                </CSSTransition>
            </React.Fragment>
        );
    };
}

PlatformSwitcher.propTypes = {
    platform_config: PropTypes.array,
};

export default withRouter(PlatformSwitcher);
