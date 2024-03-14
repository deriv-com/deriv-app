import React from 'react';
import './TradingAccountCard.scss';

type TProps = {
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
};

const TradingAccountCard: React.FC<React.PropsWithChildren<TProps>> = ({ children, leading, trailing }) => {
    return (
        <div className='wallets-trading-account-card'>
            {leading}
            <div className='wallets-trading-account-card__content'>
                {children}
                {trailing}
            </div>
        </div>
    );
};

export default TradingAccountCard;
