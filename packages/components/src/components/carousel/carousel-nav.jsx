import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';

const Nav = ({
    active_index,
    className,
    handleNextClick,
    handlePrevClick,
    handleNavigationClick,
    list,
    show_bullet,
    show_nav,
}) => {
    return (
        <nav className={classNames('carousel__nav', className)}>
            {show_nav && (
                <span id='dt_contract_info_left_nav' className='carousel__icon' onClick={handlePrevClick}>
                    <Icon icon='IcChevronLeft' />
                </span>
            )}
            {show_bullet && (
                <ul className='carousel__nav-list'>
                    <li
                        className={classNames('carousel__nav-item', 'carousel__nav-item--active')}
                        style={{ transform: `translate3d(${24 * active_index}px, 0, 0)` }}
                    />
                    {list.map((_, idx) => (
                        <li key={idx} className='carousel__nav-item' onClick={() => handleNavigationClick(idx)} />
                    ))}
                </ul>
            )}
            {show_nav && (
                <span id='dt_contract_info_right_nav' className='carousel__icon' onClick={handleNextClick}>
                    <Icon icon='IcChevronRight' />
                </span>
            )}
        </nav>
    );
};

Nav.propTypes = {
    active_index: PropTypes.number,
    handleNavigationClick: PropTypes.func,
    list: PropTypes.array,
    show_bullet: PropTypes.bool,
};

export default React.memo(Nav);
