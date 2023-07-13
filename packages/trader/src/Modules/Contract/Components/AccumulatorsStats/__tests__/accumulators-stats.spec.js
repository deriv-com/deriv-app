import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import AccumulatorsStats, { ROW_SIZES } from '../accumulators-stats';
import { TraderProviders } from '../../../../../trader-providers';
import { mockStore } from '@deriv/stores';

const mock_connect_props = {
    modules: {
        trade: {
            ticks_history_stats: {
                ticks_stayed_in: [
                    1, 65, 1234, 675, 234, 10, 658, 134, 5, 2394, 100, 6, 90, 9, 344, 81, 695, 14, 345, 2222,
                ],
                last_tick_epoch: 1005,
            },
        },
    },
};
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
    getUrlBase: jest.fn(() => 'video_src.mp4'),
}));

describe('AccumulatorsStats', () => {
    const modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');

    beforeEach(() => {
        isMobile.mockReturnValue(false);
        isDesktop.mockReturnValue(true);
    });

    it('should render as expandable', () => {
        const { container } = render(<AccumulatorsStats />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(container.querySelector('.accordion-toggle-arrow')).toBeInTheDocument();
    });
    it('should render as non-expandable', () => {
        const { container } = render(<AccumulatorsStats is_expandable={false} />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(container.querySelector('.accordion-toggle-arrow')).not.toBeInTheDocument();
    });
    it('should show manual after info icon is clicked', () => {
        const { container } = render(<AccumulatorsStats />, {
            container: document.body.appendChild(modal_root_el),
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        fireEvent.click(container.querySelector('.info'));
        expect(screen.getByTestId('dt_accumulators_stats_manual_video')).toBeInTheDocument();
    });
    it('should render partial history values (tick counters) when initially collapsed in desktop', () => {
        render(<AccumulatorsStats />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getAllByTestId('dt_accu_stats_history_counter').length).toEqual(ROW_SIZES.DESKTOP_COLLAPSED);
    });
    it('should render partial history values (tick counters) when initially collapsed in mobile', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);
        render(<AccumulatorsStats />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getAllByTestId('dt_accu_stats_history_counter').length).toEqual(ROW_SIZES.MOBILE_COLLAPSED);
    });
    it('should expand in desktop when accordion_toggle_arrow is clicked', () => {
        const { container } = render(<AccumulatorsStats />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getAllByTestId('dt_accu_stats_history_counter').length).toEqual(ROW_SIZES.DESKTOP_COLLAPSED);

        fireEvent.click(container.querySelector('.accordion-toggle-arrow'));
        const row = screen.getAllByTestId('dt_accu_stats_history_row')[0];
        expect(within(row).getAllByTestId('dt_accu_stats_history_counter').length).toEqual(ROW_SIZES.DESKTOP_EXPANDED);
        expect(screen.getAllByTestId('dt_accu_stats_history_counter').length).toEqual(20);
    });
    it('should show MobileDialog with full "Stay in history" in mobile when accordion_toggle_arrow is clicked', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);
        const { container } = render(<AccumulatorsStats />, {
            container: document.body.appendChild(modal_root_el),
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getAllByTestId('dt_accu_stats_history_counter').length).toEqual(ROW_SIZES.MOBILE_COLLAPSED);

        fireEvent.click(container.querySelector('.accordion-toggle-arrow'));
        const mobile_dialog = document.body.querySelector('.dc-mobile-dialog__accumulators-stats');
        const row = within(mobile_dialog).getAllByTestId('dt_accu_stats_history_row')[0];
        expect(within(row).getAllByTestId('dt_accu_stats_history_counter').length).toEqual(ROW_SIZES.MOBILE_EXPANDED);
        expect(within(mobile_dialog).getAllByTestId('dt_accu_stats_history_counter').length).toEqual(20);
    });
});
