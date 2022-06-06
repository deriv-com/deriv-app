import React from 'react';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/types';
import CashierLocked from 'Components/Error/cashier-locked.jsx';
import Error from 'Components/Error/error.jsx';
import NoBalance from 'Components/Error/no-balance.jsx';
import Virtual from 'Components/Error/virtual.jsx';
import PaymentAgentTransferConfirm from 'Components/Confirm/payment-agent-transfer-confirm';
import PaymentAgentTransferForm from 'Components/Form/payment-agent-transfer-form';
import PaymentAgentTransferReceipt from 'Components/Receipt/payment-agent-transfer-receipt';

type TPaymentAgentTransfer = {
    balance: string;
    container: string;
    error: {
        is_show_full_page: string;
    };
    is_cashier_locked: boolean;
    is_loading: boolean;
    is_transfer_successful: boolean;
    is_try_transfer_successful: boolean;
    is_virtual: boolean;
    onMount: () => void;
    onUnMount: () => void;
    setActiveTab: (container: string) => void;
};

const PaymentAgentTransfer = ({
    balance,
    container,
    error,
    is_cashier_locked,
    is_loading,
    is_transfer_successful,
    is_try_transfer_successful,
    is_virtual,
    onMount,
    onUnMount,
    setActiveTab,
}: TPaymentAgentTransfer) => {
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
};

export default connect(({ client, modules }: RootStore) => ({
    balance: client.balance,
    is_virtual: client.is_virtual,
    container: modules.cashier.payment_agent_transfer.container,
    error: modules.cashier.payment_agent_transfer.error,
    is_cashier_locked: modules.cashier.general_store.is_cashier_locked,
    is_loading: modules.cashier.general_store.is_loading,
    is_transfer_successful: modules.cashier.payment_agent_transfer.is_transfer_successful,
    is_try_transfer_successful: modules.cashier.payment_agent_transfer.is_try_transfer_successful,
    onMount: modules.cashier.payment_agent_transfer.onMountPaymentAgentTransfer,
    onUnMount: modules.cashier.payment_agent_transfer.resetPaymentAgentTransfer,
    setActiveTab: modules.cashier.general_store.setActiveTab,
}))(PaymentAgentTransfer);
