import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import WalletBadge from '../WalletBadge';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

describe('WalletBadge Component', () => {
    it('should render without crashing', () => {
        render(<WalletBadge>Test Child</WalletBadge>);
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it(`should render correctly when isMobile is true`, () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false, isMobile: true });
        render(<WalletBadge>Test Child</WalletBadge>);
        const badge = screen.getByText('Test Child');
        expect(badge).toHaveClass('derivs-text__size--sm');
    });
});
