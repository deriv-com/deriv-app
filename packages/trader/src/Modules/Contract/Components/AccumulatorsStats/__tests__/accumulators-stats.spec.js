import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import AccumulatorsStats, { CONTRACT_TYPES, ROW_SIZES } from '../accumulators-stats';

const mock_connect_props = {
    stay_in_history: [
        { counter_value: 1, epoch: 1005 },
        { counter_value: 65, epoch: 1004 },
        { counter_value: 1234, epoch: 1003 },
        { counter_value: 675, epoch: 1002 },
        { counter_value: 234, epoch: 1001 },
        { counter_value: 10, epoch: 1000 },
        { counter_value: 658, epoch: 999 },
        { counter_value: 134, epoch: 998 },
        { counter_value: 5, epoch: 997 },
        { counter_value: 2394, epoch: 996 },
        { counter_value: 100, epoch: 995 },
        { counter_value: 6, epoch: 994 },
        { counter_value: 90, epoch: 993 },
        { counter_value: 9, epoch: 992 },
        { counter_value: 344, epoch: 991 },
        { counter_value: 81, epoch: 990 },
        { counter_value: 695, epoch: 989 },
        { counter_value: 14, epoch: 988 },
        { counter_value: 345, epoch: 987 },
        { counter_value: 2222, epoch: 986 },
    ],
    break_out_history: [
        { counter_value: 131, epoch: 1010 },
        { counter_value: 2853, epoch: 1009 },
        { counter_value: 423, epoch: 1008 },
        { counter_value: 33, epoch: 1007 },
        { counter_value: 1573, epoch: 1006 },
        { counter_value: 1312, epoch: 1005 },
        { counter_value: 23, epoch: 1004 },
        { counter_value: 4213, epoch: 1003 },
        { counter_value: 323, epoch: 1002 },
        { counter_value: 573, epoch: 1001 },
        { counter_value: 1313, epoch: 1000 },
        { counter_value: 223, epoch: 999 },
        { counter_value: 4238, epoch: 998 },
        { counter_value: 373, epoch: 997 },
        { counter_value: 193, epoch: 996 },
        { counter_value: 1317, epoch: 995 },
        { counter_value: 2883, epoch: 994 },
        { counter_value: 403, epoch: 993 },
        { counter_value: 303, epoch: 992 },
        { counter_value: 7777, epoch: 991 },
    ],
};

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => props => Component({ ...props, ...mock_connect_props }),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
    getUrlBase: jest.fn(() => 'image_src.svg'),
}));

describe('AccumulatorsStats', () => {
    const modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);
    const { break_out_history, stay_in_history } = mock_connect_props;

    beforeEach(() => {
        isMobile.mockReturnValue(false);
        isDesktop.mockReturnValue(true);
    });

    it('should render as expandable', () => {
        const { container } = render(<AccumulatorsStats />);
        expect(container.querySelector('.accordion-toggle-arrow')).toBeInTheDocument();
    });
    it('should render as non-expandable', () => {
        const { container } = render(<AccumulatorsStats is_expandable={false} />);
        expect(container.querySelector('.accordion-toggle-arrow')).not.toBeInTheDocument();
    });
    it('should switch to Break out history when switcher are clicked and back to Stay in history when clicked again', () => {
        render(<AccumulatorsStats />);
        expect(screen.getByText(`${CONTRACT_TYPES.STAY_IN} history`)).toBeInTheDocument();
        expect(screen.getByText(stay_in_history[0].counter_value)).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('dt_accu_stats_switcher'));
        expect(screen.getByText(`${CONTRACT_TYPES.BREAK_OUT} history`)).toBeInTheDocument();
        expect(screen.getByText(break_out_history[0].counter_value)).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('dt_accu_stats_switcher'));
        expect(screen.getByText(`${CONTRACT_TYPES.STAY_IN} history`)).toBeInTheDocument();
        expect(screen.getByText(stay_in_history[0].counter_value)).toBeInTheDocument();
    });
    it('should show manual after info icon is clicked', () => {
        const { container } = render(<AccumulatorsStats />);
        fireEvent.click(container.querySelector('.info'));
        expect(screen.getByAltText('accumulators_stats_manual')).toBeInTheDocument();
    });
    it('should render partial history values (tick counters) when initially collapsed in desktop', () => {
        render(<AccumulatorsStats />);
        expect(screen.getAllByTestId('dt_accu_stats_history_counter').length).toEqual(ROW_SIZES.DESKTOP_COLLAPSED);
    });
    it('should render partial history values (tick counters) when initially collapsed in mobile', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);
        render(<AccumulatorsStats />);
        expect(screen.getAllByTestId('dt_accu_stats_history_counter').length).toEqual(ROW_SIZES.MOBILE_COLLAPSED);
    });
    it('should expand in desktop when accordion_toggle_arrow is clicked', () => {
        const { container } = render(<AccumulatorsStats />);
        expect(screen.getAllByTestId('dt_accu_stats_history_counter').length).toEqual(ROW_SIZES.DESKTOP_COLLAPSED);

        fireEvent.click(container.querySelector('.accordion-toggle-arrow'));
        const row = screen.getAllByTestId('dt_accu_stats_history_row')[0];
        expect(within(row).getAllByTestId('dt_accu_stats_history_counter').length).toEqual(ROW_SIZES.DESKTOP_EXPANDED);
        expect(screen.getAllByTestId('dt_accu_stats_history_counter').length).toEqual(20);
    });
    it('should show MobileDialog with full "Stay in history" in mobile when accordion_toggle_arrow is clicked', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);
        const { container } = render(<AccumulatorsStats />);
        expect(screen.getAllByTestId('dt_accu_stats_history_counter').length).toEqual(ROW_SIZES.MOBILE_COLLAPSED);

        fireEvent.click(container.querySelector('.accordion-toggle-arrow'));
        const mobile_dialog = document.body.querySelector('.dc-mobile-dialog__accumulators-stats');
        const row = within(mobile_dialog).getAllByTestId('dt_accu_stats_history_row')[0];
        expect(within(row).getAllByTestId('dt_accu_stats_history_counter').length).toEqual(ROW_SIZES.MOBILE_EXPANDED);
        expect(within(mobile_dialog).getAllByTestId('dt_accu_stats_history_counter').length).toEqual(20);
    });
});
