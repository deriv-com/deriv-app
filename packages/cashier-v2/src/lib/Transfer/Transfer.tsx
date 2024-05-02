import React from 'react';
import { useAccountLimits, useActiveAccount, useCurrencyConfig } from '@deriv/api-v2';
import { Loader, Text } from '@deriv-com/ui';
import { ErrorDialog } from '../../components';
import { THooks } from '../../hooks/types';
import { TransferForm, TransferReceipt } from './components';
import { TransferProvider, useTransfer } from './provider';

type TTransferModuleProps = {
    accounts?: THooks.TransferAccounts;
};

const Transfer = ({ showErrorsDialog }: { showErrorsDialog: boolean }) => {
    const { setTransferReceipt, transferError, transferReceipt } = useTransfer();

    if (transferReceipt) return <TransferReceipt {...transferReceipt} resetTransferReceipt={setTransferReceipt} />;

    return (
        <>
            <TransferForm />
            {/* showErrorsDialog checks if the module is used as an import from the cashier-v2 library */}
            {!showErrorsDialog && (
                <ErrorDialog isOpen={!!transferError}>
                    <Text as='p' size='sm'>
                        {transferError?.error.message}
                    </Text>
                </ErrorDialog>
            )}
        </>
    );
};

const TransferModule: React.FC<TTransferModuleProps> = ({ accounts }) => {
    const { data: activeAccount } = useActiveAccount();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();
    const { data: accountLimits, refetch } = useAccountLimits();

    const isLoading = !activeAccount || !accountLimits || isCurrencyConfigLoading;

    if (isLoading) return <Loader />;

    return (
        <TransferProvider
            accountLimits={accountLimits}
            accounts={accounts}
            activeAccount={activeAccount}
            getConfig={getConfig}
            refetchAccountLimits={refetch}
        >
            <Transfer showErrorsDialog={!accounts} />
        </TransferProvider>
    );
};

export default TransferModule;
