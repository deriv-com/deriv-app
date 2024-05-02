import React, { ReactNode } from 'react';
import { twJoin } from 'tailwind-merge';
import './TradingAccountCard.scss';

type TTradingAccountCardProps = {
    children: ReactNode;
    contentClassName?: string;
    leading?: () => ReactNode;
    trailing?: () => ReactNode;
};

const TradingAccountCard = ({ children, leading, trailing, contentClassName }: TTradingAccountCardProps) => {
    return (
        <div className='wallets-trading-account-card'>
            {leading?.()}
            <div className={twJoin('wallets-trading-account-card__content', contentClassName)}>
                {children}
                {trailing?.()}
            </div>
        </div>
    );
};

export default TradingAccountCard;
