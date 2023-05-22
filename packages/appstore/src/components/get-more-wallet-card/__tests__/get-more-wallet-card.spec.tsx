import React from 'react';
import GetMoreWalletCard from '../get-more-wallet-card';
import { render, screen } from '@testing-library/react';

describe('GetMoreWalletCard', () => {
    it('should render correctly', () => {
        const { container } = render(<GetMoreWalletCard />);
        expect(container).toBeInTheDocument();
    });

    it('should render the correct text and classname', () => {
        render(<GetMoreWalletCard />);
        expect(screen.getByText('Get more wallets')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveClass('get-more-wallet-card--button');
    });
});
