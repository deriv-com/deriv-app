import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import DealCancellation from '../deal-cancellation';

const deal_cancellation = 'Deal cancellation';
const wheel_picker = 'Wheel Picker';
const save_button = 'Save';

jest.mock('@deriv-com/quill-ui', () => ({
    ...jest.requireActual('@deriv-com/quill-ui'),
    WheelPicker: jest.fn(({ data, setSelectedValue }) => (
        <div>
            <p>{wheel_picker}</p>
            <ul>
                {data.map(({ label, value }: { label: string; value: string }) => (
                    <li key={value}>
                        <button onClick={() => setSelectedValue(value)}>{label}</button>
                    </li>
                ))}
            </ul>
        </div>
    )),
}));

describe('DealCancellation', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: {
                        ...mockStore({}),
                        cancellation_range_list: [
                            { text: '60 minutes', value: '60m' },
                            { text: '30 minutes', value: '30m' },
                            { text: '15 minutes', value: '15m' },
                        ],
                        cancellation_duration: '60m',
                    },
                },
            }))
    );

    afterEach(() => jest.clearAllMocks());

    const mockDealCancellation = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <DealCancellation closeActionSheet={jest.fn()} />
                </ModulesProvider>
            </TraderProviders>
        );

    it('should render title, Wheel Picker and Save button', () => {
        mockDealCancellation();

        expect(screen.getByText(deal_cancellation)).toBeInTheDocument();
        expect(screen.getByText(wheel_picker)).toBeInTheDocument();
        expect(screen.getByText(save_button)).toBeInTheDocument();
        expect(screen.queryByTestId('square-skeleton')).not.toBeInTheDocument();
    });

    it('should render Skeleton loader instead of Wheel Picker if cancellation_range_list is empty', () => {
        default_mock_store.modules.trade.cancellation_range_list = [];
        mockDealCancellation();

        expect(screen.getByTestId('square-skeleton')).toBeInTheDocument();
        expect(screen.queryByText(wheel_picker)).not.toBeInTheDocument();
    });

    it("should not call onChangeMultiple if user clicks on Save button, but the value hasn't changed", () => {
        mockDealCancellation();

        userEvent.click(screen.getByText(save_button));

        expect(default_mock_store.modules.trade.onChangeMultiple).not.toBeCalled();
    });

    it('should call onChangeMultiple with correct arguments if user clicks on Save button and he changed the value previously', () => {
        mockDealCancellation();

        userEvent.click(screen.getByText('30 min'));
        userEvent.click(screen.getByText(save_button));

        expect(default_mock_store.modules.trade.onChangeMultiple).toBeCalledWith({
            cancellation_duration: '30m',
            has_cancellation: false,
        });
    });

    it('should call onChangeMultiple with correct arguments even if has_stop_loss and has_take_profit were true', () => {
        default_mock_store.modules.trade.has_stop_loss = true;
        default_mock_store.modules.trade.has_take_profit = true;
        mockDealCancellation();

        const toggle_switch = screen.getAllByRole('button')[0];
        userEvent.click(toggle_switch);
        userEvent.click(screen.getByText('15 min'));
        userEvent.click(screen.getByText(save_button));

        expect(default_mock_store.modules.trade.onChangeMultiple).toBeCalledWith({
            cancellation_duration: '15m',
            has_cancellation: true,
            has_stop_loss: false,
            has_take_profit: false,
        });
    });
});
