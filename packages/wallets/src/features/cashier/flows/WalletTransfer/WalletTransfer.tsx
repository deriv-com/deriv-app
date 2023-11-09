import React from 'react';
import { TransferForm } from '../../modules';
import { TransferProvider } from '../../modules/TransferForm/provider';

const WalletTransfer = () => {
    return (
        <TransferProvider>
            <TransferForm />
        </TransferProvider>
    );
};

export default WalletTransfer;
