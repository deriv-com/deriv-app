import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletListCardBadge from '../WalletListCardBadge';

describe('WalletListCardBadge', () => {
    it('should render demo badge with the correct label and class names', () => {
        const { container } = render(<WalletListCardBadge />);
        const badge = screen.getByText('Demo');
        expect(badge).toBeInTheDocument();
        // eslint-disable-next-line testing-library/no-node-access
        expect(container.firstChild).toHaveClass('wallets-list-card-badge');
    });
});
