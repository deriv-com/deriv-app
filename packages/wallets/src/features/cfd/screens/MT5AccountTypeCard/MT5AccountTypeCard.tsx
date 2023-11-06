import React from 'react';
import './MT5AccountTypeCard.scss';

type TProps = {
    description: string;
    icon: JSX.Element;
    isSelected: boolean;
    onClick: () => void;
    title: string;
};

const MT5AccountTypeCard: React.FC<TProps> = ({ description, icon, isSelected, onClick, title }) => {
    return (
        <div className={`wallets-mt5-account-type-card${isSelected ? '-selected' : ''}`} onClick={onClick}>
            <div className='wallets-mt5-account-type-card-list'>
                <div className='wallets-mt5-account-type-card-list-content'>
                    <div className='wallets-mt5-account-type-card-list-content-details'>
                        {icon}
                        <div className='wallets-mt5-account-type-card-list-content-details-title-description'>
                            <div className='wallets-mt5-account-type-card-list-content-details-title'>{title}</div>
                            <div className='wallets-mt5-account-type-card-list-content-details-description'>
                                {description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MT5AccountTypeCard;
