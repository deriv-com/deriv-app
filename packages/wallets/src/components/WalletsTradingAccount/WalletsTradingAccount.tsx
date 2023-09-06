import React, { ReactElement } from 'react';
import './WalletsTradingAccount.scss';

type TProps = {
    description: string;
    icon: ReactElement;
    title: string;
};

const WalletsTradingAccount: React.FC<TProps> = ({ description, icon, title }) => {
    return (
        <div className='wallets-trading-account'>
            {icon}
            <div className='wallets-trading-account__details'>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <div className='wallets-trading-account__actions'>
                <button className='wallets-trading-account__action'>Open</button>
            </div>
        </div>
    );
};

export default WalletsTradingAccount;
