import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const DigitSpot = ({
    current_spot,
    is_selected_winning,
    is_lost,
    is_won,
}) => (
    <React.Fragment>
        <span className='digits__digit-spot-value'>
            {current_spot.slice(0, -1)}
        </span>
        <span
            className={classNames('digits__digit-spot-last', {
                'digits__digit-spot-last--selected-win': is_selected_winning,
                'digits__digit-spot-last--win'         : is_won,
                'digits__digit-spot-last--loss'        : is_lost,
            })}
        >
            {current_spot.slice(-1)}
        </span>
    </React.Fragment>
);

DigitSpot.propTypes = {
    current_spot: PropTypes.string,
    is_lost     : PropTypes.bool,
    is_won      : PropTypes.bool,
};

export default DigitSpot;
