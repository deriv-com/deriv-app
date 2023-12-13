import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { onChangeCancellationDuration, onToggleCancellation } from 'Stores/Modules/Trading/Helpers/multiplier';
import CancelDeal from '../cancel-deal';
import TraderProviders from '../../../../../../../trader-providers';

const dropdown = 'Dropdown';
const deal_cancellation = 'Deal cancellation';
const popover = 'dt_popover_wrapper';

jest.mock('Stores/Modules/Trading/Helpers/multiplier', () => ({
    ...jest.requireActual('Stores/Modules/Trading/Helpers/multiplier'),
    onChangeCancellationDuration: jest.fn(),
    onToggleCancellation: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Dropdown: jest.fn(props => (
        <div>
            {dropdown}
            <button onClick={props.onChange}>DropdownList</button>
        </div>
    )),
}));

describe('<CancelDeal />', () => {
    let default_mocked_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mocked_store = {
            ...mockStore({}),
            modules: {
                trade: {
                    cancellation_range_list: [{ text: 'mocked text', value: 'mocked value' }],
                    cancellation_duration: '10',
                    has_cancellation: true,
                    has_stop_loss: true,
                    has_take_profit: true,
                    onChangeMultiple: jest.fn(),
                },
            },
        };
    });

    const mockTakeProfit = () => {
        return (
            <TraderProviders store={default_mocked_store}>
                <CancelDeal />
            </TraderProviders>
        );
    };

    it('should not render component if cancellation_range_list is empty ', () => {
        default_mocked_store.modules.trade.cancellation_range_list = [];
        const { container } = render(mockTakeProfit());

        expect(container).toBeEmptyDOMElement();
    });
    it('should render Deal cancellation checkbox, popover and dropdown if has_cancellation, has_stop_loss and has_take_profit are equal to true', () => {
        render(mockTakeProfit());

        expect(screen.getByText(deal_cancellation)).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(screen.getByTestId(popover)).toBeInTheDocument();
        expect(screen.getByText(dropdown)).toBeInTheDocument();
    });
    it('should not render dropdown if has_cancellation is false', () => {
        default_mocked_store.modules.trade.has_cancellation = false;
        render(mockTakeProfit());

        expect(screen.getByText(deal_cancellation)).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(screen.queryByText(dropdown)).not.toBeInTheDocument();
    });
    it('should render extra popover (as a result there will be 2 popovers) with notification if should_show_cancellation_warning from ui store is true', () => {
        default_mocked_store.modules.trade.has_take_profit = false;
        default_mocked_store.ui.should_show_cancellation_warning = true;
        render(mockTakeProfit());

        expect(screen.getAllByTestId(popover)).toHaveLength(2);
    });
    it('should call onChangeCancellationDuration if user clicked on dropdown', () => {
        render(mockTakeProfit());

        userEvent.click(screen.getByText('DropdownList'));

        expect(onChangeCancellationDuration).toBeCalled();
    });
    it('should call onToggleCancellation if user clicked on checkbox', () => {
        render(mockTakeProfit());

        userEvent.click(screen.getByRole('checkbox'));

        expect(onToggleCancellation).toBeCalled();
    });
    it('after user hover on extra popover, text with checkbox should be shown and user will be able to checked; on unhover toggleCancellationWarning should be called', () => {
        default_mocked_store.modules.trade.has_take_profit = false;
        default_mocked_store.ui.should_show_cancellation_warning = true;
        const { rerender } = render(mockTakeProfit());

        expect(screen.queryByText(/Don't show this again/i)).not.toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        userEvent.hover(screen.getAllByTestId(popover)[0]);
        expect(screen.getByText(/Don't show this again/i)).toBeInTheDocument();
        expect(screen.getAllByRole('checkbox')).toHaveLength(2);

        userEvent.click(screen.getAllByRole('checkbox')[0]);
        expect(screen.getAllByRole('checkbox')[0]).toBeChecked();

        rerender(mockTakeProfit());

        userEvent.unhover(screen.getByText(/Take profit and\/or/i));
        expect(default_mocked_store.ui.toggleCancellationWarning).toBeCalled();
    });
});
