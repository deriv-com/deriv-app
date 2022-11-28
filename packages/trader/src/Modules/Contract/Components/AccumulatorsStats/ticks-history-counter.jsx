import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TicksHistoryCounter = ({ has_progress_dots, value }) => {
    const [is_spot_emphasizing, setIsSpotEmphasizing] = React.useState(has_progress_dots && value === 0);

    React.useLayoutEffect(() => {
        let emphasizing_timeout;
        if (has_progress_dots && value === 0) {
            setIsSpotEmphasizing(true);
            emphasizing_timeout = setTimeout(() => {
                setIsSpotEmphasizing(false);
            }, 700);
        }
        return () => {
            clearTimeout(emphasizing_timeout);
        };
    }, [value]);

    return (
        <div
            data-testid='dt_accu_stats_history_counter'
            className={classNames('accumulators-stats__history-counter', {
                'accumulators-stats__spot-emphasizing': is_spot_emphasizing,
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
};

export default React.memo(TicksHistoryCounter);
