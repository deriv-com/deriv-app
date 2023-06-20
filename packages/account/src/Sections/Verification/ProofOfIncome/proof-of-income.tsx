import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { TCoreStore } from 'Stores/index';
import DemoMessage from 'Components/demo-message';
import ProofOfIncomeContainer from './proof-of-income-container';

type TProofOfIncome = {
    is_switching?: boolean;
    is_virtual?: boolean;
    refreshNotifications: () => void;
};
const ProofOfIncome = ({ is_virtual, is_switching, refreshNotifications }: TProofOfIncome) => {
    const { is_appstore } = React.useContext(PlatformContext);
    if (is_virtual) return <DemoMessage has_demo_icon={is_appstore} has_button />;

    return (
        <div className='account-poinc__main-container'>
            <ProofOfIncomeContainer is_switching={is_switching} refreshNotifications={refreshNotifications} />
        </div>
    );
};

export default connect(({ client, notifications }: TCoreStore) => ({
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: notifications.refreshNotifications,
}))(ProofOfIncome);
