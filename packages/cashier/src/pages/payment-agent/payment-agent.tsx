import React from 'react';
import { Loading } from '@deriv/components';
import { useCashierLocked } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import CashierLocked from 'Components/cashier-locked';
import { Virtual } from 'Components/cashier-container';
import PaymentAgentList from './payment-agent-list';
import { useCashierStore } from '../../stores/useCashierStores';
import { PageContainer } from '../../components/page-container';

type TPaymentAgent = {
    setSideNotes?: (notes: React.ReactNode[]) => void;
};

const PaymentAgent = observer(({ setSideNotes }: TPaymentAgent) => {
    const { client } = useStore();
    const {
        is_switching,
        is_virtual,
        verification_code: { payment_agent_withdraw: verification_code },
    } = client;
    const { payment_agent } = useCashierStore();
    const is_cashier_locked = useCashierLocked();
    const {
        is_withdraw: is_payment_agent_withdraw,
        active_tab_index: payment_agent_active_tab_index,
        setActiveTabIndex: setPaymentAgentActiveTabIndex,
    } = payment_agent;
    const initial_active_index =
        verification_code || is_payment_agent_withdraw || payment_agent_active_tab_index ? 1 : 0;

    setPaymentAgentActiveTabIndex(initial_active_index);

    React.useEffect(() => {
        return () => {
            setPaymentAgentActiveTabIndex(0);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (is_switching) {
        return (
            <PageContainer hide_breadcrumb>
                <Loading />
            </PageContainer>
        );
    }

    if (is_virtual) {
        return (
            <PageContainer hide_breadcrumb>
                <Virtual />
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

    return (
        <PageContainer hide_breadcrumb>
            <PaymentAgentList setSideNotes={setSideNotes} />
        </PageContainer>
    );
});

export default PaymentAgent;
