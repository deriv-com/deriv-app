import PropTypes            from 'prop-types';
import React                from 'react';
import { CSSTransition }    from 'react-transition-group';
import { localize }         from 'App/i18n';
import Icon                 from 'Assets/icon.jsx';
import { PlatformDropdown } from './platform-dropdown.jsx';
import 'Sass/app/_common/components/platform-switcher.scss';

class PlatformSwitcher extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { is_open: false };
    }

    handleClick = () => this.setState({ is_open: !this.state.is_open });

    render = () => (
        <React.Fragment>
            <CSSTransition
                in={this.state.is_open}
                classNames={'platform_switcher'}
                timeout={0}
            >
                <div className='platform_switcher' onClick={this.handleClick}>
                    <Icon className='platform_switcher__icon' icon='IconDeriv' />
                    <h1 className='platform_switcher__header'>{localize('DTrader')}</h1>
                    <p className='platform_switcher__label'>{localize('BETA')}</p>
                    <Icon className='platform_switcher__arrow' icon='IconArrowBold' />
                </div>
            </CSSTransition>
            <CSSTransition
                mountOnEnter
                in={this.state.is_open}
                classNames='platform_dropdown'
                timeout={this.state.is_open ? 0 : 250}
                unmountOnExit
            >
                <PlatformDropdown
                    platform_config={this.props.platform_config}
                    handleClick={this.handleClick}
                    is_open={this.state.is_open}
                />
            </CSSTransition>
        </React.Fragment>
    );
}

PlatformSwitcher.propTypes = {
    platform_config: PropTypes.array,
};

export { PlatformSwitcher };
