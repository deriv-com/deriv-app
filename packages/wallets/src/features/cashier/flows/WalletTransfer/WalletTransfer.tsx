import React from 'react';
import { useTransferBetweenAccounts } from '@deriv/api-v2';
import { WalletLoader } from '../../../../components';
import { TransferModule } from '../../modules';
import { TransferNotAvailable } from '../../screens/TransferNotAvailable';

const WalletTransfer = () => {
    const { data, isLoading: isTransferAccountsLoading } = useTransferBetweenAccounts();

    if (isTransferAccountsLoading || !data?.accounts) return <WalletLoader />;

    return (
        <TransferNotAvailable accounts={data.accounts}>
            <TransferModule accounts={data.accounts} />
        </TransferNotAvailable>
    );
};

export default WalletTransfer;
