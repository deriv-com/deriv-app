import React from 'react';
import type { THooks } from '../../../../types';
import { TransferForm, TransferReceipt } from './components';
import { TransferProvider, useTransfer } from './provider';
import { TransferErrorScreen } from '../../screens/TransferErrorScreen';

type TProps = {
    accounts: THooks.TransferAccount[];
};

const TransferModule: React.FC<TProps> = ({ accounts }) => {
    return (
        <TransferProvider accounts={accounts}>
            <Transfer />
        </TransferProvider>
    );
};

const Transfer: React.FC = () => {
    const { error, receipt, resetTransfer } = useTransfer();
    const transferError = error?.error;

    if (transferError) return <TransferErrorScreen error={transferError} resetError={resetTransfer} />;

    if (receipt) return <TransferReceipt />;

    return <TransferForm />;
};

export default TransferModule;
