import React, { useCallback, useEffect } from 'react';
import { useTransferBetweenAccounts } from '@deriv/api';
import { Loader } from '../../../../components';
import { TransferModule } from '../../modules';
import { TransferNotAvailable } from '../../screens/TransferNotAvailable';

const WalletTransfer = () => {
    const { data, isLoading: isTransferAccountsLoading, mutate } = useTransferBetweenAccounts();

    const requestTransferAccounts = useCallback(() => mutate({ accounts: 'all' }), [mutate]);

    useEffect(() => {
        requestTransferAccounts();
    }, [requestTransferAccounts]);

    if (isTransferAccountsLoading || !data?.accounts) return <Loader />;

    return (
        <TransferNotAvailable accounts={data.accounts}>
            <TransferModule accounts={data.accounts} />
        </TransferNotAvailable>
    );
};

export default WalletTransfer;
