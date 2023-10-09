import React from 'react';
import './WalletGradientBackground.scss';

type TProps = {
    children: React.ReactNode;
    currency: string;
    device?: 'desktop' | 'mobile';
    hasShine?: boolean;
    isDemo?: boolean;
    theme?: 'dark' | 'light';
    type?: 'card' | 'header';
};

const WalletGradientBackground: React.FC<TProps> = ({
    children,
    currency,
    device = 'desktop',
    hasShine = false,
    isDemo = false,
    theme = 'light',
    type = 'card',
}) => {
    const className = isDemo
        ? `wallets-gradient--demo-${device}-${type}-${theme}`
        : `wallets-gradient--${currency}-${device}-${type}-${theme}`;

    return (
        <div className={`wallets-gradient ${className}`}>
            {hasShine && !isDemo && <span className='wallets-gradient__shine' />}
            {children}
        </div>
    );
};

export default WalletGradientBackground;
