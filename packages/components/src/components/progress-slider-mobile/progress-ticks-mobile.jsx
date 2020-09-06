import PropTypes from 'prop-types';
import React from 'react';
import TickProgress from '../tick-progress';

const ProgressTicksMobile = ({ current_tick, getCardLabels, ticks_count }) => {
    return (
        <div className='dc-progress-slider__ticks'>
            <span className='dc-progress-slider__ticks-caption'>
                {getCardLabels().TICK} {current_tick}
            </span>
            <TickProgress columns={5} rows={ticks_count > 5 ? 2 : 1} size={ticks_count} value={current_tick} />
        </div>
    );
};

ProgressTicksMobile.propTypes = {
    current_tick: PropTypes.number,
    ticks_count: PropTypes.number,
};

export default ProgressTicksMobile;
