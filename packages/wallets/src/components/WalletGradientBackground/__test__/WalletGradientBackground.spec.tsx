import React from 'react';
import { render, screen, within } from '@testing-library/react';
import WalletGradientBackground from '../WalletGradientBackground';
import '@testing-library/jest-dom/extend-expect';

describe('WalletGradientBackground', () => {
    const defaultProps = {
        children: <div>Test Content</div>,
    };

    it('renders without crashing', () => {
        render(<WalletGradientBackground {...defaultProps} />);
        expect(screen.getByTestId('dt_wallet_gradient_background')).toBeInTheDocument();
    });

    it('applies the correct class names based on props', () => {
        render(
            <WalletGradientBackground {...defaultProps} currency='usd' device='mobile' theme='dark' type='header' />
        );
        expect(screen.getByTestId('dt_wallet_gradient_background')).toHaveClass(
            'wallets-gradient wallets-gradient--USD-mobile-header-dark'
        );
    });

    it('applies the demo class name when isDemo is true', () => {
        render(<WalletGradientBackground {...defaultProps} device='desktop' isDemo={true} theme='light' type='card' />);
        expect(screen.getByTestId('dt_wallet_gradient_background')).toHaveClass(
            'wallets-gradient wallets-gradient--demo-desktop-card-light'
        );
    });

    it('applies the correct palette class name when theme is neither dark nor light', () => {
        render(<WalletGradientBackground {...defaultProps} theme='grey' />);
        expect(screen.getByTestId('dt_wallet_gradient_background')).toHaveClass(
            'wallets-gradient wallets-gradient__palette--grey'
        );
    });

    it('renders the shine element when hasShine is true and isDemo is false', () => {
        render(<WalletGradientBackground {...defaultProps} hasShine={true} isDemo={false} />);
        const walletGradientBackground = screen.getByTestId('dt_wallet_gradient_background');
        const shineElement = within(walletGradientBackground).queryByTestId('dt_wallet_gradient_shine');
        expect(shineElement).toBeInTheDocument();
    });

    it('does not render the shine element when hasShine is false', () => {
        render(<WalletGradientBackground {...defaultProps} hasShine={false} />);
        const walletGradientBackground = screen.getByTestId('dt_wallet_gradient_background');
        const shineElement = within(walletGradientBackground).queryByTestId('dt_wallet_gradient_shine');
        expect(shineElement).not.toBeInTheDocument();
    });

    it('does not render the shine element when isDemo is true', () => {
        render(<WalletGradientBackground {...defaultProps} hasShine={true} isDemo={true} />);
        const walletGradientBackground = screen.getByTestId('dt_wallet_gradient_background');
        const shineElement = within(walletGradientBackground).queryByTestId('dt_wallet_gradient_shine');
        expect(shineElement).not.toBeInTheDocument();
    });

    it('applies the bodyClassName when provided', () => {
        render(<WalletGradientBackground {...defaultProps} bodyClassName='custom-body-class' />);
        expect(screen.getByTestId('dt_wallet_gradient_background')).toHaveClass('custom-body-class');
    });

    it('renders children correctly', () => {
        render(<WalletGradientBackground {...defaultProps} />);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
});
