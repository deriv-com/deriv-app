import React from 'react';

type TWalletDescription = {
    title: string;
    description: string;
    depositsInformation: string;
    withdrawalsInformation: string;
};
const WalletDescription = ({ title, description, depositsInformation, withdrawalsInformation }: TWalletDescription) => {
    return (
        <div className='wallet-details'>
            <div className='wallet-details__title'>{title}</div>
            <div className='wallet-details__description'>{description}</div>
            <div className='wallet-details__information'>
                <div>{depositsInformation}</div>
                <div className='wallet-details__horizontal-line' />
                <div>{withdrawalsInformation}</div>
            </div>
        </div>
    );
};

export default WalletDescription;
