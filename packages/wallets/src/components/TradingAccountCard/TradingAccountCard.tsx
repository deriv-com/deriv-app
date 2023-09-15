import React, { ReactElement } from 'react';
import { Localize } from '@deriv/translations';
import './TradingAccountCard.scss';

type TProps = {
    description: string;
    icon: ReactElement;
    title: string;
};

const TradingAccountCard: React.FC<TProps> = ({ description, icon, title }) => {
    return (
        <div className='wallets-trading-account-card'>
            <div className='wallets-trading-account-card__icon'>{icon}</div>
            <div className='wallets-trading-account-card__content'>
                <div className='wallets-trading-account-card__details'>
                    <p className='wallets-trading-account-card__details-title'>
                        <Localize i18n_default_text={title} />
                    </p>
                    <p className='wallets-trading-account-card__details-description'>
                        <Localize i18n_default_text={description} />
                    </p>
                </div>
                <div className='wallets-trading-account-card__actions'>
                    <button className='wallets-trading-account-card__action'>
                        <Localize i18n_default_text='Open' />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradingAccountCard;
