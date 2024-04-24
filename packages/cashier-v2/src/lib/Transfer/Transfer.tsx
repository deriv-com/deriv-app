import React from 'react';
import { useAccountLimits, useActiveAccount, useCurrencyConfig } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { THooks } from '../../hooks/types';
import { TransferForm, TransferReceipt } from './components';
import { TransferProvider, useTransfer } from './provider';

type TTransferModuleProps = {
    accounts?: THooks.TransferAccounts;
};

const Transfer = () => {
    const { setTransferReceipt, transferReceipt } = useTransfer();

    if (transferReceipt) return <TransferReceipt {...transferReceipt} resetTransferReceipt={setTransferReceipt} />;

    return <TransferForm />;
};

const TransferModule: React.FC<TTransferModuleProps> = ({ accounts }) => {
    const { data: activeAccount } = useActiveAccount();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();
    const { data: accountLimits } = useAccountLimits();

    const isLoading = !accounts || !activeAccount || !accountLimits || isCurrencyConfigLoading;

    if (isLoading) return <Loader />;

    return (
        <TransferProvider
            accountLimits={accountLimits}
            accounts={accounts}
            activeAccount={activeAccount}
            getConfig={getConfig}
        >
            <Transfer />
        </TransferProvider>
    );
};

export default TransferModule;
