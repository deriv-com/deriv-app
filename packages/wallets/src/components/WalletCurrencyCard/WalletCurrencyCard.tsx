import React, { ComponentProps } from 'react';
import { TGenericSizes, THooks } from '../../types';
import { WalletCurrencyIcons } from '../WalletCurrencyIcons';
import { WalletGradientBackground } from '../WalletGradientBackground';
import './WalletCurrencyCard.scss';

type TProps = {
    currency: ComponentProps<typeof WalletCurrencyIcons>['currency'];
    isDemo?: THooks.WalletAccountsList['is_virtual'];
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
};

const WalletCurrencyCard: React.FC<TProps> = ({ currency, isDemo, size = 'lg' }: TProps) => {
    return (
        <WalletGradientBackground currency={currency} isDemo={isDemo} type='card'>
            <div className={`wallets-currency-card wallets-currency-card--${size}`}>
                <WalletCurrencyIcons currency={isDemo ? 'DEMO' : currency} size={size} />
            </div>
        </WalletGradientBackground>
    );
};

export default WalletCurrencyCard;
