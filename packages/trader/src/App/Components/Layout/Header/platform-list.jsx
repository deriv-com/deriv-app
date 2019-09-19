import React          from 'react';
import ReactDOM       from 'react-dom';
import PropTypes      from 'prop-types';
import Icon           from 'Assets/icon.jsx';
import { BinaryLink } from 'App/Components/Routes';

import 'Sass/app/_common/components/platform-list.scss';

const PlatformList = ({
    platform_config,
    handleClick,
}) => ReactDOM.createPortal(
    <React.Fragment>
        <div className='platform_switcher__list'>
            {platform_config.map((platform, idx) => (
                <BinaryLink to={platform.link_to} key={idx} onClick={handleClick}>
                    <div className='platform_switcher__list__platform platform_switcher__list__platform--active'>
                        <Icon className='platform_switcher__list__platform__icon' icon={platform.icon} />
                        <div className='platform_switcher__list__platform__details'>
                            <p className='platform_switcher__list__platform__title'>{platform.title}</p>
                            <p className='platform_switcher__list__platform__description'>{platform.description}</p>
                        </div>
                    </div>
                </BinaryLink>
            ))}
        </div>
        <div className='platform_switcher__dark' onClick={handleClick} />
    </React.Fragment>,
    document.getElementById('deriv_app')
);

PlatformList.propTypes = {
    platform_configs: PropTypes.array,
};

export { PlatformList };
