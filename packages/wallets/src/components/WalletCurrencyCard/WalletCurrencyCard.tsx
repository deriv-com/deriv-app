import React from 'react';
import { WalletCardIcon } from '../WalletCardIcon';
import { WalletGradientBackground } from '../WalletGradientBackground';
import './WalletCurrencyCard.scss';

type TProps = {
    currency: string;
    isDemo?: boolean;
    size?: 'lg' | 'md' | 'sm';
};

const WalletCurrencyCard: React.FC<TProps> = ({ currency, isDemo, size = 'lg' }: TProps) => {
    return (
        <WalletGradientBackground currency={currency} is_demo={isDemo} type='card'>
            <div className={`wallets-currency-card wallets-currency-card-${size}`}>
                <WalletCardIcon size={size} type={currency} />
            </div>
        </WalletGradientBackground>
    );
};

export default WalletCurrencyCard;
