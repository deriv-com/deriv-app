import classNames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';

type TDigitSpot = {
    current_spot?: string | null;
    is_selected_winning?: boolean;
    is_lost?: boolean;
    is_won?: boolean;
};

const DigitSpot = ({ current_spot, is_selected_winning, is_lost, is_won }: TDigitSpot) => (
    <React.Fragment>
        <Text
            size='xs'
            align='center'
            weight='bold'
            className='digits__digit-spot-value'
            data-testid='dt_digits_digit_spot_value'
        >
            {current_spot?.slice(0, -1)}
        </Text>
        <span
            className={classNames('digits__digit-spot-last', {
                'digits__digit-spot-last--selected-win': is_selected_winning,
                'digits__digit-spot-last--win': is_won,
                'digits__digit-spot-last--loss': is_lost,
            })}
            data-testid='dt_digits_digit_spot_last'
        >
            {current_spot?.slice(-1)}
        </span>
    </React.Fragment>
);

export default DigitSpot;
