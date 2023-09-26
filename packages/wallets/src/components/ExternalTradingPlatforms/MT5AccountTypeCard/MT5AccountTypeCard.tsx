import React from 'react';
import './MT5AccountTypeCard.scss';

type TProps = {
    description: string;
    icon: JSX.Element;
    title: string;
};

const MT5AccountTypeCard: React.FC<TProps> = ({ description, icon, title }) => {
    return (
        <div className='wallets-mt5-account-type-card'>
            <div className='wallets-mt5-account-type-card-list'>
                <div className='wallets-mt5-account-type-card-list-content'>
                    <div className='wallets-mt5-account-type-card-list-content-body'>
                        <div className='wallets-mt5-account-type-card-list-content-body-details'>
                            <div className='wallets-mt5-account-type-card-list-content-body-details-icon'>{icon}</div>
                            <div className='wallets-mt5-account-type-card-list-content-body-details-title-description'>
                                <div className='wallets-mt5-account-type-card-list-content-body-details-title'>
                                    {title}
                                </div>
                                <div className='wallets-mt5-account-type-card-list-content-body-details-description'>
                                    {description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MT5AccountTypeCard;
