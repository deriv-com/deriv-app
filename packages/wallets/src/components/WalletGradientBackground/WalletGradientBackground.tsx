import React from 'react';
import './WalletGradientBackground.scss';

type TProps = {
    children: React.ReactNode;
    currency: string;
    device?: 'desktop' | 'mobile';
    has_shine?: boolean;
    is_demo?: boolean;
    theme?: 'dark' | 'light';
    type?: 'card' | 'header';
};

const WalletGradientBackground: React.FC<TProps> = ({
    has_shine = false,
    is_demo = false,
    currency,
    theme = 'light',
    type = 'card',
    device = 'desktop',
    children,
}) => {
    const className = is_demo
        ? `wallets-gradient--demo-${device}-${type}-${theme}`
        : `wallets-gradient--${currency}-${device}-${type}-${theme}`;

    return (
        <div className={`wallets-gradient ${className}`}>
            {has_shine && !is_demo && <span className='wallets-gradient__shine' />}
            {children}
        </div>
    );
};

export default WalletGradientBackground;
