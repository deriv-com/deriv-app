import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const ProgressTicks = ({ current_tick, getCardLabels, ticks_count }) => {
    const arr_ticks = [...Array(ticks_count).keys()];
    return (
        <div className='dc-progress-slider__ticks'>
            <span className='dc-progress-slider__ticks-caption'>
                {getCardLabels().TICK} {current_tick}
            </span>
            <div className='dc-progress-slider__ticks-wrapper'>
                {arr_ticks.map(idx => (
                    <div
                        key={idx}
                        className={classNames('dc-progress-slider__ticks-step', {
                            'dc-progress-slider__ticks-step--marked': idx + 1 <= parseInt(current_tick),
                        })}
                    />
                ))}
            </div>
        </div>
    );
};

ProgressTicks.propTypes = {
    current_tick: PropTypes.number,
    ticks_count: PropTypes.number,
};

export default ProgressTicks;
