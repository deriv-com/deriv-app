import React from 'react';
import { render, screen } from '@testing-library/react';
import MarketClosedContractOverlay from '../market-closed-contract-overlay';

describe('<MarketClosedContractOverlay />', () => {
    it('should render passed validation_error', () => {
        render(<MarketClosedContractOverlay validation_error='Mocked validation' />);

        expect(screen.getByText('Mocked validation')).toBeInTheDocument();
    });
});
