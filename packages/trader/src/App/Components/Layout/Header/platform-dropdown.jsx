import PropTypes         from 'prop-types';
import React             from 'react';
import ReactDOM          from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { BinaryLink }    from 'App/Components/Routes';
import Icon              from 'Assets/icon.jsx';
import 'Sass/app/_common/components/platform-dropdown.scss';

const PlatformDropdown = ({
    platform_config,
    handleClick,
    is_open,
}) => ReactDOM.createPortal(
    <CSSTransition
        mountOnEnter
        in={is_open}
        classNames='platform_dropdown'
        unmountOnExit
    >
        <div className='platform_dropdown' onClick={handleClick}>
            <div className='platform_dropdown__list'>
                {platform_config.map((platform, idx) => (
                    <BinaryLink to={platform.link_to} href={platform.href} key={idx} onClick={handleClick} className='platform_dropdown__list__platform'>
                        <Icon className='platform_dropdown__list__platform__icon' icon={platform.icon} />
                        <div className='platform_dropdown__list__platform__details'>
                            <p className='platform_dropdown__list__platform__title'>{platform.title}</p>
                            <p className='platform_dropdown__list__platform__description'>{platform.description}</p>
                        </div>
                    </BinaryLink>
                ))}
            </div>
        </div>
    </CSSTransition>,
    document.getElementById('deriv_app'),
);

PlatformDropdown.propTypes = {
    platform_configs: PropTypes.array,
};

export { PlatformDropdown };
