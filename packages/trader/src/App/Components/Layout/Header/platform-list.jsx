import PropTypes      from 'prop-types';
import React          from 'react';
import ReactDOM       from 'react-dom';
import posed, { PoseGroup }        from 'react-pose';
import { BinaryLink } from 'App/Components/Routes';
import Icon           from 'Assets/icon.jsx';
import 'Sass/app/_common/components/platform-list.scss';

const SlideFromTop = posed.span({
    enter: {
        top       : 48,
        opacity   : 1,
        transition: {
            duration: 300,
        },
    },
    exit: {
        top       : 0,
        opacity   : 0,
        transition: {
            duration: 300,
        },
    },
});

const PlatformList = ({
    platform_config,
    handleClick,
    is_open,
}) => ReactDOM.createPortal(
    <PoseGroup>
        { is_open &&
        <SlideFromTop key='slide_from_top' initialPose='exit' style={{ position: 'fixed', zIndex: 5 }}>
            <div className='platform_switcher__list'>
                {platform_config.map((platform, idx) => (
                    <BinaryLink to={platform.link_to} href={platform.href} key={idx} onClick={handleClick} className='platform_switcher__list__platform'>
                        <Icon className='platform_switcher__list__platform__icon' icon={platform.icon} />
                        <div className='platform_switcher__list__platform__details'>
                            <p className='platform_switcher__list__platform__title'>{platform.title}</p>
                            <p className='platform_switcher__list__platform__description'>{platform.description}</p>
                        </div>
                    </BinaryLink>
                ))}
            </div>
            <div className='platform_switcher__dark' onClick={handleClick} />
        </SlideFromTop>
        }
    </PoseGroup>,
    document.getElementById('deriv_app')
);

PlatformList.propTypes = {
    platform_configs: PropTypes.array,
};

export { PlatformList };
