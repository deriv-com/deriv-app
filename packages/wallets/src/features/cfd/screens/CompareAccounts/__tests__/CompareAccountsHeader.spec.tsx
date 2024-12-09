import React from 'react';
import { useHistory } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import CompareAccountsHeader from '../CompareAccountsHeader';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

describe('CompareAccountsHeader', () => {
    const mockHistoryPush = jest.fn();

    beforeEach(() => {
        (useHistory as jest.Mock).mockReturnValue({ push: mockHistoryPush });
    });

    it('displays CFDs compare accounts header title for non-demo, non-EU accounts', () => {
        render(<CompareAccountsHeader isDemo={false} isEuRegion={false} isLoading={false} />);

        expect(screen.getByText('Compare CFDs accounts')).toBeInTheDocument();
    });

    it('displays CFDs compare accounts header title for demo, non-EU accounts', () => {
        render(<CompareAccountsHeader isDemo={true} isEuRegion={false} isLoading={false} />);

        expect(screen.getByText('Compare CFDs demo accounts')).toBeInTheDocument();
    });

    it('displays MT5 CFDs compare accounts header title for non-demo, EU accounts', () => {
        render(<CompareAccountsHeader isDemo={false} isEuRegion={true} isLoading={false} />);

        expect(screen.getByText('Deriv MT5 CFDs real account')).toBeInTheDocument();
    });

    it('displays MT5 CFDs compare accounts header title for demo, EU accounts', () => {
        render(<CompareAccountsHeader isDemo={true} isEuRegion={true} isLoading={false} />);

        expect(screen.getByText('Deriv MT5 CFDs Demo account')).toBeInTheDocument();
    });

    it('redirects back to root when close icon is clicked', () => {
        render(<CompareAccountsHeader isDemo={false} isEuRegion={false} isLoading={false} />);

        const closeIcon = screen.getByTestId('dt_wallets_compare_accounts_header_close_icon');
        fireEvent.click(closeIcon);
        expect(mockHistoryPush).toHaveBeenCalledWith('/');
    });
});
