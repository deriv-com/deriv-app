import React from 'react';
import { Loader } from '@deriv-com/ui';
import { PaymentAgentTransferConfirm, PaymentAgentTransferForm, PaymentAgentTransferReceipt } from './components';
import { usePaymentAgentTransfer } from './hooks';

const PaymentAgentTransfer = () => {
    const {
        activeAccount,
        isLoading,
        isTransferRequestSubmitting,
        isTransferSuccessful,
        isTryTransferSuccessful,
        requestPaymentAgentTransfer,
        requestTryPaymentAgentTransfer,
        resetPaymentAgentTransfer,
        setIsTryTransferSuccessful,
        transferConfirm,
        transferReceipt,
        validationSchema,
    } = usePaymentAgentTransfer();

    if (isLoading) return <Loader />;

    if (isTryTransferSuccessful)
        return (
            <PaymentAgentTransferConfirm
                activeAccount={activeAccount}
                isTransferRequestSubmitting={isTransferRequestSubmitting}
                requestPaymentAgentTransfer={requestPaymentAgentTransfer}
                setIsTryTransferSuccessful={setIsTryTransferSuccessful}
                transferConfirm={transferConfirm}
            />
        );

    if (isTransferSuccessful)
        return (
            <PaymentAgentTransferReceipt
                activeAccount={activeAccount}
                resetPaymentAgentTransfer={resetPaymentAgentTransfer}
                transferReceipt={transferReceipt}
            />
        );

    return (
        <PaymentAgentTransferForm
            activeAccount={activeAccount}
            requestTryPaymentAgentTransfer={requestTryPaymentAgentTransfer}
            transferConfirm={transferConfirm}
            validationSchema={validationSchema}
        />
    );
};

export default PaymentAgentTransfer;
