import React from 'react';
import WalletJurisdictionBadge from '../wallet-jurisdiction-badge';
import { render, screen } from '@testing-library/react';

describe('WalletJurisdictionBadge', () => {
    it('Should render demo badge', () => {
        render(<WalletJurisdictionBadge is_demo shortcode='svg' />);

        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('Should render svg badge', () => {
        render(<WalletJurisdictionBadge is_demo={false} shortcode='svg' />);

        expect(screen.getByText('SVG')).toBeInTheDocument();
    });

    it('Should render malta badge', () => {
        render(<WalletJurisdictionBadge is_demo={false} shortcode='malta' />);

        expect(screen.getByText('MALTA')).toBeInTheDocument();
    });
});
