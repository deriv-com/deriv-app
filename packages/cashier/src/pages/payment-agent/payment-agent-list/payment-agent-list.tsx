import React from 'react';
import classNames from 'classnames';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import SideNote from '../../../components/side-note';
import { TSideNotesProps } from '../../../types';
import DepositTab from './deposit-tab';
import WithdrawalTab from './withdrawal-tab';
import MissingPaymentMethodNote from '../missing-payment-method-note';
import PaymentAgentDisclaimer from '../payment-agent-disclaimer';
import './payment-agent-list.scss';

type TProps = {
    setSideNotes?: (notes: TSideNotesProps) => void;
};

const PaymentAgentList = observer(({ setSideNotes }: TProps) => {
    const { modules } = useStore();
    const { payment_agent, general_store } = modules.cashier;

    React.useEffect(() => {
        if (!general_store.is_loading && !payment_agent.is_try_withdraw_successful) {
            setSideNotes?.([
                <SideNote has_title={false} key={0}>
                    <PaymentAgentDisclaimer />
                </SideNote>,
                <SideNote has_title={false} key={1}>
                    <MissingPaymentMethodNote />
                </SideNote>,
            ]);
        } else {
            setSideNotes?.([]);
        }
    }, [setSideNotes, general_store.is_loading, payment_agent.is_try_withdraw_successful]);

    return (
        <div className='payment-agent-list cashier__wrapper--align-left'>
            <div
                className={classNames('payment-agent-list__instructions', {
                    'payment-agent-list__instructions-hide-tabs': payment_agent.is_try_withdraw_successful,
                })}
            >
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
});

export default PaymentAgentList;
