import React from 'react';
import PropTypes from 'prop-types';

const TicksHistoryCounter = ({ has_progress_dots, value }) => (
    <div data-testid='dt_accu_stats_history_counter' className='accumulators-stats__history-counter'>
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
    value: PropTypes.number,
};

export default React.memo(TicksHistoryCounter);
