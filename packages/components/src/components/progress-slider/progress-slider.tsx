import classNames from 'classnames';
import React from 'react';
import { getTimePercentage } from '@deriv/shared';
import ProgressTicks from './progress-ticks.jsx';
import RemainingTime from '../remaining-time';
import Text from '../text';

type ProgressSliderProps = {
    className: string;
    current_tick: number;
    expiry_time: unknown | number | string;
    is_loading: boolean;
    server_time: unknown;
    start_time: unknown | number | string;
    ticks_count: number;
};

const ProgressSlider = ({
    className,
    current_tick,
    expiry_time,
    getCardLabels,
    is_loading,
    server_time,
    start_time,
    ticks_count,
}: ProgressSliderProps) => {
    const percentage = getTimePercentage(server_time, start_time, expiry_time);
    return (
        <div className={classNames('dc-progress-slider', className)}>
            {ticks_count ? (
                <ProgressTicks current_tick={current_tick} getCardLabels={getCardLabels} ticks_count={ticks_count} />
            ) : (
                <React.Fragment>
                    <Text size='xxxs' className='dc-progress-slider__remaining-time'>
                        <RemainingTime end_time={expiry_time} getCardLabels={getCardLabels} start_time={server_time} />
                    </Text>
                    {is_loading || percentage < 1 ? (
                        <div className='dc-progress-slider__infinite-loader'>
                            <div className='dc-progress-slider__infinite-loader--indeterminate' />
                        </div>
                    ) : (
                        /* Calculate line width based on percentage of time left */
                        <div className='dc-progress-slider__track'>
                            <div
                                className={classNames('dc-progress-slider__line', {
                                    'dc-progress-slider__line--green': percentage >= 50,
                                    'dc-progress-slider__line--yellow': percentage < 50 && percentage >= 20,
                                    'dc-progress-slider__line--red': percentage < 20,
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

export default ProgressSlider;
