import React from 'react';

import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TradingAssessmentForm from '../trading-assessment-form';

describe('TradingAssessmentForm', () => {
    const mockOnSave = jest.fn();
    const mockOnSubmit = jest.fn();
    const displayPreviousPage = jest.fn();
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
        onSave: mockOnSave,
        onSubmit: mockOnSubmit,
        onCancel: displayPreviousPage,
        should_move_to_next: false,
        setSubSectionIndex: mockSetSubSectionIndex,
        is_independent_section: false,
        is_responsive: false,
    };

    const mock_store = mockStore({});

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () => {
        render(
            <StoreProvider store={mock_store}>
                <TradingAssessmentForm {...baseProps} />
            </StoreProvider>
        );
    };

    it('should display the provided question', () => {
        renderComponent();
        expect(
            screen.getByText('Do you understand that you can lose all the money you use for trading?')
        ).toBeInTheDocument();
    });

    it('should display the provided options in the form', () => {
        renderComponent();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should go to the next question on when the checkbox is "yes" and next button is selected', async () => {
        renderComponent();
        await userEvent.click(screen.getByText('Yes'));
        await userEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            const text = screen.getByText('What expertise and experience do you have in online trading?');
            expect(text).toBeInTheDocument();
        });
    });

    it('should call onCancel when displaying the first question and "Previous" is clicked', async () => {
        renderComponent();
        const prevButton = screen.getByRole('button', { name: /Previous/i });
        await userEvent.click(prevButton);
        const text = screen.getByText('Do you understand that you can lose all the money you use for trading?');

        await waitFor(() => expect(text).toBeInTheDocument());
    });
});
