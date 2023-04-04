import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import TicksHistoryCounter from './ticks-history-counter';

type TExpandedTicksHistoryProps = {
    history_text_size: string;
    rows: number[][];
};

const ExpandedTicksHistory = ({ history_text_size, rows }: TExpandedTicksHistoryProps) => (
    <Text size={history_text_size} className='accumulators-stats__history--expanded'>
        {rows.map((row, i) => (
            <div
                key={i.toString() + row[0]}
                data-testid='dt_accu_stats_history_row'
                className='accumulators-stats__row'
            >
                {row.map((counter, idx) => (
                    <TicksHistoryCounter
                        key={idx.toString() + counter}
                        value={counter}
                        has_progress_dots={i === 0 && idx === 0}
                    />
                ))}
            </div>
        ))}
    </Text>
);

ExpandedTicksHistory.propTypes = {
    history_text_size: PropTypes.string,
    rows: PropTypes.array,
};

export default React.memo(ExpandedTicksHistory);
