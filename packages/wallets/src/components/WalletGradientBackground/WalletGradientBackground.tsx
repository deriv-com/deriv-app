import React from 'react';
import { THooks } from '../../types';
import './WalletGradientBackground.scss';

type TProps = {
    bodyClassName?: string;
    children: React.ReactNode;
    currency: THooks.WalletAccountsList['wallet_currency_type'];
    device?: 'desktop' | 'mobile';
    hasShine?: boolean;
    isDemo?: THooks.WalletAccountsList['is_virtual'];
    theme?: 'dark' | 'grey' | 'light';
    type?: 'card' | 'header';
};

const WalletGradientBackground: React.FC<TProps> = ({
    bodyClassName,
    children,
    currency,
    device = 'desktop',
    hasShine = false,
    isDemo = false,
    theme = 'light',
    type = 'card',
}) => {
    const getClassName = () => {
        if (isDemo) return `wallets-gradient--demo-${device}-${type}-${theme}`;
        if (theme !== 'dark' && theme !== 'light') return `wallets-gradient__palette--${theme}`;
        return `wallets-gradient--${currency}-${device}-${type}-${theme}`;
    };

    return (
        <div className={`wallets-gradient ${bodyClassName} ${getClassName()}`}>
            {hasShine && !isDemo && <span className='wallets-gradient__shine' />}
            {children}
        </div>
    );
};

export default WalletGradientBackground;
