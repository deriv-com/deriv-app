import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { getTimePercentage } from '@deriv/shared';
import ProgressTicks from './progress-ticks.jsx';
import RemainingTime from '../remaining-time';

const ProgressSlider = ({
    card_labels,
    className,
    current_tick,
    expiry_time,
    is_loading,
    server_time,
    start_time,
    ticks_count,
}) => {
    const percentage = getTimePercentage(server_time, start_time, expiry_time);
    return (
        <div className={classNames('progress-slider', className)}>
            {ticks_count ? (
                <ProgressTicks card_labels={card_labels} current_tick={current_tick} ticks_count={ticks_count} />
            ) : (
                <React.Fragment>
                    <span className='progress-slider__remaining-time'>
                        <RemainingTime card_labels={card_labels} end_time={expiry_time} start_time={server_time} />
                    </span>
                    {is_loading || percentage < 1 ? (
                        <div className='progress-slider__infinite-loader'>
                            <div className='progress-slider__infinite-loader--indeterminate' />
                        </div>
                    ) : (
                        /* Calculate line width based on percentage of time left */
                        <div className='progress-slider__track'>
                            <div
                                className={classNames('progress-slider__line', {
                                    'progress-slider__line--green': percentage >= 50,
                                    'progress-slider__line--orange': percentage < 50 && percentage >= 20,
                                    'progress-slider__line--red': percentage < 20,
                                })}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};
// Keypress events do not trigger on Safari due to the way it handles input type='range' elements, using focus on the input element also doesn't work for Safari.

ProgressSlider.propTypes = {
    className: PropTypes.string,
    current_tick: PropTypes.number,
    expiry_time: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_loading: PropTypes.bool,
    server_time: PropTypes.object,
    start_time: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    ticks_count: PropTypes.number,
};

export default ProgressSlider;
