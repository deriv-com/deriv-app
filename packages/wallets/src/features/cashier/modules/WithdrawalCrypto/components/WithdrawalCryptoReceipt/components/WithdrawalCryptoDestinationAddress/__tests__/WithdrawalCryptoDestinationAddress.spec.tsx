import React from 'react';
import { render, screen } from '@testing-library/react';
import WithdrawalCryptoDestinationAddress from '../WithdrawalCryptoDestinationAddress';

describe('WithdrawalCryptoDestinationAddress', () => {
    it('should render the component with the provided address', () => {
        const address = 'your_crypto_address';
        render(<WithdrawalCryptoDestinationAddress address={address} />);

        const addressElement = screen.getByText(address);
        expect(addressElement).toBeInTheDocument();
    });

    it('should render the component without an address', () => {
        render(<WithdrawalCryptoDestinationAddress />);

        const noAddressElement = screen.getByText('Destination address');
        expect(noAddressElement).toBeInTheDocument();
    });
});
