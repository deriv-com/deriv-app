import React from 'react';
import { WalletFlowProvider } from '../Flow';
import { ModalStepWrapper } from '../../components/Base/ModalStepWrapper';
import { useFlowSwitcher } from '../Flow/WalletFlowSwitcher';
import { TFlowProviderContext, useFlow } from '../Flow/WalletFlowProvider';
import { MT5AccountType } from '../../features/cfd/screens/MT5AccountType';
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

const screens = {
    selectAccountTypeScreen: <MT5AccountType selectedMarketType='all' />,
    JurisdictionScreen: <JurisdictionScreen />,
    passwordScreen: <PasswordScreen />,
    aScreen: <ScreenA />,
    bScreen: <ScreenB />,
};

const AccountFlow = ({ selectedMarketType }: { selectedMarketType: 'all' | 'financial' | 'synthetic' | undefined }) => {
    const { switchFlow } = useFlowSwitcher();
    const nextFlowHandler = ({ currentScreenId, switchScreen, switchNextScreen }) => {
        switch (currentScreenId) {
            case 'bScreen':
                switchFlow('accountFlow');
                break;
            default:
                switchNextScreen();
        }
    };

    return (
        <WalletFlowProvider
            initialScreenId='selectAccountTypeScreen'
            initialValues={{
                testa: '',
                testb: '',
            }}
            screens={screens}
        >
            {context => {
                return (
                    <ModalStepWrapper
                        title='Account Flow'
                        renderFooter={() => (
                            <button
                                onClick={() => {
                                    nextFlowHandler(context);
                                }}
                            >
                                {context.currentScreenId !== 'JurisdictionScreen' ? 'Next' : 'Submit'}
                            </button>
                        )}
                    >
                        {context.WalletScreen}
                    </ModalStepWrapper>
                );
            }}
        </WalletFlowProvider>
    );
};

export default AccountFlow;
