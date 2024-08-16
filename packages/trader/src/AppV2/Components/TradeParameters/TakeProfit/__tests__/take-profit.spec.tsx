import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import TakeProfit from '../take-profit';

const take_profit_trade_param = 'Take profit';
const data_testid = 'dt_input_with_steppers';

describe('TakeProfit', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: { ...mockStore({}).modules.trade, currency: 'USD', validation_errors: { take_profit: [] } },
                },
            }))
    );

    afterEach(() => jest.clearAllMocks());

    const mockTakeProfit = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <TakeProfit is_minimized />
                </ModulesProvider>
            </TraderProviders>
        );

    it('should render trade param with "Take profit" label and input with  value equal "-" if has_take_profit && take_profit === false', () => {
        mockTakeProfit();

        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('-');
        expect(screen.getByText(take_profit_trade_param)).toBeInTheDocument();
    });

    it('should render trade param with "Take profit" label and input with value equal to take_profit if has_take_profit && take_profit', () => {
        default_mock_store.modules.trade.take_profit = '5';
        default_mock_store.modules.trade.has_take_profit = true;
        mockTakeProfit();

        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('5 USD');
        expect(screen.getByText(take_profit_trade_param)).toBeInTheDocument();
    });

    it('should open ActionSheet with input, "Save" button and text content with definition if user clicks on trade param', () => {
        mockTakeProfit();

        expect(screen.queryByTestId('dt-actionsheet-overlay')).not.toBeInTheDocument();

        userEvent.click(screen.getByText(take_profit_trade_param));

        expect(screen.getByTestId('dt-actionsheet-overlay')).toBeInTheDocument();
        const input = screen.getByTestId(data_testid);
        expect(input).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(
            screen.getByText(
                'When your profit reaches or exceeds the set amount, your trade will be closed automatically.'
            )
        ).toBeInTheDocument();
    });

    it('should call onChange and onChangeMultiple on component mount if take_profit and has_take_profit values from trade-store are different from wheel_picker_initial_values', () => {
        default_mock_store.modules.trade.take_profit = '10';
        default_mock_store.modules.trade.has_take_profit = false;
        default_mock_store.modules.trade.wheel_picker_initial_values = { take_profit: '5', has_take_profit: true };
        mockTakeProfit();

        expect(default_mock_store.modules.trade.onChange).toBeCalledWith({
            target: { name: 'take_profit', value: '5' },
        });
        expect(default_mock_store.modules.trade.onChangeMultiple).toBeCalledWith({
            has_take_profit: true,
            has_cancellation: false,
        });
    });
});
