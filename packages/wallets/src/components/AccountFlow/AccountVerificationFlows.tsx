import React from 'react';
import { WalletFlowSwitcher, WalletFlow } from '../Flow';
import AccountFlow from './AccountFlow';
import VerificationFlow from './VerificationFlow';

const AccountVerificationFlows = ({
    selectedMarketType,
}: {
    selectedMarketType: 'all' | 'financial' | 'synthetic';
}) => {
    return (
        <WalletFlowSwitcher initialFlowId='account_flow'>
            <WalletFlow flowId='account_flow' component={<AccountFlow selectedMarketType={selectedMarketType} />} />
            <WalletFlow flowId='verification_flow' component={<VerificationFlow />} />
        </WalletFlowSwitcher>
    );
};

const flowConfig = [
    {
        id: 'account_verification_Flow',
        children: [
            {
                id: 'account_flow',
                component: <AccountFlow selectedMarketType={selectedMarketType} />,
            },
            {
                id: 'verification_flow',
                component: <VerificationFlow />,
            },
        ],
    },
];

export default AccountVerificationFlows;
