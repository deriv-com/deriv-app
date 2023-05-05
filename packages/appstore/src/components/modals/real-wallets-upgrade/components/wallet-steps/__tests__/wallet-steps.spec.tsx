import React from 'react';
import WalletSteps from '../wallet-steps';
import { render, screen } from '@testing-library/react';

describe('WalletSteps', () => {
    const icon = <img src='icon.png' alt='icon' />;
    const title = 'Upgrade To Wallets';
    const description = 'Dont be broke';
    const bullets = ['Bullet 1', 'Bullet 2', 'Bullet 3'];

    it('should render', () => {
        const { container } = render(
            <WalletSteps icon={icon} title={title} description={description} bullets={bullets} />
        );
        expect(container).toBeInTheDocument();
    });

    it('should render icon', () => {
        render(<WalletSteps icon={icon} title={title} description={description} bullets={bullets} />);
        expect(screen.getByAltText('icon')).toBeInTheDocument();
    });

    it('should render title, description and bullets', () => {
        render(<WalletSteps icon={icon} title={title} description={description} bullets={bullets} />);
        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(description)).toBeInTheDocument();
        bullets.forEach(bullet => {
            expect(screen.getByText(bullet)).toBeInTheDocument();
        });
    });
});
