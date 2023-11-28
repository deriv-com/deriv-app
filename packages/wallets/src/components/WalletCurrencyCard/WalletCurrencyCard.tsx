import React from 'react';
import { TGenericSizes, THooks } from '../../types';
import { WalletCardIcon } from '../WalletCardIcon';
import { WalletGradientBackground } from '../WalletGradientBackground';
import './WalletCurrencyCard.scss';

type TProps = {
    currency: THooks.WalletAccountsList['wallet_currency_type'];
    isDemo?: THooks.WalletAccountsList['is_virtual'];
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
};

const WalletCurrencyCard: React.FC<TProps> = ({ currency, isDemo, size = 'lg' }: TProps) => {
    return (
        <WalletGradientBackground currency={currency} isDemo={isDemo} type='card'>
            <div className={`wallets-currency-card wallets-currency-card--${size}`}>
                <WalletCardIcon device='desktop' size={size} type={isDemo ? 'Demo' : currency} />
            </div>
        </WalletGradientBackground>
    );
};

export default WalletCurrencyCard;
