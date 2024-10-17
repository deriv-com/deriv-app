import React from 'react';
import { Loading } from '@deriv/components';
import { useCashierLocked } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { useCashierStore } from '../../stores/useCashierStores';
import PaymentAgentList from './payment-agent-list';
import PageContainer from '../../components/page-container';
import CashierLocked from '../../components/cashier-locked';
import Virtual from '../../components/cashier-container/virtual';
import PaymentAgentSideNote from './payment-agent-side-note';

const PaymentAgent = observer(() => {
    const { isDesktop } = useDevice();
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
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <Loading className='cashier__loader' is_fullscreen={false} />
            </PageContainer>
        );
    }

    if (is_virtual) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <Virtual />
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

    return (
        <PageContainer hide_breadcrumb right={isDesktop ? <PaymentAgentSideNote /> : <React.Fragment />}>
            <PaymentAgentList />
        </PageContainer>
    );
});

export default PaymentAgent;
