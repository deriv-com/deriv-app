import React from 'react';
import TransferForm from './components/TransferForm/TransferForm';
import { TransferProvider } from './provider';

const Transfer = () => {
    return (
        <TransferProvider>
            <TransferForm />
        </TransferProvider>
    );
};

export default Transfer;
