import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getPlatformName, getPlatformIcon } from '@deriv/shared/utils/platform';
import { PlatformDropdown } from './platform-dropdown.jsx';
import 'Sass/app/_common/components/platform-switcher.scss';

class PlatformSwitcher extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { is_open: false };
    }

    toggleDrawer = () => this.setState(state => ({ is_open: !state.is_open }));
    closeDrawer = () => this.setState({ is_open: false });

    render = () => (
        <React.Fragment>
            <div
                className={classNames('platform_switcher', { 'platform_switcher--active': this.state.is_open })}
                onClick={this.toggleDrawer}
            >
                <Icon className='platform_switcher__icon' icon={getPlatformIcon()} size={32} />
                <h1 className='platform_switcher__header'>{getPlatformName()}</h1>
                <p className='platform_switcher__label'>{localize('BETA')}</p>
                <Icon className='platform_switcher__arrow' icon='IcChevronDownBold' />
            </div>
            <CSSTransition
                mountOnEnter
                in={this.state.is_open}
                classNames='platform_dropdown'
                timeout={this.state.is_open ? 0 : 250}
                unmountOnExit
            >
                <PlatformDropdown platform_config={this.props.platform_config} closeDrawer={this.closeDrawer} />
            </CSSTransition>
        </React.Fragment>
    );
}

PlatformSwitcher.propTypes = {
    platform_config: PropTypes.array,
};

export default withRouter(PlatformSwitcher);
