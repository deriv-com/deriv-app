import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import DemoMessage from 'Components/demo-message';
import ProofOfIncomeContainer from './proof-of-income-container';

const ProofOfIncome = observer(() => {
    const { is_appstore } = React.useContext(PlatformContext);
    const { client, notifications } = useStore();
    const { is_switching, is_virtual } = client;
    const { refreshNotifications } = notifications;

    if (is_virtual) return <DemoMessage has_demo_icon={is_appstore} has_button />;

    return (
        <div className='account-poinc__main-container'>
            <ProofOfIncomeContainer is_switching={is_switching} refreshNotifications={refreshNotifications} />
        </div>
    );
});

export default ProofOfIncome;
