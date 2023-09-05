import React from 'react';
import './WalletGradientBackground.scss';

type WalletGradientBackground = {
    is_demo: boolean;
    currency: string;
    type?: 'card' | 'header';
    theme?: 'dark' | 'light';
    device?: 'desktop' | 'mobile';
    children: React.ReactNode;
};

const WalletGradientBackground: React.FC<WalletGradientBackground> = ({
    is_demo,
    currency,
    theme = 'light',
    type = 'card',
    device = 'desktop',
    children,
}) => {
    const className = is_demo
        ? `wallets-gradient--demo-${device}-${type}-${theme}`
        : `wallets-gradient--${currency}-${device}-${type}-${theme}`;

    return <div className={className}>{children}</div>;
};

export default WalletGradientBackground;
