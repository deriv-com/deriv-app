import React from 'react';
import { Loading } from '@deriv/components';
import { useCashierLocked } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import CashierLocked from 'Components/cashier-locked';
import Error from 'Components/error';
import NoBalance from 'Components/no-balance';
import { Virtual } from 'Components/cashier-container';
import PaymentAgentTransferConfirm from './payment-agent-transfer-confirm';
import PaymentAgentTransferForm from './payment-agent-transfer-form';
import PaymentAgentTransferReceipt from './payment-agent-transfer-receipt';
import { useCashierStore } from '../../stores/useCashierStores';

const PageContainer = React.lazy(
    () => import(/* webpackChunkName: "page-container" */ 'Components/page-container/page-container')
);

const PaymentAgentTransfer = observer(() => {
    const { client } = useStore();
    const { balance, is_virtual } = client;
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
            <PageContainer hide_breadcrumb>
                <Virtual />
            </PageContainer>
        );
    }
    if (is_loading) {
        return (
            <PageContainer hide_breadcrumb>
                <Loading className='cashier__loader' />
            </PageContainer>
        );
    }
    if (is_cashier_locked) {
        return (
            <PageContainer hide_breadcrumb>
                <CashierLocked />
            </PageContainer>
        );
    }
    if (error.is_show_full_page) {
        // for errors with CTA hide the form and show the error,
        // for others show them at the bottom of the form next to submit button
        return (
            <PageContainer hide_breadcrumb>
                <Error error={error} />
            </PageContainer>
        );
    }
    if (!Number(balance)) {
        return (
            <PageContainer hide_breadcrumb>
                <NoBalance />
            </PageContainer>
        );
    }
    if (is_try_transfer_successful) {
        return (
            <PageContainer hide_breadcrumb>
                <PaymentAgentTransferConfirm />
            </PageContainer>
        );
    }
    if (is_transfer_successful) {
        return (
            <PageContainer hide_breadcrumb>
                <PaymentAgentTransferReceipt />
            </PageContainer>
        );
    }
    return (
        <PageContainer hide_breadcrumb>
            <PaymentAgentTransferForm error={error} />
        </PageContainer>
    );
});

export default PaymentAgentTransfer;
