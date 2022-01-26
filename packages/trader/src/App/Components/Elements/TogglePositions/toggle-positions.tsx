import classNames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import 'Sass/app/_common/components/positions-toggle.scss';

type TogglePositionsProps = {
    is_positions_drawer_on: boolean;
    positions_count: number;
    togglePositionsDrawer: () => void;
};

const TogglePositions = ({ positions_count, is_open, togglePositions }: TogglePositionsProps) => {
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

export default TogglePositions;
