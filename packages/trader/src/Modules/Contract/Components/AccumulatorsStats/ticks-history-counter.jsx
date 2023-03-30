import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TicksHistoryCounter = ({ has_progress_dots, should_highlight_current_spot, value }) => (
    <div
        data-testid='dt_accu_stats_history_counter'
        className={classNames('accumulators-stats__history-counter', {
            'accumulators-stats__history-counter--emphasized':
                has_progress_dots && (should_highlight_current_spot || value === 0),
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

TicksHistoryCounter.propTypes = {
    has_progress_dots: PropTypes.bool,
    should_highlight_current_spot: PropTypes.bool,
    value: PropTypes.number,
};

export default React.memo(TicksHistoryCounter);
