import React from 'react';
import classNames from 'classnames';

type TTicksHistoryCounter = {
    data_testid_progress_dots?: string;
    data_testid_ticks_history_counter?: string;
    has_progress_dots: boolean;
    value: number;
};

const TicksHistoryCounter = ({
    data_testid_progress_dots,
    data_testid_ticks_history_counter,
    has_progress_dots,
    value,
}: TTicksHistoryCounter) => (
    <div
        data-testid={data_testid_ticks_history_counter}
        className={classNames('accumulators-stats__history-counter', {
            'accumulators-stats__history-counter--emphasized': has_progress_dots && value === 0,
        })}
    >
        {value}
        {has_progress_dots && (
            <div className='accumulators-stats__progress-dots' data-testid={data_testid_progress_dots}>
                {[1, 2, 3].map(dot => {
                    return <span key={dot} className={`dot-${dot}`} />;
                })}
            </div>
        )}
    </div>
);

export default React.memo(TicksHistoryCounter);
