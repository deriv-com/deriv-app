import React from 'react';
import { render, screen } from '@testing-library/react';
import WithdrawalLimitsTable from '../withdrawal-limits-table';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useGetWithdrawalLimitsDetails } from '@deriv/hooks';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/hooks', () => ({
    useGetWithdrawalLimitsDetails: jest.fn(),
}));

describe('WithdrawalLimitsTable', () => {
    const store = mockStore({});

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () =>
        render(
            <StoreProvider store={store}>
                <WithdrawalLimitsTable />
            </StoreProvider>
        );

    const constant_title = ['Withdrawal limits', 'Limit (USD)'];

    it('should renders the withdrawal limits table correctly', () => {
        (useGetWithdrawalLimitsDetails as jest.Mock).mockReturnValue({
            withdrawal_limit_details: [
                {
                    withdrawal_title: 'Lifetime limit',
                    withdrawal_info_message: 'Lifetime limit info',
                    withdrawal_amount: 10000,
                },
                {
                    withdrawal_title: '30-day limit',
                    withdrawal_info_message: '30-day limit info',
                    withdrawal_amount: 5000,
                },
            ],
        });

        renderComponent();

        constant_title.map(title => expect(screen.getByText(title)).toBeInTheDocument());

        expect(screen.getByText(/Lifetime limit/)).toBeInTheDocument();
        expect(screen.getByText(/10,000/)).toBeInTheDocument();

        expect(screen.getByText(/30-day limit/)).toBeInTheDocument();
        expect(screen.getByText(/5,000/)).toBeInTheDocument();
    });

    it('should render withdrawal_info_message on mouse hover on the info icon', () => {
        (useGetWithdrawalLimitsDetails as jest.Mock).mockReturnValue({
            withdrawal_limit_details: [
                {
                    withdrawal_title: 'Lifetime limit',
                    withdrawal_info_message: 'Lifetime limit info',
                    withdrawal_amount: 10000,
                },
            ],
        });

        renderComponent();
        expect(screen.queryByText(/Lifetime limit info/)).not.toBeInTheDocument();
        const pop_over_icon = screen.getByTestId('dt_popover_wrapper');
        userEvent.hover(pop_over_icon);
        expect(screen.queryByText(/Lifetime limit info/)).toBeInTheDocument();
    });

    it('should not render any value if withdrawal_limit_details is empty', () => {
        (useGetWithdrawalLimitsDetails as jest.Mock).mockReturnValue({
            withdrawal_limit_details: [],
        });

        renderComponent();

        constant_title.map(title => expect(screen.getByText(title)).toBeInTheDocument());

        expect(screen.queryByText(/Lifetime limit/)).not.toBeInTheDocument();
        expect(screen.queryByText(/10,000/)).not.toBeInTheDocument();

        expect(screen.queryByText(/30-day limit/)).not.toBeInTheDocument();
        expect(screen.queryByText(/5,000/)).not.toBeInTheDocument();
    });
});
