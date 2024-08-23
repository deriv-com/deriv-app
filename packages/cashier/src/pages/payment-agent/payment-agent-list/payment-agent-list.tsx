import React from 'react';
import classNames from 'classnames';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import DepositTab from './deposit-tab';
import WithdrawalTab from './withdrawal-tab';
import { DepositSubPageAnalyticsEventTracker } from '../../../components/deposit-sub-page-analytics-event-tracker';
import { useCashierStore } from '../../../stores/useCashierStores';
import './payment-agent-list.scss';

const PaymentAgentList = observer(() => {
    const { payment_agent } = useCashierStore();

    const {
        common: { current_language },
    } = useStore();
    const { isDesktop } = useDevice();

    return (
        <div className='payment-agent-list cashier__wrapper--align-left'>
            <DepositSubPageAnalyticsEventTracker deposit_category='payment_agent' />
            <div
                className={classNames('payment-agent-list__instructions', {
                    'payment-agent-list__instructions-hide-tabs': payment_agent.is_try_withdraw_successful,
                })}
                key={current_language}
            >
                <Tabs
                    active_index={payment_agent.active_tab_index}
                    className='tabs--desktop'
                    onTabItemClick={payment_agent.setActiveTab}
                    top
                    header_fit_content={isDesktop}
                    center={false}
                    bottom={false}
                    active_icon_color={''}
                    background_color={''}
                    fit_content={false}
                    icon_color={''}
                    icon_size={0}
                    is_100vw={false}
                    is_full_width={false}
                    is_overflow_hidden={false}
                    is_scrollable={false}
                    should_update_hash={false}
                    single_tab_has_no_label={false}
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
});

export default PaymentAgentList;
