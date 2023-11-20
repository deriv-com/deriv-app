import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Dialog } from '@deriv/components';
import * as multiplier_functions from 'Stores/Modules/Trading/Helpers/multiplier';
import CancelDeal from '../cancel-deal-mobile';
import TraderProviders from '../../../../../../trader-providers';

const default_mocked_props = {
    has_cancellation: false,
    has_take_profit: false,
    has_stop_loss: false,
    onChangeMultiple: jest.fn(),
    cancellation_duration: '60m',
};
const default_mock_store = {
    modules: {
        trade: {
            cancellation_range_list: [] as ReturnType<typeof useTraderStore>['cancellation_range_list'],
        },
    },
};

const mockOnToggleCancellation = jest.spyOn(multiplier_functions, 'onToggleCancellation');
const deal_cancellation = 'Deal cancellation';
const check_box_text = "Don't show this again";
const dialog_text = /Take profit and\/or stop loss are not available/i;

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Dialog: ({ children, ...props }: React.PropsWithChildren<Partial<React.ComponentProps<typeof Dialog>>>) =>
        props.is_visible ? (
            <div>
                {children}
                <button onClick={props.onCancel}>Cancel button</button>
                <button onClick={props.onConfirm}>Confirm button</button>
            </div>
        ) : null,
}));

describe('<CancelDeal />', () => {
    const mockCancelDeal = (mocked_store = mockStore(default_mock_store), mocked_props = default_mocked_props) => {
        return (
            <TraderProviders store={mocked_store}>
                <CancelDeal {...mocked_props} />
            </TraderProviders>
        );
    };

    it('should render the component with checkbox and popover', () => {
        render(mockCancelDeal());

        const info_icon = screen.getByTestId(/dt_popover_wrapper/i);
        userEvent.hover(info_icon);

        expect(screen.getByText(deal_cancellation)).toBeInTheDocument();
        expect(screen.getByText(/Cancel your trade/i)).toBeInTheDocument();
    });
    it('should render <RadioGroup /> if has_cancellation === true and cancellation_range_list contains proper info', () => {
        const new_mocked_props = { ...default_mocked_props, has_cancellation: true };
        default_mock_store.modules = {
            trade: {
                cancellation_range_list: [{ value: '60m', text: 'mocked text' }],
            },
        };
        const mock_root_store = mockStore(default_mock_store);
        render(mockCancelDeal(mock_root_store, new_mocked_props));

        expect(screen.getByText('mocked text')).toBeInTheDocument();
    });
    it('should call onToggleCancellation if user clicked on Deal cancellation checkbox and onToggleDealCancel returned true', () => {
        render(mockCancelDeal());

        const checkbox_with_cancellation = screen.getByText(deal_cancellation);
        userEvent.click(checkbox_with_cancellation);

        expect(mockOnToggleCancellation).toBeCalled();
    });
    it('should show <DealCancellationWarningDialog /> if (has_take_profit || has_stop_loss) && should_show_cancellation_warning is equal to true and user clicked on Deal cancellation checkbox', () => {
        const new_mocked_props = { ...default_mocked_props, has_take_profit: true };
        const new_mock_store = { ...default_mock_store, ui: { should_show_cancellation_warning: true } };
        const mock_root_store = mockStore(new_mock_store);
        render(mockCancelDeal(mock_root_store, new_mocked_props));

        expect(screen.queryByText(dialog_text)).not.toBeInTheDocument();
        expect(screen.queryByText(check_box_text)).not.toBeInTheDocument();

        const checkbox_with_cancellation = screen.getByText(deal_cancellation);
        userEvent.click(checkbox_with_cancellation);

        expect(screen.getByText(dialog_text)).toBeInTheDocument();
        expect(screen.getByText(check_box_text)).toBeInTheDocument();
    });
    it('should call toggleCancellationWarning function if cancellation warning checkbox inside of <DealCancellationWarningDialog /> was clicked', () => {
        const new_mocked_props = { ...default_mocked_props, has_take_profit: true };
        const new_mock_store = {
            ...default_mock_store,
            ui: { should_show_cancellation_warning: true, toggleCancellationWarning: jest.fn() },
        };
        const mock_root_store = mockStore(new_mock_store);
        render(mockCancelDeal(mock_root_store, new_mocked_props));

        const checkbox_with_cancellation = screen.getByText(deal_cancellation);
        userEvent.click(checkbox_with_cancellation);
        const checkbox_with_show = screen.getByText(check_box_text);
        userEvent.click(checkbox_with_show);

        expect(new_mock_store.ui.toggleCancellationWarning).toBeCalled();
    });
    it('<DealCancellationWarningDialog /> should not be visible if Cancel button was clicked', () => {
        const new_mocked_props = { ...default_mocked_props, has_stop_loss: true };
        const new_mock_store = { ...default_mock_store, ui: { should_show_cancellation_warning: true } };
        const mock_root_store = mockStore(new_mock_store);
        render(mockCancelDeal(mock_root_store, new_mocked_props));

        const checkbox_with_cancellation = screen.getByText(deal_cancellation);
        userEvent.click(checkbox_with_cancellation);
        const cancel_button = screen.getByText('Cancel button');
        userEvent.click(cancel_button);

        expect(screen.queryByText(dialog_text)).not.toBeInTheDocument();
        expect(screen.queryByText(check_box_text)).not.toBeInTheDocument();
    });
    it('<DealCancellationWarningDialog /> should not be visible if Confirm button was clicked', () => {
        const new_mocked_props = { ...default_mocked_props, has_stop_loss: true };
        const new_mock_store = { ...default_mock_store, ui: { should_show_cancellation_warning: true } };
        const mock_root_store = mockStore(new_mock_store);
        render(mockCancelDeal(mock_root_store, new_mocked_props));

        const checkbox_with_cancellation = screen.getByText(deal_cancellation);
        userEvent.click(checkbox_with_cancellation);
        const cancel_button = screen.getByText('Confirm button');
        userEvent.click(cancel_button);

        expect(screen.queryByText(dialog_text)).not.toBeInTheDocument();
        expect(screen.queryByText(check_box_text)).not.toBeInTheDocument();
    });
});
