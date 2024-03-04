import React, { useCallback, useEffect } from 'react';
import { useTransferBetweenAccounts } from '@deriv/api';
import { Loader } from '@deriv-com/ui';
import { PageContainer } from '../../components';
import TransferProvider from './provider/TransferProvider';
import { TransferForm } from './components';

const Transfer = () => {
    const { data: transferAccounts, isLoading: isTransferAccountsLoading, mutate } = useTransferBetweenAccounts();

    const requestForAccounts = useCallback(() => mutate({ accounts: 'all' }), [mutate]);

    useEffect(() => {
        requestForAccounts();
    }, [requestForAccounts]);

    if (isTransferAccountsLoading)
        return (
            <PageContainer>
                <Loader />
            </PageContainer>
        );

    if (transferAccounts?.accounts?.length <= 1) return <div>Need more than one account</div>;

    return (
        <PageContainer>
            <TransferProvider accounts={transferAccounts?.accounts}>
                <TransferForm />
            </TransferProvider>
        </PageContainer>
    );
};

export default Transfer;
