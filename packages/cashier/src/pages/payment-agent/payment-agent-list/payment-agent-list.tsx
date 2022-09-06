import React from 'react';
import { observer } from 'mobx-react-lite';
import { Loading, Tabs, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, isMobile, website_name } from '@deriv/shared';
import EmailVerificationEmptyState from 'Components/email-verification-empty-state';
import PaymentAgentDeposit from '../payment-agent-deposit';
import PaymentAgentWithdrawForm from '../payment-agent-withdraw-form';
import PaymentAgentWithdrawalLocked from '../payment-agent-withdrawal-locked';
import { useStore, useVerifyEmail } from '../../../hooks';
import './payment-agent-list.scss';

const PaymentAgentList = () => {
    const verify = useVerifyEmail('paymentagent_withdraw');
    const { client, modules } = useStore();
    const { general_store, payment_agent } = modules.cashier;
    const verification_code = client.verification_code.payment_agent_withdraw;

    React.useEffect(() => {
        payment_agent.onMountPaymentAgentList();
    }, [payment_agent]);

    React.useEffect(() => {
        if (payment_agent.active_tab_index && !verification_code) {
            verify.send();
        }
    }, [payment_agent.active_tab_index, verification_code, verify]);

    const DepositTab = () => (
        <div>
            {general_store.is_loading ? <Loading is_fullscreen={false} /> : <PaymentAgentDeposit />}
            <div className='payment-agent-list__disclaimer'>
                <Text size='xs' lh='s' weight='bold' className='cashier__text'>
                    <Localize i18n_default_text='DISCLAIMER' />
                </Text>
                :&nbsp;
                <Text size='xxs'>
                    <Localize
                        i18n_default_text='{{website_name}} is not affiliated with any Payment Agent. Customers deal with Payment Agents at their sole risk. Customers are advised to check the credentials of Payment Agents, and check the accuracy of any information about Payments Agents (on Deriv or elsewhere) before transferring funds.'
                        values={{ website_name }}
                    />
                </Text>
            </div>
        </div>
    );

    const WithdrawalTab = () => {
        if (verify.error && 'code' in verify.error) return <PaymentAgentWithdrawalLocked error={verify.error} />;
        if (verify.hasBeenSent) return <EmailVerificationEmptyState type={'paymentagent_withdraw'} />;
        if (verification_code || payment_agent.is_withdraw)
            return <PaymentAgentWithdrawForm verification_code={verification_code} />;

        return null;
    };

    return (
        <div className='cashier__wrapper--align-left cashier__wrapper-padding'>
            <Text as='p' align='center' line_height='s' size={isMobile() ? 'xxs' : 'xs'} className='cashier__paragraph'>
                <Localize i18n_default_text='Can’t find a suitable payment method for your country? Then try a payment agent.' />
            </Text>
            <div className='payment-agent-list__instructions'>
                <Tabs
                    active_index={payment_agent.active_tab_index}
                    className='tabs--desktop'
                    onTabItemClick={payment_agent.setActiveTab}
                    top
                    header_fit_content={isDesktop()}
                >
                    <div label={localize('Deposit')}>
                        <DepositTab />
                    </div>
                    <div label={localize('Withdrawal')}>
                        <WithdrawalTab />
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default observer(PaymentAgentList);
