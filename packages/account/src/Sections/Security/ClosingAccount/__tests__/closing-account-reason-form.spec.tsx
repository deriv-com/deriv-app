import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

        fireEvent.click(screen.getByRole('checkbox', { name: other_financial_priorities_text }));
        fireEvent.click(screen.getByRole('checkbox', { name: other_financial_priorities_text }));

        await waitFor(() => {
            expect(screen.getByText(/please select at least one reason/i)).toBeInTheDocument();
            const continueButton = screen.getByRole('button', { name: /continue/i });
            expect(continueButton).toBeDisabled();
        });
    });

    it('should reduce remaining chars', async () => {
        render(<ClosingAccountReasonForm {...mock_props} />);

        expect(screen.getByText(/remaining characters: 110/i)).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText(/i want to stop myself from trading/i), {
            target: { value: 'true' },
        });

        await waitFor(() => {
            expect(screen.getByText(/remaining characters: 110/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/what could we do to improve/i), {
            target: { value: 'do_to_improve' },
        });
        await waitFor(() => {
            expect(screen.getByText(/remaining characters: 97/i)).toBeInTheDocument();
        });
    });

    it('should show validation error on invalid characters in input box', async () => {
        render(<ClosingAccountReasonForm {...mock_props} />);

        fireEvent.click(screen.getByRole('checkbox', { name: other_financial_priorities_text }));
        fireEvent.change(screen.getByPlaceholderText(/what could we do to improve/i), {
            target: { value: 'test_suggestion' },
        });

        fireEvent.click(screen.getByRole('button', { name: /continue/i }));

        await waitFor(() => {
            expect(screen.getByText(/must be numbers, letters, and special characters/i)).toBeInTheDocument();
        });
    });

    it('should call the onConfirmClick function when continue button is clicked', async () => {
        render(<ClosingAccountReasonForm {...mock_props} />);

        fireEvent.click(screen.getByRole('checkbox', { name: other_financial_priorities_text }));
        fireEvent.change(
            screen.getByPlaceholderText(/if you don’t mind sharing, which other trading platforms do you use?/i),
            {
                target: { value: 'other reasons' },
            }
        );

        fireEvent.click(screen.getByRole('button', { name: /continue/i }));

        await waitFor(() => {
            expect(mock_props.onConfirmClick).toHaveBeenCalled();
        });
    });
});
