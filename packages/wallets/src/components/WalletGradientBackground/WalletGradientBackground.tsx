import React from 'react';
import './WalletGradientBackground.scss';

type TProps = {
    bodyClassName?: string;
    children: React.ReactNode;
    currency: string;
    device?: 'desktop' | 'mobile';
    has_shine?: boolean;
    is_demo?: boolean;
    theme?: 'dark' | 'light' | Omit<string, 'dark' | 'light'>;
    type?: 'card' | 'header';
};

const WalletGradientBackground: React.FC<TProps> = ({
    children,
    currency,
    device = 'desktop',
    has_shine = false,
    is_demo = false,
    theme = 'light',
    type = 'card',
    bodyClassName,
}) => {
    const getClassName = () => {
        if (is_demo) return `wallets-gradient--demo-${device}-${type}-${theme}`;
        if (theme !== 'dark' && theme !== 'light') return `wallets-gradient__palette--${theme}`;
        return `wallets-gradient--${currency}-${device}-${type}-${theme}`;
    };

    return (
        <div className={`wallets-gradient ${bodyClassName} ${getClassName()}`}>
            {has_shine && !is_demo && <span className='wallets-gradient__shine' />}
            {children}
        </div>
    );
};

export default WalletGradientBackground;
