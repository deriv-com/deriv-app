import React, { useState } from 'react';
import { Tab, Tabs } from '@deriv-com/ui';
import { PageContainer } from '../../components';
import { PaymentAgentDepositModule } from '../../lib';
import { PaymentAgentWithdrawalContainer } from './components';
import styles from './PaymentAgent.module.scss';

type TPaymentAgentTabs = 'Deposit' | 'Withdrawal';

const PaymentAgent = () => {
    const queryParams = new URLSearchParams(location.search);
    const verificationQueryParam = queryParams.get('verification');
    const defaultTab: TPaymentAgentTabs = verificationQueryParam ? 'Withdrawal' : 'Deposit';

    const [activeTab, setActiveTab] = useState<TPaymentAgentTabs>(defaultTab);

    const onChangeTabHandler = (index: number) => {
        setActiveTab(index === 0 ? 'Deposit' : 'Withdrawal');
    };

    return (
        <PageContainer>
            <Tabs
                activeTab={activeTab}
                className={styles['tabs-container']}
                onChange={onChangeTabHandler}
                variant='secondary'
            >
                <Tab title='Deposit'>
                    <PaymentAgentDepositModule />
                </Tab>
                <Tab title='Withdrawal'>
                    <PaymentAgentWithdrawalContainer />
                </Tab>
            </Tabs>
        </PageContainer>
    );
};

export default PaymentAgent;
