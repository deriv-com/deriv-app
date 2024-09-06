import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import WalletAddedSuccessFooter from '../WalletAddedSuccessFooter';

describe('WalletAddedSuccessFooter', () => {
    const mockPrimaryClick = jest.fn();
    const mockSecondaryClick = jest.fn();

    beforeEach(() => {
        render(
            <WalletAddedSuccessFooter
                onPrimaryButtonClick={mockPrimaryClick}
                onSecondaryButtonClick={mockSecondaryClick}
            />
        );
    });

    it('renders the component with correct buttons', () => {
        expect(screen.getByText('Maybe later')).toBeInTheDocument();
        expect(screen.getByText('Deposit')).toBeInTheDocument();
    });

    it('calls onSecondaryButtonClick when "Maybe later" button is clicked', () => {
        fireEvent.click(screen.getByText('Maybe later'));
        expect(mockSecondaryClick).toHaveBeenCalledTimes(1);
    });

    it('calls onPrimaryButtonClick when "Deposit" button is clicked', () => {
        fireEvent.click(screen.getByText('Deposit'));
        expect(mockPrimaryClick).toHaveBeenCalledTimes(1);
    });
});
