import React from 'react';
import { THooks } from 'src/hooks/types';
import { useActiveAccount, useCurrencyConfig } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { TransferForm } from './components';
import { TransferProvider } from './provider';

type TTransferModuleProps = {
    accounts: THooks.TransferAccounts;
};

const Transfer = () => {
    return <TransferForm />;
};

const TransferModule: React.FC<TTransferModuleProps> = ({ accounts }) => {
    const { data: activeAccount } = useActiveAccount();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const isLoading = !accounts || !activeAccount || isCurrencyConfigLoading;

    if (isLoading) return <Loader />;

    return (
        <TransferProvider accounts={accounts} activeAccount={activeAccount} getConfig={getConfig}>
            <Transfer />
        </TransferProvider>
    );
};

export default TransferModule;
