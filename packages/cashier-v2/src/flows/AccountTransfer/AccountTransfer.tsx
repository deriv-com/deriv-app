import React, { useCallback, useEffect } from 'react';
import { useTransferBetweenAccounts } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { PageContainer } from '../../components';
import { TransferModule } from '../../lib';
import { TransferNoAccount } from './screens';

const AccountTransfer = () => {
    const { data: transferAccounts, mutate } = useTransferBetweenAccounts();
    const requestForAccounts = useCallback(() => mutate({ accounts: 'all' }), [mutate]);

    useEffect(() => {
        requestForAccounts();
    }, [requestForAccounts]);

    if (!transferAccounts?.accounts)
        return (
            <PageContainer>
                <Loader />
            </PageContainer>
        );

    return (
        <PageContainer>
            <TransferNoAccount accounts={transferAccounts.accounts}>
                <TransferModule accounts={transferAccounts.accounts} />
            </TransferNoAccount>
        </PageContainer>
    );
};

export default AccountTransfer;
