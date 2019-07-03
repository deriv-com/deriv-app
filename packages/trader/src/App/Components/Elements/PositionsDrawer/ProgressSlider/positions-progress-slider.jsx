import classNames            from 'classnames';
import PropTypes             from 'prop-types';
import React                 from 'react';
import { connect }           from 'Stores/connect';
import ProgressTicks         from './positions-progress-ticks.jsx';
import { getTimePercentage } from '../helpers';
import RemainingTime         from '../../../../Containers/remaining-time.jsx';

const ProgressSlider = ({
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
        <div className={classNames('progress-slider', className)}>
            {(ticks_count) ?
                <ProgressTicks
                    current_tick={current_tick}
                    ticks_count={ticks_count}
                />
                :
                <React.Fragment>
                    <span className='positions-drawer-card__remaining-time'>
                        <RemainingTime end_time={expiry_time} />
                    </span>
                    {(is_loading || (percentage < 1)) ?
                        <div className='progress-slider__infinite-loader'>
                            <div className='progress-slider__infinite-loader--indeterminate' />
                        </div>
                        :
                        /* Calculate line width based on percentage of time left */
                        <div className='progress-slider__track'>
                            <div
                                className={classNames('progress-slider__line', {
                                    'progress-slider__line--green' : (percentage >= 50),
                                    'progress-slider__line--orange': (percentage < 50 && percentage >= 20),
                                    'progress-slider__line--red'   : (percentage < 20),
                                })}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    }
                </React.Fragment>
            }
        </div>
    );
};
// Keypress events do not trigger on Safari due to the way it handles input type='range' elements, using focus on the input element also doesn't work for Safari.

ProgressSlider.propTypes = {
    className   : PropTypes.string,
    current_tick: PropTypes.number,
    expiry_time : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    is_loading : PropTypes.bool,
    server_time: PropTypes.object,
    start_time : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    ticks_count: PropTypes.number,
};

export default connect(({ common }) => ({
    server_time: common.server_time,
}))(ProgressSlider);
