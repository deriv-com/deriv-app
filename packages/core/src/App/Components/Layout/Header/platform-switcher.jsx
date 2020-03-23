import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getPlatformIcon, getPlatformHeader } from '@deriv/shared/utils/platform';
import { isMobile } from '@deriv/shared/utils/screen';
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

    render = () => (
        <React.Fragment>
            <div
                className={classNames(
                    'platform-switcher',
                    { 'platform-switcher--active': this.state.is_open },
                    { 'platform-switcher--is-mobile': isMobile() }
                )}
                onClick={this.toggleDrawer}
            >
                <Icon className='platform-switcher__icon' icon={getPlatformIcon()} size={32} />
                <h1 className='platform-switcher__header'>{getPlatformHeader()}</h1>
                <p className='platform-switcher__label'>{localize('BETA')}</p>
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
                <PlatformDropdown platform_config={this.props.platform_config} closeDrawer={this.closeDrawer} />
            </CSSTransition>
        </React.Fragment>
    );
}

PlatformSwitcher.propTypes = {
    platform_config: PropTypes.array,
};

export default withRouter(PlatformSwitcher);
