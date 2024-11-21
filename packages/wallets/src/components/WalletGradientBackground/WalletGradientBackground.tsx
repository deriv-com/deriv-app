import React from 'react';
import classNames from 'classnames';
import { PaymentMethodDerivDemoWhiteIcon } from '@deriv/quill-icons';
import { THooks } from '../../types';
import './WalletGradientBackground.scss';

type TProps = {
    bodyClassName?: string;
    children: React.ReactNode;
    currency?: THooks.WalletAccountsList['wallet_currency_type'];
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
    // All of the currency classnames are uppercase'd in WalletGradientBackground.scss
    // This is uppercase'd to normalize some currency names like eUSDT and tUSDT to EUSDT and TUSDT
    const gradientCurrencyClassName = currency?.toUpperCase();

    const getClassName = () => {
        if (isDemo) return `wallets-gradient--demo-${device}-${type}-${theme}`;
        if (theme !== 'dark' && theme !== 'light') return `wallets-gradient__palette--${theme}`;
        return `wallets-gradient--${gradientCurrencyClassName}-${device}-${type}-${theme}`;
    };

    const IconWrapper = () => (
        <div className='wallets-gradient__icon-pattern'>
            {/* Array value represents the max number of visible icons for different screen sizes */}
            {/* 4 rows of 25 icons for desktop, 3 rows of 20 icons for mobile/tablet */}
            {[...Array(device === 'desktop' ? 100 : 60)].map((_, index) => (
                <PaymentMethodDerivDemoWhiteIcon
                    className='wallets-gradient__icon'
                    data-testid='dt_wallet_gradient_icon'
                    key={index}
                    width={70}
                />
            ))}
        </div>
    );

    return (
        <div
            className={classNames(`wallets-gradient ${getClassName()}`, {
                [`${bodyClassName}`]: !!bodyClassName,
            })}
            data-testid='dt_wallet_gradient_background'
        >
            {isDemo && theme === 'light' && (type === 'header' || (device === 'mobile' && type === 'card')) && (
                <IconWrapper />
            )}
            {hasShine && !isDemo && <span className='wallets-gradient__shine' data-testid='dt_wallet_gradient_shine' />}
            <div className='wallets-gradient__content'>{children}</div>
        </div>
    );
};

export default WalletGradientBackground;
