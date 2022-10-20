import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';
import { useStore } from '@deriv/hooks';
import DepositTab from './deposit-tab';
import WithdrawalTab from './withdrawal-tab';
import './payment-agent-list.scss';
import SideNote from 'Components/side-note';
import PaymentAgentDisclaimer from '../payment-agent-disclaimer';

type TProps = {
    setSideNotes: (notes: JSX.Element[]) => void;
};

const PaymentAgentList = ({ setSideNotes }: TProps) => {
    const { modules } = useStore();
    const { payment_agent } = modules.cashier;

    React.useEffect(() => {
        const side_notes: JSX.Element[] = [];

        if (!payment_agent.is_try_withdraw_successful) {
            side_notes.push(
                <SideNote has_title={false} key={0}>
                    <PaymentAgentDisclaimer />
                </SideNote>
            );
        }

        setSideNotes(side_notes);
    }, [setSideNotes, payment_agent.is_try_withdraw_successful]);

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
};

export default observer(PaymentAgentList);
