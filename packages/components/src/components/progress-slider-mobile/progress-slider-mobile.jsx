import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { getTimePercentage } from '@deriv/shared';
import ProgressTicksMobile from './progress-ticks-mobile.jsx';
import CircularProgress from '../circular-progress';
import RemainingTime from '../remaining-time';

const ProgressSliderMobile = ({
    card_labels,
    className,
    current_tick,
    is_loading,
    start_time,
    expiry_time,
    server_time,
    ticks_count,
}) => {
    const percentage = getTimePercentage(server_time, start_time, expiry_time);
    return (
        <div className={classNames('progress-slider-mobile', className)}>
            {ticks_count ? (
                <ProgressTicksMobile card_labels={card_labels} current_tick={current_tick} ticks_count={ticks_count} />
            ) : (
                <React.Fragment>
                    <span className='progress-slider-mobile__remaining-time'>
                        <RemainingTime card_labels={card_labels} end_time={expiry_time} start_time={server_time} />
                    </span>
                    {is_loading || percentage < 1 ? (
                        // TODO: Change this behavior in mobile
                        <div className='progress-slider-mobile__infinite-loader'>
                            <div className='progress-slider-mobile__infinite-loader--indeterminate' />
                        </div>
                    ) : (
                        <CircularProgress
                            className='progress-slider-mobile__timer'
                            danger_limit={20}
                            icon='IcClockOutline'
                            progress={percentage}
                            warning_limit={50}
                        />
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

ProgressSliderMobile.propTypes = {
    className: PropTypes.string,
    current_tick: PropTypes.number,
    expiry_time: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_loading: PropTypes.bool,
    server_time: PropTypes.object,
    start_time: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    ticks_count: PropTypes.number,
};

export default ProgressSliderMobile;
