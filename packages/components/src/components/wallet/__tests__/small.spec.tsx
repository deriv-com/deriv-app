import React from 'react';
import { render, screen } from '@testing-library/react';
import { WalletSmall } from '../small';

describe('WalletSmall', () => {
    it('Should render WalletSmall component', () => {
        render(<WalletSmall icon='Icon' />);

        expect(screen.getByTestId('dt_wallet_small_icon')).toBeInTheDocument();
    });
});
