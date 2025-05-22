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

    it('displays proper CFDs compare accounts header title for real accounts', () => {
        render(<CompareAccountsHeader isDemo={false} isLoading={false} />);

        expect(screen.getByText('Compare CFDs accounts')).toBeInTheDocument();
    });

    it('displays proper CFDs compare accounts header title for demo accounts', () => {
        render(<CompareAccountsHeader isDemo={true} isLoading={false} />);

        expect(screen.getByText('Compare CFDs demo accounts')).toBeInTheDocument();
    });

    it('redirects back to root when close icon is clicked', () => {
        render(<CompareAccountsHeader isDemo={false} isLoading={false} />);

        const closeIcon = screen.getByTestId('dt_wallets_compare_accounts_header_close_icon');
        fireEvent.click(closeIcon);
        expect(mockHistoryPush).toHaveBeenCalledWith('/');
    });
});
