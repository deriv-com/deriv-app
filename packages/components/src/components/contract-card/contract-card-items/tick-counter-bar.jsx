import React from 'react';
import PropTypes from 'prop-types';
import Text from '../../text';

const TickCounterBar = ({ current_tick, label, max_ticks_duration }) => (
    <div className='dc-tick-counter-bar__container'>
        <div className='dc-tick-counter-bar__track'>
            <Text size='xxs' weight='bold' className='dc-tick-counter-bar__text'>
                {`${current_tick}/${max_ticks_duration} ${label}`}
            </Text>
        </div>
    </div>
);

TickCounterBar.propTypes = {
    current_tick: PropTypes.number,
    label: PropTypes.string,
    max_ticks_duration: PropTypes.number,
};

export default React.memo(TickCounterBar);
