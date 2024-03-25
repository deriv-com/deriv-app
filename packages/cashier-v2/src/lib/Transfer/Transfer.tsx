import React, { useCallback, useEffect } from 'react';
import { useTransferBetweenAccounts } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import TransferProvider from './provider/TransferProvider';
import { TransferForm } from './components';

const Transfer = () => {
    return (
        <div>
            <TransferForm />
        </div>
    );
};

const TransferModule = () => {
    const { data: transferAccounts, isSuccess, mutate } = useTransferBetweenAccounts();
    const requestForAccounts = useCallback(() => mutate({ accounts: 'all' }), [mutate]);

    useEffect(() => {
        requestForAccounts();
    }, [requestForAccounts]);

    if (isSuccess && transferAccounts?.accounts) {
        return (
            <TransferProvider accounts={transferAccounts?.accounts}>
                <Transfer />
            </TransferProvider>
        );
    }

    return <Loader />;
};

export default TransferModule;
