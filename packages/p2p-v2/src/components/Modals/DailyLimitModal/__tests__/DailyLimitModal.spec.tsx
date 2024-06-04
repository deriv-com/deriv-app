import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DailyLimitModal from '../DailyLimitModal';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>
            <div id='v2_modal_root' />
            {children}
        </AuthProvider>
    </APIProvider>
);

const mockUseAdvertiserUpdateMutate = jest.fn();
const mockOnRequestClose = jest.fn();
let mockUseAdvertiserUpdate = {
    data: {
        daily_buy_limit: 100,
        daily_sell_limit: 200,
    },
    error: undefined,
    isLoading: true,
    isSuccess: false,
    mutate: mockUseAdvertiserUpdateMutate,
};

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        advertiser: {
            useUpdate: jest.fn(() => mockUseAdvertiserUpdate),
        },
    },
}));

describe('DailyLimitModal', () => {
    it('should render loader when data is not ready', () => {
        render(<DailyLimitModal currency='USD' isModalOpen onRequestClose={mockOnRequestClose} />, { wrapper });

        expect(screen.getByTestId('dt_derivs-loader')).toBeVisible();
    });
    it('should render the correct title and behaviour', () => {
        mockUseAdvertiserUpdate = {
            ...mockUseAdvertiserUpdate,
            isLoading: false,
            isSuccess: false,
        };
        render(<DailyLimitModal currency='USD' isModalOpen onRequestClose={mockOnRequestClose} />, { wrapper });

        expect(
            screen.getByText(
                `You won’t be able to change your buy and sell limits again after this. Do you want to continue?`
            )
        ).toBeVisible();

        const continueBtn = screen.getByRole('button', {
            name: 'Yes, continue',
        });
        userEvent.click(continueBtn);
        expect(mockUseAdvertiserUpdateMutate).toBeCalledWith({
            upgrade_limits: 1,
        });
    });
    it('should render the successful limits increase', () => {
        mockUseAdvertiserUpdate = {
            ...mockUseAdvertiserUpdate,
            isLoading: false,
            isSuccess: true,
        };
        render(<DailyLimitModal currency='USD' isModalOpen onRequestClose={mockOnRequestClose} />, { wrapper });

        expect(
            screen.getByText(`Your daily limits have been increased to 100 USD (buy) and 200 USD (sell).`)
        ).toBeVisible();

        const okBtn = screen.getByRole('button', {
            name: 'Ok',
        });
        userEvent.click(okBtn);
        expect(mockOnRequestClose).toBeCalled();
    });
    it('should render the error information when limits are unable to be upgraded', () => {
        mockUseAdvertiserUpdate = {
            ...mockUseAdvertiserUpdate,
            // @ts-expect-error Mock assertion of error
            error: new Error(),
            isLoading: false,
            isSuccess: false,
        };
        render(<DailyLimitModal currency='USD' isModalOpen onRequestClose={mockOnRequestClose} />, { wrapper });

        expect(
            screen.getByText(
                `Sorry, we're unable to increase your limits right now. Please try again in a few minutes.`
            )
        ).toBeVisible();

        const okBtn = screen.getByRole('button', {
            name: 'Ok',
        });
        userEvent.click(okBtn);
        expect(mockOnRequestClose).toBeCalled();
    });
});
