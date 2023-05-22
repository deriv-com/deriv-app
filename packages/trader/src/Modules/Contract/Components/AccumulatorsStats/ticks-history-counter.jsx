import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TicksHistoryCounter = ({ has_progress_dots, value, should_emphasize_last_counter }) => {
    const should_highlight_last_counter = should_emphasize_last_counter && has_progress_dots && value === 0;
    return (
        <div
            data-testid='dt_accu_stats_history_counter'
            className={classNames('accumulators-stats__history-counter', {
                'accumulators-stats__history-counter--emphasized': should_highlight_last_counter,
            })}
        >
            {value}
            {has_progress_dots && (
                <div className='accumulators-stats__progress-dots'>
                    {[1, 2, 3].map(dot => {
                        return <span key={dot} className={`dot-${dot}`} />;
                    })}
                </div>
            )}
        </div>
    );
};

TicksHistoryCounter.propTypes = {
    has_progress_dots: PropTypes.bool,
    value: PropTypes.number,
    should_emphasize_last_counter: PropTypes.bool,
};

export default React.memo(TicksHistoryCounter);
