import React from 'react';
import { configure, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CONTRACT_TYPES, mockContractInfo, getCardLabels } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import ContractUpdateForm from '../contract-update-form';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

const contract_info = mockContractInfo({
    contract_id: 1,
    contract_type: CONTRACT_TYPES.ACCUMULATOR,
    is_valid_to_cancel: 1,
    profit: 50,
});

const contract = {
    contract_update_config: { contract_update_stop_loss: '', contract_update_take_profit: '' }, //contains applied values
    contract_update_stop_loss: '', // contains entered values
    contract_update_take_profit: '', // contains entered values
    contract_update_history: [],
    contract_info,
    clearContractUpdateConfigValues: jest.fn(),
    digits_info: { 5: { digit: 1, spot: '2034,34' } },
    display_status: '',
    has_contract_update_stop_loss: false,
    has_contract_update_take_profit: false,
    updateLimitOrder: jest.fn(),
    validation_errors: { contract_update_stop_loss: [], contract_update_take_profit: [] },
    onChange: jest.fn(),
    is_digit_contract: false,
    is_ended: false,
};

const el_modal = document.createElement('div');

describe('ContractUpdateForm', () => {
    const mock_props: React.ComponentProps<typeof ContractUpdateForm> = {
        addToast: jest.fn(),
        contract,
        current_focus: null,
        getCardLabels: () => getCardLabels(),
        getContractById: jest.fn(),
        is_accumulator: true,
        onMouseLeave: jest.fn(),
        removeToast: jest.fn(),
        setCurrentFocus: jest.fn(),
        toggleDialog: jest.fn(),
        totalProfit: 2.43,
    };
    const popoverTestid = 'dt_popover_wrapper';
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });
    afterEach(() => {
        configure({ testIdAttribute: 'data-testid' });
    });
    afterAll(() => {
        document.body.removeChild(el_modal);
    });
    it(`should render unchecked Take profit input with checkbox and disabled Apply button
        for Accumulators when take profit is not selected or applied`, () => {
        render(<ContractUpdateForm {...mock_props} />);
        const take_profit_checkbox = screen.getByRole('checkbox', { name: getCardLabels().TAKE_PROFIT });
        const stop_loss_checkbox = screen.queryByRole('checkbox', { name: getCardLabels().STOP_LOSS });
        const take_profit_input = screen.getByRole('textbox');
        const decrement_button = screen.getByRole('button', { name: getCardLabels().DECREMENT_VALUE });
        const increment_button = screen.getByRole('button', { name: getCardLabels().INCREMENT_VALUE });
        const apply_button = screen.getByRole('button', { name: getCardLabels().APPLY });
        expect(take_profit_checkbox).not.toBeChecked();
        expect(take_profit_input).toHaveDisplayValue('');
        expect(decrement_button).toBeInTheDocument();
        expect(increment_button).toBeInTheDocument();
        expect(stop_loss_checkbox).not.toBeInTheDocument();
        expect(apply_button).toBeDisabled();
    });
    it(`should render checked Take profit input with checkbox and enabled Apply button
        when take profit is already applied`, () => {
        const new_props = {
            ...mock_props,
            current_focus: 'contract_update_take_profit',
            contract: {
                ...contract,
                contract_update_config: { contract_update_stop_loss: '', contract_update_take_profit: '56' },
                contract_update_take_profit: '56',
                has_contract_update_take_profit: true,
                limit_order: {
                    take_profit: {
                        order_amount: 56,
                        order_date: 1234560000,
                    },
                },
            },
        };
        render(<ContractUpdateForm {...new_props} />);
        const take_profit_checkbox = screen.getByRole('checkbox', { name: getCardLabels().TAKE_PROFIT });
        const take_profit_input = screen.getByRole('textbox');
        const apply_button = screen.getByRole('button', { name: getCardLabels().APPLY });
        expect(take_profit_checkbox).toBeChecked();
        expect(take_profit_input).toHaveDisplayValue('56');
        expect(apply_button).toBeEnabled();
    });
    it(`should render checked Take profit input with checkbox and disabled Apply button
        when take profit is selected, but not entered`, () => {
        const new_props = {
            ...mock_props,
            current_focus: 'contract_update_take_profit',
            contract: {
                ...contract,
                has_contract_update_take_profit: true,
            },
        };
        render(<ContractUpdateForm {...new_props} />);
        const take_profit_checkbox = screen.getByRole('checkbox', { name: getCardLabels().TAKE_PROFIT });
        const apply_button = screen.getByRole('button', { name: getCardLabels().APPLY });
        expect(take_profit_checkbox).toBeChecked();
        expect(apply_button).toBeDisabled();
    });
    it(`should render checked Take profit input with checkbox and enabled Apply button
        when take profit is selected, entered, and there are no validation errors`, () => {
        const new_props = {
            ...mock_props,
            current_focus: 'contract_update_take_profit',
            contract: {
                ...contract,
                contract_update_config: { contract_update_stop_loss: '', contract_update_take_profit: '5' },
                contract_update_take_profit: '56',
                has_contract_update_take_profit: true,
            },
        };
        render(<ContractUpdateForm {...new_props} />);
        const take_profit_checkbox = screen.getByRole('checkbox', { name: getCardLabels().TAKE_PROFIT });
        const take_profit_input = screen.getByRole('textbox');
        const apply_button = screen.getByRole('button', { name: getCardLabels().APPLY });
        expect(take_profit_checkbox).toBeChecked();
        expect(take_profit_input).toHaveDisplayValue('56');
        expect(apply_button).toBeEnabled();
        // when checkbox is unchecked, Apply button should remain enabled:
        userEvent.click(take_profit_checkbox);
        expect(take_profit_checkbox).not.toBeChecked();
        expect(apply_button).toBeEnabled();
        // when Apply button is clicked, toggleDialog should be called:
        userEvent.click(apply_button);
        expect(new_props.toggleDialog).toHaveBeenCalled();
    });
    it(`should render checked Take profit input with checkbox, disabled Apply button & error message
        when take profit is selected, entered, and there are validation errors`, () => {
        const new_props = {
            ...mock_props,
            current_focus: 'contract_update_take_profit',
            contract: {
                ...contract,
                contract_update_take_profit: '',
                has_contract_update_take_profit: true,
                validation_errors: {
                    contract_update_take_profit: ['Please enter a take profit amount.'],
                    contract_update_stop_loss: [],
                },
            },
        };
        render(<ContractUpdateForm {...new_props} />);
        const take_profit_checkbox = screen.getByRole('checkbox', { name: getCardLabels().TAKE_PROFIT });
        const take_profit_input = screen.getByRole('textbox');
        const apply_button = screen.getByRole('button', { name: getCardLabels().APPLY });
        configure({ testIdAttribute: 'data-tooltip' });
        const error_message = screen.getByTestId('Please enter a take profit amount.');
        expect(take_profit_checkbox).toBeChecked();
        expect(take_profit_input).toHaveDisplayValue('');
        expect(apply_button).toBeDisabled();
        expect(error_message).toBeInTheDocument();
        // when typing a value, onChange should be called:
        userEvent.type(take_profit_input, '5');
        expect(new_props.contract.onChange).toHaveBeenCalled();
    });
    it(`should render unchecked Take profit & Stop loss checkboxes with popover icons, inputs and disabled Apply button
        for Multipliers when neither take profit, nor stop loss is selected or applied in desktop`, () => {
        const new_props = {
            ...mock_props,
            contract: {
                ...contract,
                contract_info: mockContractInfo({
                    ...contract_info,
                    contract_type: CONTRACT_TYPES.MULTIPLIER.DOWN,
                }),
            },
            is_accumulator: false,
        };
        render(<ContractUpdateForm {...new_props} />);
        const stop_loss_checkbox = screen.getByRole('checkbox', { name: getCardLabels().STOP_LOSS });
        const take_profit_checkbox = screen.queryByRole('checkbox', { name: getCardLabels().TAKE_PROFIT });
        const inputs = screen.getAllByRole('textbox');
        const apply_button = screen.getByRole('button', { name: getCardLabels().APPLY });
        expect(stop_loss_checkbox).not.toBeChecked();
        expect(take_profit_checkbox).not.toBeChecked();
        expect(screen.getAllByTestId(popoverTestid)).toHaveLength(2);
        expect(inputs).toHaveLength(2);
        expect(apply_button).toBeDisabled();
    });
    it('should render correct Total profit/loss, unchecked checkboxes without inputs & popover icons on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        const newProps = {
            ...mock_props,
            contract: {
                ...contract,
                contract_info: mockContractInfo({
                    ...contract_info,
                    contract_type: CONTRACT_TYPES.MULTIPLIER.DOWN,
                }),
            },
            is_accumulator: false,
        };
        render(<ContractUpdateForm {...newProps} isMobile />);
        expect(screen.getByText(getCardLabels().TOTAL_PROFIT_LOSS)).toBeInTheDocument();
        expect(screen.getByText('2.43 USD')).toBeInTheDocument();
        expect(screen.getAllByTestId(popoverTestid)).toHaveLength(2);
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
});
