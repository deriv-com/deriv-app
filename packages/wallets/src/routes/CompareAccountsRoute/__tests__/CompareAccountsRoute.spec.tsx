import React from 'react';
import { render, screen } from '@testing-library/react';
import CompareAccountsRoute from '../CompareAccountsRoute';

jest.mock('../../../features/cfd/screens/CompareAccounts', () => ({
    CompareAccountsScreen: () => <div>Mocked Compare Accounts Screen</div>,
}));

describe('CompareAccountsRoute', () => {
    it('renders the CompareAccountsScreen component', () => {
        render(<CompareAccountsRoute />);
        expect(screen.getByText('Mocked Compare Accounts Screen')).toBeInTheDocument();
    });
});
