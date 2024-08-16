import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import * as utils from 'AppV2/Utils/trade-params-utils';
import TraderProviders from '../../../../../trader-providers';
import TakeProfitInput from '../take-profit-input';

const take_profit_trade_param = 'Take profit';
const data_testid = 'dt_input_with_steppers';

describe('TakeProfitInput', () => {
    let default_mock_store: ReturnType<typeof mockStore>, default_props: React.ComponentProps<typeof TakeProfitInput>;

    beforeEach(() => {
        default_mock_store = mockStore({
            modules: {
                trade: { ...mockStore({}).modules.trade, currency: 'USD', validation_errors: { take_profit: [] } },
            },
        });
        default_props = { classname: '', onActionSheetClose: jest.fn() };
    });

    afterEach(() => jest.clearAllMocks());

    const mockTakeProfitInput = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <TakeProfitInput {...default_props} />
                </ModulesProvider>
            </TraderProviders>
        );

    it('should render component', () => {
        mockTakeProfitInput();

        // const input = screen.getByRole('textbox');
        // expect(input).toBeInTheDocument();
        // expect(input).toHaveValue('-');
        expect(screen.getByText(take_profit_trade_param)).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should render alternative text content with definition for Accumulators', () => {
        default_mock_store.modules.trade.is_accumulator = true;
        mockTakeProfitInput();

        userEvent.click(screen.getByText(take_profit_trade_param));

        expect(screen.getByText('Note: Cannot be adjusted for ongoing accumulator contracts.')).toBeInTheDocument();
    });

    it('should call focusAndOpenKeyboard, when ToggleSwitch is switched to true.', async () => {
        const mockFocusAndOpenKeyboard = jest.spyOn(utils, 'focusAndOpenKeyboard');
        mockTakeProfitInput();

        const toggle_switcher = screen.getAllByRole('button')[0];
        userEvent.click(toggle_switcher);
        expect(mockFocusAndOpenKeyboard).toBeCalledTimes(1);
    });

    it('should call focusAndOpenKeyboard, when user clicks on Take Profit overlay.', () => {
        const mockFocusAndOpenKeyboard = jest.spyOn(utils, 'focusAndOpenKeyboard');
        mockTakeProfitInput();

        const take_profit_overlay = screen.getByTestId('dt_take_profit_overlay');
        userEvent.click(take_profit_overlay);

        expect(mockFocusAndOpenKeyboard).toBeCalledTimes(1);
    });

    it('should call onChange and onChangeMultiple if user click on Save button and there is no error', () => {
        mockTakeProfitInput();

        const toggle_switcher = screen.getAllByRole('button')[0];
        userEvent.click(toggle_switcher);

        const save_button = screen.getByText('Save');
        userEvent.click(save_button);

        expect(default_mock_store.modules.trade.onChange).toBeCalled();
        expect(default_mock_store.modules.trade.onChangeMultiple).toBeCalled();
    });

    it('should show validation error if user click on Save button and there is an error', () => {
        default_mock_store.modules.trade.validation_errors = { take_profit: ['validation error'] };
        mockTakeProfitInput();

        const toggle_switcher = screen.getAllByRole('button')[0];
        userEvent.click(toggle_switcher);

        const save_button = screen.getByText('Save');
        userEvent.click(save_button);

        expect(screen.getByText('validation error')).toBeInTheDocument();
    });

    it('should onChange function when user type new value', () => {
        default_mock_store.modules.trade.take_profit = '5';
        default_mock_store.modules.trade.has_take_profit = true;
        mockTakeProfitInput();

        userEvent.clear(screen.getByTestId(data_testid));
        expect(default_mock_store.modules.trade.onChange).toBeCalledWith({
            target: { name: 'take_profit', value: '' },
        });

        userEvent.type(screen.getByTestId(data_testid), '2');
        expect(default_mock_store.modules.trade.onChange).toBeCalledWith({
            target: { name: 'take_profit', value: '2' },
        });
    });
});
