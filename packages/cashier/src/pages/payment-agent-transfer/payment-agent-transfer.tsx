import React from 'react';
import { Loading } from '@deriv/components';
import { useCashierLocked } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { useCashierStore } from '../../stores/useCashierStores';
import PaymentAgentTransferForm from './payment-agent-transfer-form';
import PageContainer from '../../components/page-container';
import CashierLocked from '../../components/cashier-locked';
import Error from '../../components/error';
import NoBalance from '../../components/no-balance';
import Virtual from '../../components/cashier-container/virtual';
import PaymentAgentTransferConfirm from './payment-agent-transfer-confirm';
import PaymentAgentTransferReceipt from './payment-agent-transfer-receipt';

const PaymentAgentTransfer = observer(() => {
    const { client } = useStore();
    const { balance, is_virtual, is_switching } = client;
    const { general_store, payment_agent_transfer } = useCashierStore();
    const { is_loading } = general_store;
    const is_cashier_locked = useCashierLocked();
    const {
        error,
        is_transfer_successful,
        is_try_transfer_successful,
        onMountPaymentAgentTransfer: onMount,
        resetPaymentAgentTransfer: onUnMount,
    } = payment_agent_transfer;

    React.useEffect(() => {
        if (!is_virtual) {
            onMount();
        }
    }, [is_virtual, onMount]);

    React.useEffect(() => {
        return () => {
            onUnMount();
        };
    }, [onUnMount]);

    if (is_virtual) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <Virtual />
            </PageContainer>
        );
    }
    if (is_loading || is_switching) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <Loading className='cashier__loader' is_fullscreen={false} />
            </PageContainer>
        );
    }
    if (is_cashier_locked) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <CashierLocked />
            </PageContainer>
        );
    }
    if (error.is_show_full_page) {
        // for errors with CTA hide the form and show the error,
        // for others show them at the bottom of the form next to submit button
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <Error error={error} />
            </PageContainer>
        );
    }
    if (!Number(balance)) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <NoBalance />
            </PageContainer>
        );
    }
    if (is_try_transfer_successful) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <PaymentAgentTransferConfirm />
            </PageContainer>
        );
    }
    if (is_transfer_successful) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <PaymentAgentTransferReceipt />
            </PageContainer>
        );
    }
    return (
        <PageContainer hide_breadcrumb right={<React.Fragment />}>
            <PaymentAgentTransferForm error={error} />
        </PageContainer>
    );
});

export default PaymentAgentTransfer;
