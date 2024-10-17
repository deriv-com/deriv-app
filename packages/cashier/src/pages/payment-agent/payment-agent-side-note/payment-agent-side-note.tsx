import React from 'react';
import { SideNote } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useCashierStore } from '../../../stores/useCashierStores';
import MissingPaymentMethodNote from './missing-payment-method-note';
import PaymentAgentDisclaimer from './payment-agent-disclaimer';

const PaymentAgentSideNote = observer(() => {
    const { payment_agent } = useCashierStore();
    const { is_withdraw_successful, is_try_withdraw_successful } = payment_agent;

    if (is_withdraw_successful || is_try_withdraw_successful) {
        return (
            <React.Fragment>
                <SideNote key={0}>
                    <PaymentAgentDisclaimer />
                </SideNote>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <SideNote key={0}>
                <PaymentAgentDisclaimer />
            </SideNote>
            <SideNote key={1}>
                <MissingPaymentMethodNote />
            </SideNote>
        </React.Fragment>
    );
});

export default PaymentAgentSideNote;
