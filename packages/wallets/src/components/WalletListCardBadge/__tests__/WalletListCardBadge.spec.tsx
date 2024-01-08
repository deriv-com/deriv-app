import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletListCardBadge from '../WalletListCardBadge';

describe('WalletListCardBadge', () => {
    it('should render the badge with default label', () => {
        render(<WalletListCardBadge />);
        expect(screen.getByText('SVG')).toBeInTheDocument();
    });
    it('should render demo badge with the correct label and class names', () => {
        const { container } = render(<WalletListCardBadge isDemo label='virtual' />);
        const badge = screen.getByText('Demo');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('wallets-text__color--white');
        // eslint-disable-next-line testing-library/no-node-access
        expect(container.firstChild).toHaveClass('wallets-list-card__badge--demo');
    });
    it('should render real account badge with the correct label and class name', () => {
        render(<WalletListCardBadge label='malta' />);
        const badge = screen.getByText('MALTA');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('wallets-text__color--general');
    });
});
