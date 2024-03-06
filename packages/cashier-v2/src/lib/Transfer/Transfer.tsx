import React, { useCallback, useEffect } from 'react';
import { useTransferBetweenAccounts } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { PageContainer } from '../../components';
import TransferProvider from './provider/TransferProvider';
import { TransferForm } from './components';

const Transfer = () => {
    const { data: transferAccounts, isSuccess, mutate } = useTransferBetweenAccounts();

    const requestForAccounts = useCallback(() => mutate({ accounts: 'all' }), [mutate]);

    // console.log('=> Transfer - isSuccess', isSuccess, ', API data', transferAccounts);

    useEffect(() => {
        requestForAccounts();
    }, [requestForAccounts]);

    if (isSuccess) {
        if (transferAccounts?.accounts?.length <= 1) return <div>Need more than one account</div>;

        return (
            <PageContainer>
                <TransferProvider accounts={transferAccounts?.accounts}>
                    <TransferForm />
                </TransferProvider>
            </PageContainer>
        );
    }

    // console.log('=> Transfer - Loader shown');
    return (
        <PageContainer>
            <Loader />
        </PageContainer>
    );
};

export default Transfer;
