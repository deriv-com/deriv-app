import React from 'react';
import { WalletFlowSwitcher } from '../Flow';
import { useFlow } from '../Flow/WalletFlowProvider';
import AccountFlow from './AccountFlow';
import VerificationFlow from './VerificationFlow';
import { MT5AccountType } from '../ExternalTradingPlatforms';
import JurisdictionScreen from '../JurisdictionModal/JurisdictionScreen';

const PasswordScreen = () => {
    return (
        <div style={{ display: 'grid', placeItems: 'center', fontSize: 40, height: '100%', width: '100%' }}>
            Password Screen
        </div>
    );
};

const ScreenB = () => {
    const { formValues, setFormValues } = useFlow();
    return (
        <div style={{ height: '30vh', padding: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <input
                onChange={e => setFormValues('testb', e.target.value)}
                style={{ width: '100%', border: '1px solid black', padding: '4px' }}
                type='text'
                value={formValues.testb}
            />
            <input
                onChange={e => setFormValues('testa', e.target.value)}
                style={{ width: '100%', border: '1px solid black', padding: '4px' }}
                type='text'
                value={formValues.testa}
            />
        </div>
    );
};

const ScreenA = () => {
    const { formValues, setFormValues } = useFlow();

    return (
        <div style={{ height: '30vh', padding: '4px' }}>
            <input
                onChange={e => setFormValues('testa', e.target.value)}
                style={{ width: '100%', border: '1px solid black', padding: '4px' }}
                type='text'
                value={formValues.testa}
            />
        </div>
    );
};

const flowConfig = [
    {
        flowId: 'account_flow',
        component: <AccountFlow selectedMarketType='all' />,
        screens: [
            {
                screenId: 'select_account_type_screen',
                component: <MT5AccountType selectedMarketType={'all'} />,
            },
            {
                screenId: 'select_jurisdiction_screen',
                component: <JurisdictionScreen />,
            },
            {
                screenId: 'password_screen',
                component: <PasswordScreen />,
            },
            {
                screenId: 'a_screen',
                component: <ScreenA />,
            },
            {
                screenId: 'b_screen',
                component: <ScreenB />,
            },
        ],
    },
    // {
    //     flowId: 'verification_flow',
    //     component: <VerificationFlow />,
    //     screens: [
    //         {
    //             screenId: 'password_screen',
    //             component: <PasswordScreen />,
    //         },
    //         {
    //             screenId: 'a_screen',
    //             component: <ScreenA />,
    //         },
    //         {
    //             screenId: 'b_screen',
    //             component: <ScreenB />,
    //         },
    //     ],
    // },
];

const AccountVerificationFlows = ({
    selectedMarketType,
}: {
    selectedMarketType: 'all' | 'financial' | 'synthetic';
}) => {
    return <WalletFlowSwitcher initialFlowId='account_flow' flowConfig={flowConfig} />;
};

export default AccountVerificationFlows;
