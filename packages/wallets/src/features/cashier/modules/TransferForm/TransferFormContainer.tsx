import React from 'react';
import TransferForm from './components/TransferForm/TransferForm';
import { TransferProvider } from './provider';

const TransferFormContainer = () => {
    return (
        <TransferProvider>
            <TransferForm />
        </TransferProvider>
    );
};

export default TransferFormContainer;
