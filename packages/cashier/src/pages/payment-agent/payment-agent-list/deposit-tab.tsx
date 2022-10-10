import React from 'react';
import { observer } from 'mobx-react-lite';
import { Loading, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { website_name } from '@deriv/shared';
import PaymentAgentDeposit from '../payment-agent-deposit';
import { useStore } from '../../../hooks';

const DepositTab = () => {
    const { modules } = useStore();
    const { payment_agent, general_store } = modules.cashier;

    React.useEffect(() => {
        payment_agent.onMountPaymentAgentList();
    }, [payment_agent]);

    return (
        <div>
            {general_store.is_loading ? <Loading is_fullscreen={false} /> : <PaymentAgentDeposit />}
            <div className='payment-agent-list__disclaimer'>
                <Text size='xs' lh='s' weight='bold' className='cashier__text'>
                    <Localize i18n_default_text='DISCLAIMER' />
                </Text>
                {': '}
                <Text size='xxs'>
                    <Localize
                        i18n_default_text='{{website_name}} is not affiliated with any Payment Agent. Customers deal with Payment Agents at their sole risk. Customers are advised to check the credentials of Payment Agents, and check the accuracy of any information about Payments Agents (on Deriv or elsewhere) before transferring funds.'
                        values={{ website_name }}
                    />
                </Text>
            </div>
        </div>
    );
};

export default observer(DepositTab);
