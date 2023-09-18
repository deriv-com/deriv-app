import React from 'react';
import './TradingAccountCard.scss';

type TProps = {
    description: string;
    icon: React.ReactNode;
    title: string;
    renderActions?: () => React.ReactNode;
};

const TradingAccountCard: React.FC<TProps> = ({ description, icon, title, renderActions }) => {
    return (
        <div className='wallets-trading-account-card'>
            <div className='wallets-trading-account-card__icon'>{icon}</div>
            <div className='wallets-trading-account-card__content'>
                <div className='wallets-trading-account-card__details'>
                    <p className='wallets-trading-account-card__details-title'>
                        {/* TODO: Add localization */}
                        {title}
                    </p>
                    <p className='wallets-trading-account-card__details-description'>
                        {/* TODO: Add localization */}
                        {description}
                    </p>
                </div>
                {renderActions?.()}
            </div>
        </div>
    );
};

export default TradingAccountCard;
