import React from 'react';
import { observer } from 'mobx-react-lite';
import { Tabs, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, isMobile } from '@deriv/shared';
import { useStore } from '@deriv/hooks';
import DepositTab from './deposit-tab';
import WithdrawalTab from './withdrawal-tab';
import './payment-agent-list.scss';

const PaymentAgentList = () => {
    const { modules } = useStore();
    const { payment_agent } = modules.cashier;

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
