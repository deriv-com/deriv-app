import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import ReactDOM       from 'react-dom';
import { BinaryLink } from 'App/Components/Routes';
import Icon           from 'Assets/icon.jsx';
import 'Sass/app/_common/components/platform-dropdown.scss';

const PlatformDropdown = ({
    platform_config,
    handleClick,
}) => ReactDOM.createPortal(
    <div className='platform_dropdown' onClick={handleClick}>
        <div className='platform_dropdown__list'>
            {platform_config.map((platform, idx) => {
                const is_bot = /^\/bot/.test(location.pathname);

                return (
                    <BinaryLink
                        to={platform.link_to}
                        href={platform.href}
                        key={idx}
                        onClick={handleClick}
                        className={classNames(
                            'platform_dropdown__list__platform',
                            { 'active': is_bot && platform.href === '/bot' }
                        )}
                    >
                        <Icon className='platform_dropdown__list__platform__icon' icon={platform.icon} />
                        <div className='platform_dropdown__list__platform__details'>
                            <p className='platform_dropdown__list__platform__title'>{platform.title}</p>
                            <p className='platform_dropdown__list__platform__description'>{platform.description}</p>
                        </div>
                    </BinaryLink>
                );
            }
            )}
        </div>
    </div>,
    document.getElementById('deriv_app'),
);

PlatformDropdown.propTypes = {
    platform_configs: PropTypes.array,
};

export { PlatformDropdown };
