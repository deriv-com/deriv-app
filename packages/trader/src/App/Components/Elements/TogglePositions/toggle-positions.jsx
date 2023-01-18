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
            data-testid='dt_positions_toggle'
            className={positions_toggle_class}
            onClick={togglePositions}
            data-count={positions_count}
        >
            <Icon data_testid='dt_icon' icon='IcPortfolio' className='positions-toggle__icon' />
        </a>
    );
};

TogglePositions.propTypes = {
    is_open: PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    positions_count: PropTypes.number,
    togglePositions: PropTypes.func,
    togglePositionsDrawer: PropTypes.func,
};

export default TogglePositions;
