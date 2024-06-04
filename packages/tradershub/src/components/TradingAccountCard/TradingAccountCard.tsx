import React, { ReactNode } from 'react';
import './TradingAccountCard.scss';

type TTradingAccountCardProps = {
    children: ReactNode;
    leading?: () => ReactNode;
    trailing?: () => ReactNode;
};

const TradingAccountCard = ({ children, leading, trailing }: TTradingAccountCardProps) => {
    return (
        <div className='wallets-trading-account-card'>
            {leading?.()}
            <div className='wallets-trading-account-card__content'>
                {children}
                {trailing?.()}
            </div>
        </div>
    );
};

export default TradingAccountCard;
