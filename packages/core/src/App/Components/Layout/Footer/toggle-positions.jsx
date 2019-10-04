import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import Icon       from 'Assets/icon.jsx';

const TogglePositions = ({
    positions_count,
    is_positions_drawer_on,
    togglePositionsDrawer,
}) => {
    const toggle_positions_class = classNames(
        'ic-positions',
        'footer__link', {
            'ic-positions--active'   : is_positions_drawer_on,
            'ic-positions--has-count': (positions_count > 0),
        }
    );
    return (
        <a
            id='dt_positions_toggle'
            className={toggle_positions_class}
            onClick={togglePositionsDrawer}
            data-count={positions_count}
        >
            <Icon icon='IconPositions' className='footer__icon ic-positions__icon' />
        </a>
    );
};

TogglePositions.propTypes = {
    is_positions_drawer_on: PropTypes.bool,
    positions_count       : PropTypes.number,
    togglePositionsDrawer : PropTypes.func,
};

export { TogglePositions };
