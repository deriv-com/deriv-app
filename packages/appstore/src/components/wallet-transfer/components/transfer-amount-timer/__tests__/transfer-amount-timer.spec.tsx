import React from 'react';
import * as formik from 'formik';
import { render, screen } from '@testing-library/react';
import { useCountdown } from '@deriv/hooks';
import TransferAmountTimer from '../transfer-amount-timer';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useCountdown: jest.fn(),
    useExchangeRate: jest.fn(() => ({
        getRate: jest.fn(),
    })),
}));

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

const mockUseCountdown = useCountdown as jest.MockedFunction<typeof useCountdown>;

describe('<TransferAmountTimer />', () => {
    describe('timer visibility', () => {
        beforeEach(() => {
            mockUseCountdown.mockReturnValue({
                count: 60,
                is_running: false,
                pause: jest.fn(),
                reset: jest.fn(),
                start: jest.fn(),
                stop: jest.fn(),
            });
        });

        it('timer should not be visible if from_account and to_account have the same currency', () => {
            mockUseFormikContext.mockReturnValue({
                errors: { from_amount: undefined },
                setValues: jest.fn(),
                values: {
                    from_account: {
                        currency: 'USD',
                    },
                    to_account: {
                        currency: 'USD',
                    },
                    from_amount: 1000,
                    to_amount: 0,
                },
            });

            render(<TransferAmountTimer />);

            expect(screen.queryByTestId('dt_timer')).not.toBeInTheDocument();
        });

        it('timer should not be visible if from_account and to_account have zero input amount', () => {
            mockUseFormikContext.mockReturnValue({
                errors: { from_amount: undefined },
                setValues: jest.fn(),
                values: {
                    from_account: {
                        currency: 'USD',
                    },
                    to_account: {
                        currency: 'BTC',
                    },
                    from_amount: 0,
                    to_amount: 0,
                },
            });

            render(<TransferAmountTimer />);

            expect(screen.queryByTestId('dt_timer')).not.toBeInTheDocument();
        });

        it('timer should not be visible if there is a transfer error', () => {
            mockUseFormikContext.mockReturnValue({
                errors: { from_amount: ['TransferError'] },
                setValues: jest.fn(),
                values: {
                    from_account: {
                        currency: 'USD',
                    },
                    to_account: {
                        currency: 'BTC',
                    },
                    from_amount: 27481,
                    to_amount: 1,
                },
            });

            render(<TransferAmountTimer />);

            expect(screen.queryByTestId('dt_timer')).not.toBeInTheDocument();
        });

        it('should show timer', () => {
            mockUseFormikContext.mockReturnValue({
                errors: { from_amount: undefined },
                setValues: jest.fn(),
                values: {
                    from_account: {
                        currency: 'USD',
                    },
                    to_account: {
                        currency: 'BTC',
                    },
                    from_amount: 27481,
                    to_amount: 1,
                },
            });

            render(<TransferAmountTimer />);

            expect(screen.getByTestId('dt_timer')).toBeInTheDocument();
        });
    });

    it('starts the countdown when timer becomes visible', () => {
        const mockStart = jest.fn();
        mockUseCountdown.mockReturnValue({
            count: 10,
            is_running: false,
            pause: jest.fn(),
            reset: jest.fn(),
            start: mockStart,
            stop: jest.fn(),
        });
        mockUseFormikContext.mockReturnValue({
            errors: { from_amount: undefined },
            setValues: jest.fn(),
            values: {
                from_account: {
                    currency: 'USD',
                },
                to_account: {
                    currency: 'BTC',
                },
                from_amount: 27481,
                to_amount: 1,
            },
        });

        render(<TransferAmountTimer />);

        expect(mockStart).toHaveBeenCalledTimes(1);
    });

    it('resets the countdown after reaching zero', () => {
        const mockReset = jest.fn();
        mockUseCountdown.mockReturnValue({
            count: 0,
            is_running: false,
            pause: jest.fn(),
            reset: mockReset,
            start: jest.fn(),
            stop: jest.fn(),
        });

        render(<TransferAmountTimer />);

        expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it('displays the correct countdown time', () => {
        mockUseCountdown.mockReturnValue({
            count: 5,
            is_running: false,
            pause: jest.fn(),
            reset: jest.fn(),
            start: jest.fn(),
            stop: jest.fn(),
        });

        render(<TransferAmountTimer />);

        expect(screen.getByText('5s')).toBeInTheDocument();
    });
});
