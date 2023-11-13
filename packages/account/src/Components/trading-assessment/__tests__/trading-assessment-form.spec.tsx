import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TradingAssessmentForm from '../trading-assessment-form';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('TradingAssessmentForm', () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();
    const mockSetSubSectionIndex = jest.fn();

    const baseProps = {
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

    it('should display the provided question', () => {
        const mock_store = mockStore({
            ui: {
                is_mobile: false,
            },
        });
        render(
            <StoreProvider store={mock_store}>
                <TradingAssessmentForm {...baseProps} />
            </StoreProvider>
        );
        expect(
            screen.getByText('Do you understand that you could potentially lose 100% of the money you use to trade?')
        ).toBeInTheDocument();
    });

    it('should render the next page if value of risk tolerance is "yes"', async () => {
        const mock_store = mockStore({
            ui: {
                is_mobile: true,
            },
        });
        const updatedProps = {
            ...baseProps,
            form_value: {
                ...baseProps.form_value,
                risk_tolerance: 'Yes',
            },
        };
        render(
            <StoreProvider store={mock_store}>
                <TradingAssessmentForm {...updatedProps} />
            </StoreProvider>
        );
        const nextButton = screen.getByRole('button', { name: /Next/i });
        await waitFor(() => userEvent.click(nextButton));
        expect(mockOnSubmit).toHaveBeenCalled();
    });
    it('should call onCancel when displaying the first question and "Previous" is clicked', () => {
        const mock_store = mockStore({
            ui: {
                is_mobile: false,
            },
        });
        render(
            <StoreProvider store={mock_store}>
                <TradingAssessmentForm {...baseProps} />
            </StoreProvider>
        );
        const prevButton = screen.getByRole('button', { name: /Previous/i });
        userEvent.click(prevButton);

        expect(mockOnCancel).toHaveBeenCalled();
    });
});
