import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../../trader-providers';
import CancelDeal from '../cancel-deal-mobile';
import * as multiplier_functions from 'Stores/Modules/Trading/Helpers/multiplier';

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
            cancellation_range_list: [],
        },
    },
};

const mockOnToggleCancellation = jest.spyOn(multiplier_functions, 'onToggleCancellation');

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Dialog: ({ children, ...props }) => (
        <div style={{ display: props.is_visible ? 'block' : 'none' }}>
            {children}
            <button onClick={props.onCancel}>Cancell button</button>
            <button onClick={props.onConfirm}>Confirm button</button>
        </div>
    ),
}));

describe('<CancelDeal />', () => {
    const mockCancelDeal = (mocked_store, mocked_props) => {
        return (
            <TraderProviders store={mocked_store}>
                <CancelDeal {...mocked_props} />
            </TraderProviders>
        );
    };

    it('should render the component with checkbox and popover', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockCancelDeal(mock_root_store, default_mocked_props));

        const info_icon = screen.getByTestId(/dt_popover_wrapper/i);
        userEvent.hover(info_icon);

        expect(screen.getByText('Deal cancellation')).toBeInTheDocument();
        expect(screen.queryByText(/Cancel your trade/i)).toBeInTheDocument();
    });
    it('should render <RadioGroup /> if has_cancellation === true and cancellation_range_list contains proper info', () => {
        const new_mocked_props = { ...default_mocked_props, has_cancellation: true };
        const new_mock_store = { ...default_mock_store };
        new_mock_store.modules = {
            trade: {
                cancellation_range_list: [{ value: '60m', text: 'test text' }],
            },
        };
        const mock_root_store = mockStore(new_mock_store);
        render(mockCancelDeal(mock_root_store, new_mocked_props));

        expect(screen.getByText('test text')).toBeInTheDocument();
    });
    it('should call onToggleCancellation if user clicked on Deal cancellation checkbox and anToggleDealCancel returned true', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockCancelDeal(mock_root_store, default_mocked_props));

        const checkbox_with_cancellation = screen.getByText('Deal cancellation');
        userEvent.click(checkbox_with_cancellation);

        expect(mockOnToggleCancellation).toBeCalled();
    });
    it('should show <DealCancellationWarningDialog /> if (has_take_profit || has_stop_loss) && should_show_cancellation_warning is equal to true and user clicked on Deal cancellation checkbox', () => {
        const new_mocked_props = { ...default_mocked_props, has_take_profit: true };
        const new_mock_store = { ...default_mock_store, ui: { should_show_cancellation_warning: true } };
        const mock_root_store = mockStore(new_mock_store);
        render(mockCancelDeal(mock_root_store, new_mocked_props));

        expect(screen.getByText(/Take profit and\/or stop loss are not available/i)).not.toBeVisible();
        expect(screen.getByText(/Don't show this again/i)).not.toBeVisible();

        const checkbox_with_cancellation = screen.getByText('Deal cancellation');
        userEvent.click(checkbox_with_cancellation);

        expect(screen.getByText(/Take profit and\/or stop loss are not available/i)).toBeVisible();
        expect(screen.getByText(/Don't show this again/i)).toBeVisible();
    });
    it('should call toggleCancellationWarning function if cansellation warning checkbox inside of <DealCancellationWarningDialog /> was clicked', () => {
        const new_mocked_props = { ...default_mocked_props, has_take_profit: true };
        const new_mock_store = {
            ...default_mock_store,
            ui: { should_show_cancellation_warning: true, toggleCancellationWarning: jest.fn() },
        };
        const mock_root_store = mockStore(new_mock_store);
        render(mockCancelDeal(mock_root_store, new_mocked_props));

        const checkbox_with_cancellation = screen.getByText('Deal cancellation');
        userEvent.click(checkbox_with_cancellation);
        const checkbox_with_show = screen.getByText(/Don't show this again/i);
        userEvent.click(checkbox_with_show);

        expect(new_mock_store.ui.toggleCancellationWarning).toBeCalled();
    });
    it('<DealCancellationWarningDialog /> should not be visible if Cansell button was clicked', () => {
        const new_mocked_props = { ...default_mocked_props, has_stop_loss: true };
        const new_mock_store = { ...default_mock_store, ui: { should_show_cancellation_warning: true } };
        const mock_root_store = mockStore(new_mock_store);
        render(mockCancelDeal(mock_root_store, new_mocked_props));

        const checkbox_with_cancellation = screen.getByText('Deal cancellation');
        userEvent.click(checkbox_with_cancellation);
        const cansell_button = screen.getByText('Cancell button');
        userEvent.click(cansell_button);

        expect(screen.getByText(/Take profit and\/or stop loss are not available/i)).not.toBeVisible();
        expect(screen.getByText(/Don't show this again/i)).not.toBeVisible();
    });
    it('<DealCancellationWarningDialog /> should not be visible if Confirm button was clicked', () => {
        const new_mocked_props = { ...default_mocked_props, has_stop_loss: true };
        const new_mock_store = { ...default_mock_store, ui: { should_show_cancellation_warning: true } };
        const mock_root_store = mockStore(new_mock_store);
        render(mockCancelDeal(mock_root_store, new_mocked_props));

        const checkbox_with_cancellation = screen.getByText('Deal cancellation');
        userEvent.click(checkbox_with_cancellation);
        const cansell_button = screen.getByText('Confirm button');
        userEvent.click(cansell_button);

        expect(screen.getByText(/Take profit and\/or stop loss are not available/i)).not.toBeVisible();
        expect(screen.getByText(/Don't show this again/i)).not.toBeVisible();
    });
});
