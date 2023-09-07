import React, { ReactElement } from 'react';
import './TradingAccountCard.scss';

type TProps = {
    description: string;
    icon: ReactElement;
    title: string;
    has_divider?: boolean;
};

const TradingAccountCard: React.FC<TProps> = ({ description, icon, title, has_divider = false }) => {
    return (
        <div className='wallets-trading-account-card'>
            {icon}
            <div
                className={`wallets-trading-account-card__content ${
                    has_divider ? 'wallets-trading-account-card__content--divider' : ''
                }`}
            >
                <div className='wallets-trading-account-card__details'>
                    <p className='wallets-trading-account-card__details-title'>{title}</p>
                    <p className='wallets-trading-account-card__details-description'>{description}</p>
                </div>
                <div className='wallets-trading-account-card__actions'>
                    <button className='wallets-trading-account-card__action'>Open</button>
                </div>
            </div>
        </div>
    );
};

export default TradingAccountCard;
