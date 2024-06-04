import React from 'react';
import { render, screen } from '@testing-library/react';
import WithdrawalCryptoDisclaimer from '../WithdrawalCryptoDisclaimer';

describe('WithdrawalCryptoDisclaimer', () => {
    it('should render content of withdrawal crypto disclaimer', () => {
        render(<WithdrawalCryptoDisclaimer />);

        expect(screen.getByText(/Do not enter an address linked to an initial coin offering/)).toBeInTheDocument();
        expect(
            screen.getByText(/Please note that your maximum and minimum withdrawal limits aren't fixed./)
        ).toBeInTheDocument();
    });
});
