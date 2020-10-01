import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';

const Nav = ({ active_index, handleNavigationClick, list }) => {
    const handleNextClick = () => {
        const next_idx = active_index + 1;
        const is_reached_end = next_idx === list.length;

        if (!is_reached_end) {
            handleNavigationClick(next_idx);
        } else {
            handleNavigationClick(0);
        }
    };

    const handlePrevClick = () => {
        const prev_idx = active_index - 1;

        if (prev_idx > -1) {
            handleNavigationClick(prev_idx);
        } else {
            handleNavigationClick(list.length - 1);
        }
    };

    return (
        <nav className='carousel__nav'>
            <span id='dt_contract_info_left_nav' className='carousel__icon' onClick={handlePrevClick}>
                <Icon icon='IcChevronLeft' />
            </span>
            <ul className='carousel__nav-list'>
                <li
                    className={classNames('carousel__nav-item', 'carousel__nav-item--active')}
                    style={{ transform: `translate3d(${24 * active_index}px, 0, 0)` }}
                />
                {list.map((_, idx) => (
                    <li key={idx} className='carousel__nav-item' onClick={() => handleNavigationClick(idx)} />
                ))}
            </ul>
            <span id='dt_contract_info_right_nav' className='carousel__icon' onClick={handleNextClick}>
                <Icon icon='IcChevronRight' />
            </span>
        </nav>
    );
};

Nav.propTypes = {
    active_index: PropTypes.number,
    handleNavigationClick: PropTypes.func,
    list: PropTypes.array,
};

export default React.memo(Nav);
