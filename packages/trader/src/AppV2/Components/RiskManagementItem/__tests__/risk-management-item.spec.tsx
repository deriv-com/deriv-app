import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RiskManagementItem from '../risk-management-item';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import { CONTRACT_TYPES } from '@deriv/shared';

jest.mock('@deriv/translations', () => ({
    Localize: ({ i18n_default_text }: { i18n_default_text: string }) => <span>{i18n_default_text}</span>,
    localize: (text: string) => text,
}));

jest.mock('@deriv-com/quill-ui', () => ({
    ActionSheet: {
        Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        Header: () => <div>Action Sheet Title</div>,
        Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        Footer: ({ primaryAction }: { primaryAction: { content: React.ReactNode; onAction: () => void } }) => (
            <button onClick={primaryAction.onAction}>{primaryAction.content}</button>
        ),
    },
    Text: ({ children, color }: { children: React.ReactNode; color?: string }) => (
        <span className={color}>{children}</span>
    ),
    ToggleSwitch: ({
        checked,
        onChange,
        disabled,
    }: {
        checked: boolean;
        onChange: (value: boolean) => void;
        disabled?: boolean;
    }) => <input type='checkbox' checked={checked} onChange={() => onChange(!checked)} disabled={disabled} />,
    TextField: ({
        value,
        onClick,
        onFocus,
        disabled,
    }: {
        value: string;
        onClick: () => void;
        onFocus: () => void;
        disabled: boolean;
    }) => <input type='text' value={value} onClick={onClick} onFocus={onFocus} disabled={disabled} />,
    TextFieldWithSteppers: ({
        value,
        onChange,
        status,
    }: {
        value: number;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        status?: string;
    }) => (
        <div>
            <input type='number' value={value} onChange={onChange} />
            {status === 'error' && <span>Error</span>}
        </div>
    ),
}));

jest.mock('AppV2/Hooks/useContractDetails', () => jest.fn());

jest.mock('../../RiskManagementInfoModal', () => ({
    __esModule: true,
    default: jest.fn(({ body_content, info_message }) => (
        <div>
            <span>{body_content}</span>
            <span>{info_message}</span>
        </div>
    )),
}));

describe('RiskManagementItem component', () => {
    const mockUseContractDetails = useContractDetails as jest.MockedFunction<typeof useContractDetails>;

    beforeEach(() => {
        mockUseContractDetails.mockReturnValue({
            contract_info: {
                contract_type: CONTRACT_TYPES.MULTIPLIER.UP,
                currency: 'USD',
                contract_id: 1,
                is_valid_to_cancel: 1,
                validation_params: {
                    stop_loss: { min: 1, max: 100 },
                    take_profit: { min: 1, max: 100 },
                },
            },
            contract: {
                contract_info: {
                    contract_id: 1,
                    validation_params: {
                        stop_loss: { min: 1, max: 100 },
                        take_profit: { min: 1, max: 100 },
                    },
                },
                contract_update_history: [],
                contract_update_take_profit: 100,
                contract_update_stop_loss: 10,
                validation_errors: {
                    contract_update_stop_loss: [],
                    contract_update_take_profit: [],
                },
                updateLimitOrder: jest.fn(),
                clearContractUpdateConfigValues: jest.fn(),
                onChange: jest.fn(),
                digits_info: {},
                display_status: '',
                has_contract_update_take_profit: false,
                has_contract_update_stop_loss: false,
                is_digit_contract: false,
                is_ended: false,
            },
            is_loading: false,
        });
    });

    const renderComponent = (props = {}) => {
        render(<RiskManagementItem label='Test Label' modal_body_content={<p>Modal content</p>} {...props} />);
    };

    it('renders the label', () => {
        renderComponent();
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('renders the modal content', () => {
        renderComponent();
        userEvent.click(screen.getByText('Test Label'));
        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('opens action sheet when toggle is enabled', () => {
        renderComponent({ value: 10 });
        userEvent.click(screen.getByRole('checkbox'));
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('displays correct value in text field', () => {
        renderComponent({ value: 10 });
        const textField = screen.getByRole('textbox');
        userEvent.click(textField);
        expect(textField).toHaveValue('10.00 USD');
    });

    it('handles save action correctly', () => {
        renderComponent({ value: 10 });
        userEvent.click(screen.getByRole('checkbox'));
        userEvent.click(screen.getByText('Save'));
        expect(mockUseContractDetails().contract.updateLimitOrder).toHaveBeenCalled();
    });
});
