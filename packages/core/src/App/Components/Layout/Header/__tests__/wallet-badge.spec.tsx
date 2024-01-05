import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletBadge from '../wallets/wallet-badge';

describe('WalletBadge', () => {
    it('Should render demo badge', () => {
        render(<WalletBadge is_demo label='svg' />);

        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('Should render svg badge', () => {
        render(<WalletBadge is_demo={false} label='svg' />);

        expect(screen.getByText('SVG')).toBeInTheDocument();
    });

    it('Should render malta badge', () => {
        render(<WalletBadge is_demo={false} label='malta' />);

        expect(screen.getByText('MALTA')).toBeInTheDocument();
    });
});
