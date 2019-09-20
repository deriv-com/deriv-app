import PropTypes        from 'prop-types';
import React            from 'react';
import Icon             from 'Assets/icon.jsx';
import { PlatformList } from './platform-list.jsx';
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
                <Icon icon='IconMT5' className='platform_switcher__icon' />
                <p className='platform_switcher__header'>DTrader</p>
                <p className='platform_switcher__label'>BETA</p>
                <Icon icon='IconArrowBold' />
            </div>
            { this.state.is_open &&
                <PlatformList
                    platform_config={this.props.platform_config}
                    handleClick={this.handleClick}
                    is_open={this.state.is_open}
                />
            }
        </React.Fragment>
    );
}

PlatformSwitcher.propTypes = {
    platform_config: PropTypes.array,
};

export { PlatformSwitcher };
