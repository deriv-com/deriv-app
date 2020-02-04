import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';
import 'Sass/app/_common/components/positions-toggle.scss';

const TogglePositions = ({ positions_count, is_open, togglePositions }) => {
    const positions_toggle_class = classNames('positions-toggle', {
        'positions-toggle--active': is_open,
        'positions-toggle--has-count': positions_count > 0,
    });
    return (
        <a
            id='dt_positions_toggle'
            className={positions_toggle_class}
            onClick={togglePositions}
            data-count={positions_count}
        >
            <Icon icon='IcPortfolio' className='positions-toggle__icon' />
        </a>
    );
};

TogglePositions.propTypes = {
    is_positions_drawer_on: PropTypes.bool,
    positions_count: PropTypes.number,
    togglePositionsDrawer: PropTypes.func,
};

export default TogglePositions;
