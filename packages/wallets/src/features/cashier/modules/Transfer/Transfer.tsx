import React from 'react';
import type { THooks } from '../../../../types';
import TransferForm from './components/TransferForm/TransferForm';
import { TransferProvider } from './provider';

type TProps = {
    accounts: THooks.TransferAccount[];
};

const Transfer: React.FC<TProps> = ({ accounts }) => {
    return (
        <TransferProvider accounts={accounts}>
            <TransferForm />
        </TransferProvider>
    );
};

export default Transfer;
