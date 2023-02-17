import React from 'react';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import CashierLocked from 'Components/cashier-locked';
import Error from 'Components/error';
import NoBalance from 'Components/no-balance';
import { Virtual } from 'Components/cashier-container';
import PaymentAgentTransferConfirm from './payment-agent-transfer-confirm';
import PaymentAgentTransferForm from './payment-agent-transfer-form';
import PaymentAgentTransferReceipt from './payment-agent-transfer-receipt';
import { useCashierStore } from '../../stores/useCashierStores';

const PaymentAgentTransfer = observer(() => {
    const { client } = useStore();
    const { balance, is_virtual } = client;
    const { general_store, payment_agent_transfer } = useCashierStore();
    const { is_cashier_locked, is_loading, setActiveTab } = general_store;
    const {
        container,
        error,
        is_transfer_successful,
        is_try_transfer_successful,
        onMountPaymentAgentTransfer: onMount,
        resetPaymentAgentTransfer: onUnMount,
    } = payment_agent_transfer;

    React.useEffect(() => {
        setActiveTab(container);
        if (!is_virtual) {
            onMount();
        }
    }, [container, is_virtual, onMount, setActiveTab]);

    React.useEffect(() => {
        return () => {
            onUnMount();
        };
    }, [onUnMount]);

    if (is_virtual) {
        return <Virtual />;
    }
    if (is_loading) {
        return <Loading className='cashier__loader' />;
    }
    if (is_cashier_locked) {
        return <CashierLocked />;
    }
    if (error.is_show_full_page) {
        // for errors with CTA hide the form and show the error,
        // for others show them at the bottom of the form next to submit button
        return <Error error={error} />;
    }
    if (!+balance) {
        return <NoBalance />;
    }
    if (is_try_transfer_successful) {
        return <PaymentAgentTransferConfirm />;
    }
    if (is_transfer_successful) {
        return <PaymentAgentTransferReceipt />;
    }
    return <PaymentAgentTransferForm error={error} />;
});

export default PaymentAgentTransfer;
