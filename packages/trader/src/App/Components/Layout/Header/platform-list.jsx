import React        from 'react';
import ReactDOM     from 'react-dom';
import PropTypes    from 'prop-types';
import Icon         from 'Assets/icon.jsx';
import 'Sass/app/_common/components/platform-switcher.scss';

const PlatformList = ({
    platform_config,
}) => ReactDOM.createPortal(
    <React.Fragment>
        <div className='platform_switcher__list'>
            {platform_config.map((platform) => (
                <div className='platform_switcher__list__platform platform_switcher__list__platform--active' key={platform.icon}>
                    <Icon className='platform_switcher__list__platform__icon' icon={platform.icon} />
                    <div className='platform_switcher__list__platform__details'>
                        <p className='platform_switcher__list__platform__title'>{platform.title}</p>
                        <p className='platform_switcher__list__platform__description'>{platform.description}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className='platform_switcher__dark' />
    </React.Fragment>,
    document.getElementById('deriv_app')
);

PlatformList.propTypes = {
    platform_configs: PropTypes.array,
};

export { PlatformList };
