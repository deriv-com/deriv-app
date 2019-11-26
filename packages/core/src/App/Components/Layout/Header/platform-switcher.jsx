import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import { withRouter }       from 'react-router-dom';
import { CSSTransition }    from 'react-transition-group';
import { localize }         from 'deriv-translations';
import Icon                 from 'Assets/icon.jsx';
import { isBot, isMT5 }     from 'Utils/PlatformSwitcher';
import { PlatformDropdown } from './platform-dropdown.jsx';
import 'Sass/app/_common/components/platform-switcher.scss';

class PlatformSwitcher extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { is_open: false };
    }

    toggleDrawer = () => this.setState(state => ({ is_open: !state.is_open }));
    closeDrawer  = () => this.setState({ is_open: false });

    render = () => (
        <React.Fragment>
            <div
                className={classNames(
                    'platform_switcher',
                    { 'platform_switcher--active': this.state.is_open }
                )}
                onClick={this.toggleDrawer}
            >
                <Icon
                    className='platform_switcher__icon'
                    icon={ (isBot() ? 'IconDBot' : (isMT5() ? 'IconMT5' : 'IconDeriv')) }
                />
                <h1 className='platform_switcher__header'>
                    { (isBot() ? 'DBot' : (isMT5() ? 'DMT5' : 'DTrader')) }
                </h1>
                <p className='platform_switcher__label'>{localize('BETA')}</p>
                <Icon className='platform_switcher__arrow' icon='IconArrowBold' />
            </div>
            <CSSTransition
                mountOnEnter
                in={this.state.is_open}
                classNames='platform_dropdown'
                timeout={this.state.is_open ? 0 : 250}
                unmountOnExit
            >
                <PlatformDropdown
                    platform_config={this.props.platform_config}
                    closeDrawer={this.closeDrawer}
                />
            </CSSTransition>
        </React.Fragment>
    );
}

PlatformSwitcher.propTypes = {
    platform_config: PropTypes.array,
};

export default withRouter(PlatformSwitcher);
