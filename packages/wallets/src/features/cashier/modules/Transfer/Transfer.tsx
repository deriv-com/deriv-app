import React from 'react';
import { Loader } from '../../../../components';
import { TransferForm } from './components';
import { useWalletTransfer } from './hooks';

const Transfer = () => {
    const { isLoading } = useWalletTransfer();

    if (isLoading) return <Loader />;

    return <TransferForm />;
};

export default Transfer;
