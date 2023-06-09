import React from 'react';
import classNames from 'classnames';

type TTicksHistoryCounter = {
    progress_dots_testid?: string;
    ticks_history_counter_testid?: string;
    has_progress_dots: boolean;
    value: number;
};

const TicksHistoryCounter = ({
    progress_dots_testid,
    ticks_history_counter_testid,
    has_progress_dots,
    value,
}: TTicksHistoryCounter) => (
    <div
        data-testid={ticks_history_counter_testid}
        className={classNames('accumulators-stats__history-counter', {
            'accumulators-stats__history-counter--emphasized': has_progress_dots && value === 0,
        })}
    >
        {value}
        {has_progress_dots && (
            <div className='accumulators-stats__progress-dots' data-testid={progress_dots_testid}>
                {[1, 2, 3].map(dot => {
                    return <span key={dot} className={`dot-${dot}`} />;
                })}
            </div>
        )}
    </div>
);

export default React.memo(TicksHistoryCounter);
