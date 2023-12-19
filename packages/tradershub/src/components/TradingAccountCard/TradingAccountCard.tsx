import React, { FC, PropsWithChildren, ReactNode } from 'react';
import './TradingAccountCard.scss';

type TProps = {
    leading?: () => ReactNode;
    trailing?: () => ReactNode;
};

const TradingAccountCard: FC<PropsWithChildren<TProps>> = ({ children, leading, trailing }) => {
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
