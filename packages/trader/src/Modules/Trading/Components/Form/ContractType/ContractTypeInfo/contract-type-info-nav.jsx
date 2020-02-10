import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';

const Nav = ({ active_index, handleNavigationClick, list }) => {
    const handleNextClick = () => {
        const next_idx = active_index + 1;
        const is_reached_end = next_idx === list.length;

        if (!is_reached_end) {
            handleNavigationClick(list[next_idx]);
        } else {
            handleNavigationClick(list[0]);
        }
    };

    const handlePrevClick = () => {
        const prev_idx = active_index - 1;

        if (prev_idx > -1) {
            handleNavigationClick(list[prev_idx]);
        } else {
            handleNavigationClick(list[list.length - 1]);
        }
    };

    return (
        <nav className='contract-type-info__nav'>
            <span id='dt_contract_info_left_nav' className='contract-type-info__icon' onClick={handlePrevClick}>
                <Icon icon='IcChevronLeft' />
            </span>
            <ul className='contract-type-info__nav-list'>
                <li
                    className={classNames('contract-type-info__nav-item', 'contract-type-info__nav-item--active')}
                    style={{ transform: `translate3d(${24 * active_index}px, 0, 0)` }}
                />
                {list.map((contract, idx) => (
                    <li
                        key={idx}
                        className='contract-type-info__nav-item'
                        onClick={() => handleNavigationClick(contract)}
                    />
                ))}
            </ul>
            <span id='dt_contract_info_right_nav' className='contract-type-info__icon' onClick={handleNextClick}>
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
