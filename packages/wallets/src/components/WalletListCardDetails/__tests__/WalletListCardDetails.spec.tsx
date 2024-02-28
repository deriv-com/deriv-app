import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletListCardDetails from '../WalletListCardDetails';

jest.mock('../../WalletListCardActions/WalletListCardActions', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked WalletListCardActions</div>),
}));

jest.mock('../../WalletListCardBalance/WalletListCardBalance', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked WalletListCardBalance</div>),
}));

jest.mock('../../WalletListCardDropdown/WalletListCardDropdown', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked WalletListCardDropdown</div>),
}));

describe('WalletListCardDetails', () => {
    it('should render with default components correctly', () => {
        render(<WalletListCardDetails />);
        expect(screen.getByText('Mocked WalletListCardActions')).toBeInTheDocument();
        expect(screen.getByText('Mocked WalletListCardBalance')).toBeInTheDocument();
        expect(screen.getByText('Mocked WalletListCardDropdown')).toBeInTheDocument();
    });
});
