import React from 'react';
import { observer, useStore } from '@deriv/stores';
import DemoMessage from 'Components/demo-message';
import ProofOfIncomeContainer from './proof-of-income-container';

const ProofOfIncome = observer(() => {
    const { client, notifications } = useStore();
    const { is_switching, is_virtual } = client;
    const { refreshNotifications } = notifications;

    if (is_virtual) return <DemoMessage has_button />;

    return (
        <div className='proof-of-income'>
            <ProofOfIncomeContainer is_switching={is_switching} refreshNotifications={refreshNotifications} />
        </div>
    );
});

export default ProofOfIncome;
