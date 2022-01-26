import classNames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';

type DigitSpotProps = {
    current_spot: string;
    is_lost: boolean;
    is_won: boolean;
};

const DigitSpot = ({ current_spot, is_selected_winning, is_lost, is_won }: DigitSpotProps) => (
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

export default DigitSpot;
