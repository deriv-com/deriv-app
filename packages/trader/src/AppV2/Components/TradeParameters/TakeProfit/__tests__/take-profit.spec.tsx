import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import TakeProfit from '../take-profit';

const take_profit_trade_param = 'Take profit';

const mediaQueryList = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);

describe('TakeProfit', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => (default_mock_store = mockStore({})));

    afterEach(() => jest.clearAllMocks());

    const mockTakeProfit = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <TakeProfit is_minimized />
                </ModulesProvider>
            </TraderProviders>
        );

    it('should render trade param with "Take profit" label', () => {
        mockTakeProfit();

        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByText(take_profit_trade_param)).toBeInTheDocument();
    });

    it('should open ActionSheet with input, "Save" button and text content with definition if user clicks on trade param', () => {
        mockTakeProfit();

        expect(screen.queryByTestId('dt-actionsheet-overlay')).not.toBeInTheDocument();

        userEvent.click(screen.getByText(take_profit_trade_param));

        expect(screen.getByTestId('dt-actionsheet-overlay')).toBeInTheDocument();
        const input = screen.getByRole('spinbutton');
        expect(input).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(
            screen.getByText(
                'When your profit reaches or exceeds the set amount, your trade will be closed automatically.'
            )
        ).toBeInTheDocument();
    });

    it('should render alternative text content with definition for Accumulators', () => {
        default_mock_store.modules.trade.is_accumulator = true;
        mockTakeProfit();

        userEvent.click(screen.getByText(take_profit_trade_param));

        expect(screen.getByText('Note: Cannot be adjusted for ongoing accumulator contracts.')).toBeInTheDocument();
    });

    it('should enable input, when user clicks on ToggleSwitch', () => {
        mockTakeProfit();

        userEvent.click(screen.getByText(take_profit_trade_param));

        const toggle_switcher = screen.getAllByRole('button')[0];
        const input = screen.getByRole('spinbutton');

        expect(input).toBeDisabled();
        userEvent.click(toggle_switcher);
        expect(input).toBeEnabled();
    });

    it('should enable input, when user clicks on Take Profit overlay', () => {
        mockTakeProfit();

        userEvent.click(screen.getByText(take_profit_trade_param));

        const take_profit_overlay = screen.getByTestId('dt_take_profit_overlay');
        const input = screen.getByRole('spinbutton');

        expect(input).toBeDisabled();
        userEvent.click(take_profit_overlay);
        expect(input).toBeEnabled();
    });

    it('should validate values, that user typed, and show error text if they are out of acceptable range. If values are wrong, when user clicks on "Save" button onChangeMultiple and onChange will not be called', () => {
        default_mock_store.modules.trade.validation_params = {
            take_profit: {
                min: '0.01',
                max: '100',
            },
        };
        mockTakeProfit();

        userEvent.click(screen.getByText(take_profit_trade_param));

        const toggle_switcher = screen.getAllByRole('button')[0];
        userEvent.click(toggle_switcher);

        const input = screen.getByRole('spinbutton');
        userEvent.type(input, ' ');
        expect(screen.getByText('Please enter a take profit amount.'));

        const save_button = screen.getByText('Save');
        userEvent.click(save_button);
        expect(default_mock_store.modules.trade.onChangeMultiple).not.toBeCalled();
        expect(default_mock_store.modules.trade.onChange).not.toBeCalled();

        userEvent.type(input, '0.0002');
        expect(screen.getByText('Acceptable range: 0.01 to 100'));

        userEvent.click(save_button);
        expect(default_mock_store.modules.trade.onChangeMultiple).not.toBeCalled();
        expect(default_mock_store.modules.trade.onChange).not.toBeCalled();
    });

    it('should validate values, that user typed. In case if values are correct, when user clicks on "Save" button onChangeMultiple and onChange will be called', () => {
        default_mock_store.modules.trade.validation_params = {
            take_profit: {
                min: '0.01',
                max: '100',
            },
        };
        mockTakeProfit();

        userEvent.click(screen.getByText(take_profit_trade_param));

        const toggle_switcher = screen.getAllByRole('button')[0];
        userEvent.click(toggle_switcher);

        const input = screen.getByRole('spinbutton');
        userEvent.type(input, '2');
        expect(screen.getByText('Acceptable range: 0.01 to 100'));

        userEvent.click(screen.getByText('Save'));
        expect(default_mock_store.modules.trade.onChangeMultiple).toBeCalled();
        expect(default_mock_store.modules.trade.onChange).toBeCalled();
    });
});
