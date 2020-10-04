import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Card from './carousel-card.jsx';
import Nav from './carousel-nav.jsx';
import Icon from '../icon';

const Carousel = ({
    className,
    handleSelect,
    initial_index,
    list,
    bullet_position,
    nav_position,
    show_bullet,
    show_nav,
}) => {
    const [active_index, setActiveIndex] = React.useState(initial_index);

    const handleNextClick = () => {
        const next_idx = active_index + 1;
        const is_reached_end = next_idx === list.length;

        if (!is_reached_end) {
            setActiveIndex(next_idx);
        } else {
            setActiveIndex(0);
        }
    };

    const handlePrevClick = () => {
        const prev_idx = active_index - 1;

        if (prev_idx > -1) {
            setActiveIndex(prev_idx);
        } else {
            setActiveIndex(list.length - 1);
        }
    };

    return (
        <div className={classNames('carousel', className)}>
            {list.length > 1 && (
                <Nav
                    active_index={active_index}
                    className='carousel__nav--upper'
                    handleNextClick={handleNextClick}
                    handlePrevClick={handlePrevClick}
                    handleNavigationClick={setActiveIndex}
                    show_bullet={show_bullet && bullet_position === 'top'}
                    show_nav={show_nav && nav_position === 'top'}
                    list={list}
                />
            )}
            <div className='carousel__container'>
                {nav_position === 'middle' && (
                    <span className='carousel__icon' onClick={handlePrevClick}>
                        <Icon icon='IcChevronLeft' size='24' />
                    </span>
                )}

                <div className='carousel__box'>
                    <div
                        className='carousel__wrapper'
                        style={{ transform: `translate3d(-${350 * active_index}px, 0, 0)` }}
                    >
                        {list.map((type, idx) => (
                            <Card key={idx} onClick={handleSelect}>
                                {list[idx]}
                            </Card>
                        ))}
                    </div>
                </div>

                {nav_position === 'middle' && (
                    <span className='carousel__icon' onClick={handleNextClick}>
                        <Icon icon='IcChevronRight' size='24' />
                    </span>
                )}
            </div>
            {list.length > 1 && (
                <Nav
                    active_index={active_index}
                    className='carousel__nav--lower'
                    handleNextClick={handleNextClick}
                    handlePrevClick={handlePrevClick}
                    handleNavigationClick={setActiveIndex}
                    show_bullet={show_bullet && bullet_position === 'bottom'}
                    show_nav={show_nav && nav_position === 'bottom'}
                    list={list}
                />
            )}
        </div>
    );
};

Carousel.defaultProps = {
    initial_index: 0,
    nav_position: 'bottom',
    bullet_position: 'bottom',
    show_bullet: true,
    show_nav: true,
};
Carousel.propTypes = {
    className: PropTypes.string,
    handleNavigationClick: PropTypes.func,
    handleSelect: PropTypes.func,
    item: PropTypes.object,
    list: PropTypes.array,
    nav_position: PropTypes.string,
    show_nav: PropTypes.bool,
    bullet_position: PropTypes.string,
    show_bullet: PropTypes.bool,
};

export default Carousel;
