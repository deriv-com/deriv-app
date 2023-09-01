import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClosingAccountReasonForm from '../closing-account-reason-form';

describe('<ClosingAccountReasonForm />', () => {
    const mock_props: React.ComponentProps<typeof ClosingAccountReasonForm> = {
        onConfirmClick: jest.fn(),
        onBackClick: jest.fn(),
    };

    const other_financial_priorities_text = /i have other financial priorities/i;

    it('Should render ClosingAccountReasonForm component', () => {
        render(<ClosingAccountReasonForm {...mock_props} />);
        expect(screen.getByLabelText(/i want to stop myself from trading./i)).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/if you don’t mind sharing, which other trading platforms do you use?/i)
        ).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Continue/i })).toBeDisabled();
    });

    it('should call the onBackClick function when cancel button is clicked', () => {
        render(<ClosingAccountReasonForm {...mock_props} />);

        userEvent.click(screen.getByRole('button', { name: /Back/i }));

        expect(mock_props.onBackClick).toHaveBeenCalledTimes(1);
    });

    it('Should be disabled when no reason has been selected', async () => {
        render(<ClosingAccountReasonForm {...mock_props} />);

        userEvent.click(screen.getByRole('checkbox', { name: other_financial_priorities_text }));
        userEvent.click(screen.getByRole('checkbox', { name: other_financial_priorities_text }));

        await waitFor(() => {
            expect(screen.getByText(/please select at least one reason/i)).toBeInTheDocument();
            const continueButton = screen.getByRole('button', { name: /continue/i });
            expect(continueButton).toBeDisabled();
        });
    });

    it('should reduce remaining chars from maximum characters count when input is typed', async () => {
        render(<ClosingAccountReasonForm {...mock_props} />);

        expect(screen.getByText(/remaining characters: 110/i)).toBeInTheDocument();

        userEvent.click(screen.getByLabelText(/i want to stop myself from trading/i));

        await waitFor(() => {
            expect(screen.getByText(/remaining characters: 110/i)).toBeInTheDocument();
        });

        userEvent.type(screen.getByPlaceholderText(/what could we do to improve/i), 'test suggestion');
        await waitFor(() => {
            expect(screen.getByText(/remaining characters: 95/i)).toBeInTheDocument();
        });
    });

    it('should show validation error on invalid characters in input box', async () => {
        render(<ClosingAccountReasonForm {...mock_props} />);

        userEvent.click(screen.getByRole('checkbox', { name: other_financial_priorities_text }));
        userEvent.type(screen.getByPlaceholderText(/what could we do to improve/i), 'test_suggestion');

        userEvent.click(screen.getByRole('button', { name: /continue/i }));

        await waitFor(() => {
            expect(screen.getByText(/must be numbers, letters, and special characters/i)).toBeInTheDocument();
        });
    });

    it('should call the onConfirmClick function when continue button is clicked', async () => {
        render(<ClosingAccountReasonForm {...mock_props} />);

        userEvent.click(screen.getByRole('checkbox', { name: other_financial_priorities_text }));
        userEvent.type(
            screen.getByPlaceholderText(/if you don’t mind sharing, which other trading platforms do you use?/i),
            'other reasons'
        );

        userEvent.click(screen.getByRole('button', { name: /continue/i }));

        await waitFor(() => {
            expect(mock_props.onConfirmClick).toHaveBeenCalled();
        });
    });
});
