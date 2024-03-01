import React, { useCallback, useEffect } from 'react';
import { useTransferBetweenAccounts } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import { CashierLocked, TransferModule } from '../../modules';
import { TransferNotAvailable } from '../../screens/TransferNotAvailable';

const WalletTransfer = () => {
    const { data, isLoading: isTransferAccountsLoading, mutate } = useTransferBetweenAccounts();

    const requestTransferAccounts = useCallback(() => mutate({ accounts: 'all' }), [mutate]);

    useEffect(() => {
        requestTransferAccounts();
    }, [requestTransferAccounts]);

    if (isTransferAccountsLoading || !data?.accounts) return <Loader />;

    return (
        <CashierLocked>
            <TransferNotAvailable accounts={data.accounts}>
                <TransferModule accounts={data.accounts} />
            </TransferNotAvailable>
        </CashierLocked>
    );
};

export default WalletTransfer;
