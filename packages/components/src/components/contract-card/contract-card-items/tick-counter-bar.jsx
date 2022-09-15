import React from 'react';
import PropTypes from 'prop-types';
import { localize } from '@deriv/translations';
import Text from '../../text';

const TickCounterBar = ({ current_tick, max_ticks_duration }) => (
    <div className='dc-tick-counter-bar__container'>
        <div className='dc-tick-counter-bar__track'>
            <Text size='xxs' weight='bold' className='dc-tick-counter-bar__text'>
                {localize('{{current_tick}}/{{max_ticks_duration}} Ticks', {
                    current_tick,
                    max_ticks_duration,
                })}
            </Text>
        </div>
    </div>
);

TickCounterBar.propTypes = {
    current_tick: PropTypes.number,
    max_ticks_duration: PropTypes.number,
};

export default React.memo(TickCounterBar);
