import React from 'react';
import { render, screen } from '@testing-library/react';
import TicksHistoryCounter from '../ticks-history-counter';

describe('TicksHistoryCounter', () => {
    let mock_props;
    beforeEach(() => {
        mock_props = {
            has_progress_dots: false,
            value: 1234,
        };
    });

    it('should render TicksHistoryCounter without dots and not highlighted', () => {
        render(<TicksHistoryCounter {...mock_props} />);

        const accu_stats_wrapper = screen.getByTestId('dt_accu_stats_history_counter');
        expect(accu_stats_wrapper).toHaveTextContent(1234);
        expect(accu_stats_wrapper).toHaveClass('accumulators-stats__history-counter');
        expect(accu_stats_wrapper).not.toHaveClass('accumulators-stats__history-counter--emphasized');
        expect(accu_stats_wrapper.firstElementChild).not.toBeInTheDocument();
    });

    it('should render TicksHistoryCounter with dots and not highlighted', () => {
        mock_props.has_progress_dots = true;

        render(<TicksHistoryCounter {...mock_props} />);

        const accu_stats_wrapper = screen.getByTestId('dt_accu_stats_history_counter');
        expect(accu_stats_wrapper).toHaveTextContent(1234);
        expect(accu_stats_wrapper).toHaveClass('accumulators-stats__history-counter');
        expect(accu_stats_wrapper).not.toHaveClass('accumulators-stats__history-counter--emphasized');
        expect(accu_stats_wrapper.firstElementChild).toHaveClass('accumulators-stats__progress-dots');
    });

    it('should render TicksHistoryCounter with dots and highlighted', () => {
        mock_props.has_progress_dots = true;
        mock_props.should_emphasize_last_counter = true;
        mock_props.value = 0;

        render(<TicksHistoryCounter {...mock_props} />);

        const accu_stats_wrapper = screen.getByTestId('dt_accu_stats_history_counter');
        expect(accu_stats_wrapper).toHaveTextContent(0);
        expect(accu_stats_wrapper).toHaveClass('accumulators-stats__history-counter');
        expect(accu_stats_wrapper).toHaveClass('accumulators-stats__history-counter--emphasized');
        expect(accu_stats_wrapper.firstElementChild).toHaveClass('accumulators-stats__progress-dots');
    });
});
