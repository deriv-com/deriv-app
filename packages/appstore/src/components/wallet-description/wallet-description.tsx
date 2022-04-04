import React from 'react';

type TWalletDescription = {
    title: string;
    description: string;
    depositsInformation: string;
    withdrawalsInformation: string;
};
const WalletDescription = ({ title, description, depositsInformation, withdrawalsInformation }: TWalletDescription) => {
    return (
        <div>
            <p>{title}</p>
            <p>{description}</p>
            <p>{depositsInformation}</p>
            <p>{withdrawalsInformation}</p>
        </div>
    );
};

export default WalletDescription;
