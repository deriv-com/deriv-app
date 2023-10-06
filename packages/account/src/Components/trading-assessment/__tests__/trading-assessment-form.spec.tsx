import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import TradingAssessmentForm from '../trading-assessment-form';
import { debug } from 'console';

describe('TradingAssessmentForm', () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();
    const mockSetSubSectionIndex = jest.fn();

    const baseProps = {
        class_name: '',
        disabled_items: [],
        form_value: {
            cfd_experience: '',
            cfd_frequency: '',
            cfd_trading_definition: '',
            leverage_impact_trading: '',
            leverage_trading_high_risk_stop_loss: '',
            required_initial_margin: '',
            risk_tolerance: '',
            source_of_experience: '',
            trading_experience_financial_instruments: '',
            trading_frequency_financial_instruments: '',
        },
        onSubmit: mockOnSubmit,
        onCancel: mockOnCancel,
        should_move_to_next: false,
        setSubSectionIndex: mockSetSubSectionIndex,
        is_independent_section: false,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without crashing', () => {
        render(<TradingAssessmentForm {...baseProps} />);
    });

    it('should display the provided question', () => {
        render(<TradingAssessmentForm {...baseProps} />);
        expect(
            screen.getByText(' Do you understand that you could potentially lose 100% of the money you use to trade?')
        ).toBeInTheDocument();
    });

    it('should move to the next question when "Next" is clicked', () => {
        render(<TradingAssessmentForm {...baseProps} />);
        const nextButton = screen.getByRole('button', { name: /Next/i });
        userEvent.click(nextButton);
        expect(
            screen.getByText(' How much knowledge and experience do you have in relation to online trading?')
        ).toBeInTheDocument();
    });

    it('should render risk tolerance modal if value of risk tolerance is "no"', async () => {
        const updatedProps = {
            ...baseProps,
            form_value: {
                ...baseProps.form_value,
                risk_tolerance: 'No',
            },
        };
        render(<TradingAssessmentForm {...updatedProps} />);
        const nextButton = screen.getByRole('button', { name: /Next/i });
        userEvent.click(nextButton);
        expect(mockOnSubmit).toHaveBeenCalled();
    });
    it('should call onCancel when displaying the first question and "Previous" is clicked', () => {
        render(<TradingAssessmentForm {...baseProps} />);
        const prevButton = screen.getByRole('button', { name: /Previous/i });
        userEvent.click(prevButton);

        expect(mockOnCancel).toHaveBeenCalled();
    });
});
