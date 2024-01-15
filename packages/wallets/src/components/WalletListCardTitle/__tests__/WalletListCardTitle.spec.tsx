import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletListCardTitle from '../WalletListCardTitle';

describe('WalletListCardTitle', () => {
    it('should render the title with provided currency', () => {
        render(<WalletListCardTitle title='BTC' />);
        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();
    });
});
