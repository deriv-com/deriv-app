import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@deriv/components';

const DigitSpot = ({ current_spot, is_selected_winning, is_lost, is_won }) => (
    <React.Fragment>
        <Text size='xs' align='center' weight='bold' className='digits__digit-spot-value'>
            {current_spot.slice(0, -1)}
        </Text>
        <span
            className={classNames('digits__digit-spot-last', {
                'digits__digit-spot-last--selected-win': is_selected_winning,
                'digits__digit-spot-last--win': is_won,
                'digits__digit-spot-last--loss': is_lost,
            })}
        >
            {current_spot.slice(-1)}
        </span>
    </React.Fragment>
);

DigitSpot.propTypes = {
    current_spot: PropTypes.string,
    is_lost: PropTypes.bool,
    is_selected_winning: PropTypes.bool,
    is_won: PropTypes.bool,
};

export default DigitSpot;
