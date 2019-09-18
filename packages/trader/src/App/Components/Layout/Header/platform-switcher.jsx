import PropTypes    from 'prop-types';
import React        from 'react';
import Icon         from 'Assets/icon.jsx';
import 'Sass/app/_common/components/platform-switcher.scss';

class PlatformSwitcher extends React.Component {
    render() {
        return (
            <div className='platform_switcher__list'>
                {this.props.platform_config.map((platform) => (
                    <div className='platform_switcher__list__platform platform_switcher__list__platform--active' key={platform.icon}>
                        <Icon className='platform_switcher__list__platform__icon' icon={platform.icon} />
                        <div className='platform_switcher__list__platform__details'>
                            <p className='platform_switcher__list__platform__title'>{platform.title}</p>
                            <p className='platform_switcher__list__platform__description'>{platform.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

PlatformSwitcher.propTypes = {
    platform_configs: PropTypes.array,
};

export { PlatformSwitcher };
