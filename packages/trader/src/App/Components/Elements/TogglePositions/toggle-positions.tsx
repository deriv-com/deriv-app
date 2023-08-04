import classNames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import 'Sass/app/_common/components/positions-toggle.scss';

type TTogglePositions = {
    positions_count: number;
    is_open: boolean;
    togglePositions: () => void;
};

const TogglePositions = ({ positions_count, is_open, togglePositions }: TTogglePositions) => {
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

export default TogglePositions;
