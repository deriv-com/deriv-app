import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccumulatorStats from '../stats';
import TraderProviders from '../../../../trader-providers';
import { mockStore, useStore } from '@deriv/stores';

describe('AccumulatorStats', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mock_store = mockStore({
            modules: {
                trade: {
                    onChange: jest.fn(),
                    validation_errors: { barrier_1: [] },
                    duration: 10,
                    ticks_history_stats: {
                        ticks_stayed_in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    },
                },
            },
        });
    });

    const renderAccumulatorState = () => {
        render(
            <TraderProviders store={default_mock_store}>
                <AccumulatorStats />
            </TraderProviders>
        );
    };

    test('should render without crashing', () => {
        renderAccumulatorState();
        expect(screen.getByText('Stats')).toBeInTheDocument();
    });

    test('should render stats when data is available', () => {
        renderAccumulatorState();
        const stats = screen.getAllByText(/\d/);
        expect(stats.length).toBeGreaterThan(0);
    });

    test('should open description when heading is clicked', () => {
        renderAccumulatorState();
        const heading = screen.getByText('Stats');
        userEvent.click(heading);

        expect(
            screen.getByText(
                'Stats show the history of consecutive tick counts, i.e. the number of ticks the price remained within range continuously.'
            )
        ).toBeInTheDocument();
    });

    test('should open ActionSheet with stats when expand icon is clicked', () => {
        renderAccumulatorState();
        const expandIcon = screen.getByTestId('expand-stats-icon');
        userEvent.click(expandIcon);

        const historyText = screen.getByText('History of tick counts');
        expect(historyText).toBeInTheDocument();
    });

    test('should close ActionSheet when primary action is clicked', () => {
        renderAccumulatorState();
        const heading = screen.getByText('Stats');
        userEvent.click(heading);

        const gotItButton = screen.getByText('Got it');
        userEvent.click(gotItButton);

        expect(
            screen.queryByText(
                'Stats show the history of consecutive tick counts, i.e. the number of ticks the price remained within range continuously.'
            )
        ).not.toBeInTheDocument();
    });
});
