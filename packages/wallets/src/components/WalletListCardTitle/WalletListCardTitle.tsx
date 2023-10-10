import React from 'react';
import './WalletListCardTitle.scss';

type TProps = {
    currency: string;
};

const WalletListCardTitle: React.FC<TProps> = ({ currency }) => {
    return <div className='wallets-currency__title'>{currency} Wallet</div>;
};

export default WalletListCardTitle;
