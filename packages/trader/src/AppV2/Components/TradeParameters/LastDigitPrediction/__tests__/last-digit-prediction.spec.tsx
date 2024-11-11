import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../trader-providers';
import ModulesProvider from 'Stores/Providers/modules-providers';
import LastDigitPrediction from '../last-digit-prediction';

const title = 'Last digit prediction';

describe('LastDigitPrediction', () => {
    let default_mock_store: ReturnType<typeof mockStore>;
    const digit_stats = [120, 86, 105, 94, 85, 86, 124, 107, 90, 103];

    beforeEach(() => {
        default_mock_store = mockStore({
            modules: {
                trade: {
                    digit_stats: [],
                    last_digit: 5,
                    onChange: jest.fn(),
                },
            },
        });
    });

    const mockLastDigitPrediction = (props?: React.ComponentProps<typeof LastDigitPrediction>) => {
        return (
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <LastDigitPrediction {...props} />
                </ModulesProvider>
            </TraderProviders>
        );
    };

    it('renders 10 enabled buttons for each digit if digit_stats are available', () => {
        default_mock_store.modules.trade.digit_stats = digit_stats;
        render(mockLastDigitPrediction());

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(10);
        buttons.forEach((button: HTMLElement) => {
            expect(button).toBeEnabled();
        });
    });
    it('renders component with correct last digit value when minimized', () => {
        render(mockLastDigitPrediction({ is_minimized: true }));

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue(default_mock_store.modules.trade.last_digit.toString());
    });
    it('disables component if is_market_closed  === true', () => {
        default_mock_store.modules.trade.is_market_closed = true;
        render(mockLastDigitPrediction({ is_minimized: true }));

        expect(screen.getByRole('textbox')).toBeDisabled();
    });
    it('shows ActionSheet if user clicks on the minimized Last digit prediction param', () => {
        render(mockLastDigitPrediction({ is_minimized: true }));

        userEvent.click(screen.getByRole('textbox'));

        expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'open');
    });
    it('calls onChange function if user opens ActionSheet, selects another digit and clicks on "Save" button', () => {
        render(mockLastDigitPrediction({ is_minimized: true }));

        userEvent.click(screen.getByRole('textbox'));

        const digit_button_seven = screen.getByRole('button', { name: '7' });
        const save_button = screen.getByRole('button', { name: 'Save' });

        userEvent.click(digit_button_seven);
        userEvent.click(save_button);
        expect(default_mock_store.modules.trade.onChange).toBeCalled();
    });
});
