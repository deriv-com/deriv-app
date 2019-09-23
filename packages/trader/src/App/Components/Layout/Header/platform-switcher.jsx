import PropTypes            from 'prop-types';
import React                from 'react';
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
            <div className='platform_switcher' onClick={this.handleClick}>
                <Icon icon='IconDeriv' className='platform_switcher__icon' />
                <p className='platform_switcher__header'>{localize('DTrader')}</p>
                <p className='platform_switcher__label'>{localize('BETA')}</p>
                <Icon icon='IconArrowBold' className='platform_switcher__arrow' />
            </div>
            <PlatformDropdown
                platform_config={this.props.platform_config}
                handleClick={this.handleClick}
                is_open={this.state.is_open}
            />
        </React.Fragment>
    );
}

PlatformSwitcher.propTypes = {
    platform_config: PropTypes.array,
};

export { PlatformSwitcher };
