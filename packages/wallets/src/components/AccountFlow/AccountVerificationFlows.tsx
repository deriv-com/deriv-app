import React from 'react';
import { WalletFlowSwitcher } from '../Flow';
import { useFlow } from '../Flow/WalletFlowProvider';
import AccountFlow from './AccountFlow';
import VerificationFlow from './VerificationFlow';

// const flowConfig = [
//     {
//         flowId: 'account_flow',
//         component: <AccountFlow selectedMarketType='all' />,
//     },
//     // {
//     //     flowId: 'verification_flow',
//     //     component: <VerificationFlow />,
//     //     screens: [
//     //         {
//     //             screenId: 'password_screen',
//     //             component: <PasswordScreen />,
//     //         },
//     //         {
//     //             screenId: 'a_screen',
//     //             component: <ScreenA />,
//     //         },
//     //         {
//     //             screenId: 'b_screen',
//     //             component: <ScreenB />,
//     //         },
//     //     ],
//     // },
// ];

const flows = {
    accountFlow: <AccountFlow selectedMarketType='all' />,
};

const AccountVerificationFlows = ({
    selectedMarketType,
}: {
    selectedMarketType: 'all' | 'financial' | 'synthetic';
}) => {
    return <WalletFlowSwitcher initialFlowId='accountFlow' flows={flows} />;
};

export default AccountVerificationFlows;
