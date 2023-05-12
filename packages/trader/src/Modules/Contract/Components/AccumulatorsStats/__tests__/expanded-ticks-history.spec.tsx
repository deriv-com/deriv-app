import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpandedTicksHistory from '../expanded-ticks-history';

describe('ExpandedTicksHistory', () => {
    const mocked_props = {
        history_text_size: 'xxs',
        rows: [
            [11, 26, 39, 64, 41, 258, 22, 14, 5, 18, 30, 658, 53, 2, 0],
            [65, 270, 654, 229, 3, 69, 40, 43, 7, 80, 17, 34, 93, 103, 16],
            [25, 13, 27, 126, 9, 182, 8, 58, 91, 181, 81, 169, 316, 6, 57],
        ],
    };
    it('should render values of all TicksHistoryCounters in rows', () => {
        render(<ExpandedTicksHistory {...mocked_props} />);
        mocked_props.rows.forEach(row => {
            row.forEach(counter => {
                expect(screen.getByText(counter)).toBeInTheDocument();
            });
        });
        expect(screen.getAllByTestId('dt_accu_stats_history_counter')).toHaveLength(45);
    });
    it('should render the corrent number of TicksHistoryCounters', () => {
        render(<ExpandedTicksHistory {...mocked_props} />);
        expect(screen.getAllByTestId('dt_accu_stats_history_counter')).toHaveLength(45);
    });
});
