import PropTypes      from 'prop-types';
import React          from 'react';
import ReactDOM       from 'react-dom';
import posed, { PoseGroup }        from 'react-pose';
import { BinaryLink } from 'App/Components/Routes';
import Icon           from 'Assets/icon.jsx';
import 'Sass/app/_common/components/platform-list.scss';

const Container = posed.div({
    enter: {
        opacity   : 1,
        transition: { duration: 200 },
    },
    exit: {
        opacity   : 0,
        transition: { duration: 200 },
    },
});

const SlideFromTop = posed.div({
    enter: {
        top       : 48,
        transition: { duration: 200 },
    },
    exit: {
        top       : 0,
        transition: { duration: 200 },
    },
});

const PlatformList = ({
    platform_config,
    handleClick,
    is_open,
}) => ReactDOM.createPortal(
    <PoseGroup>
        { is_open &&
            <Container key='container' className='platform_switcher__container' onClick={handleClick}>
                <SlideFromTop key='slide_from_top' initialPose='exit' className='platform_switcher__list'>
                    {platform_config.map((platform, idx) => (
                        <BinaryLink to={platform.link_to} href={platform.href} key={idx} onClick={handleClick} className='platform_switcher__list__platform'>
                            <Icon className='platform_switcher__list__platform__icon' icon={platform.icon} />
                            <div className='platform_switcher__list__platform__details'>
                                <p className='platform_switcher__list__platform__title'>{platform.title}</p>
                                <p className='platform_switcher__list__platform__description'>{platform.description}</p>
                            </div>
                        </BinaryLink>
                    ))}
                </SlideFromTop>
            </Container>
        }
    </PoseGroup>,
    document.getElementById('deriv_app')
);

PlatformList.propTypes = {
    platform_configs: PropTypes.array,
};

export { PlatformList };
