import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClosingAccountReasonForm from '../closing-account-reason-form';

describe('<ClosingAccountReasonForm />', () => {
    const mock_props: React.ComponentProps<typeof ClosingAccountReasonForm> = {
        validateFields: jest.fn(),
        onSubmit: jest.fn(),
        is_checkbox_disabled: false,
        onChangeCheckbox: jest.fn(),
        character_limit_no: 20,
        onInputChange: jest.fn(),
        onInputPaste: jest.fn(),
        remaining_characters: 5,
        onBackClick: jest.fn(),
    };
    it('Should render ClosingAccountReasonForm component', () => {
        render(<ClosingAccountReasonForm {...mock_props} />);
        expect(screen.getByLabelText(/I want to stop myself from trading./i)).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/If you don’t mind sharing, which other trading platforms do you use?/i)
        ).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Continue/i })).toBeDisabled();
    });

    it('should call the onBackClick function when cancel button is clicked', () => {
        render(<ClosingAccountReasonForm {...mock_props} />);

        userEvent.click(screen.getByRole('button', { name: /Back/i }));

        expect(mock_props.onBackClick).toHaveBeenCalledTimes(1);
    });

    it('should call onChangeCheckbox when checkbox is clicked', () => {
        render(<ClosingAccountReasonForm {...mock_props} />);

        const el_checkbox = screen.getByRole('checkbox', {
            name: /i’m closing my account for other reasons\./i,
        });
        userEvent.click(el_checkbox);
        expect(mock_props.onChangeCheckbox).toHaveBeenCalled();
    });

    it('should call the onInputChange and onInputPaste functions for textarea inputs', () => {
        render(<ClosingAccountReasonForm {...mock_props} />);

        const otherPlatformsInput = screen.getByPlaceholderText(
            /If you don’t mind sharing, which other trading platforms do you use?/i
        );
        const improveInput = screen.getByPlaceholderText(/What could we do to improve?/i);

        fireEvent.change(otherPlatformsInput, { target: { value: 'Other Platforms Input' } });
        fireEvent.paste(improveInput, { clipboardData: { getData: () => 'Pasted Text' } });

        expect(mock_props.onInputChange).toHaveBeenCalledTimes(1);
        expect(mock_props.onInputPaste).toHaveBeenCalledTimes(1);
    });
});
