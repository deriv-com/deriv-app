import React from 'react';
import { ModalStepWrapper } from '../../../../src/components/Base/ModalStepWrapper';
import { TFlowProviderContext, useFlow, FlowProvider } from '../../../../src/components/FlowProvider';
import { MT5AccountType } from '../../../../src/features/cfd/screens/MT5AccountType';
import VerificationFlow from './VerificationFlow';
import { useModal } from '../../../../src/components/ModalProvider';

const PasswordScreen = () => {
    return (
        <div style={{ display: 'grid', placeItems: 'center', fontSize: 40, height: '100%', width: '100%' }}>
            Password Screen in Account Flow
        </div>
    );
};

const ScreenB = () => {
    const { formValues, setFormValues } = useFlow();
    return (
        <div style={{ height: '30vh', padding: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h1>Screen B</h1>
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

const JurisdictionScreen = () => {
    return (
        <div>
            <h1>Jurisdiction Screen</h1>
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
    const { show } = useModal();
    const nextFlowHandler = ({
        currentScreenId,
        switchNextScreen,
        switchScreen,
    }: TFlowProviderContext<typeof screens>) => {
        switch (currentScreenId) {
            case 'bScreen':
                show(<VerificationFlow />);
                break;
            case 'passwordScreen':
                switchScreen('bScreen');
                break;
            default:
                switchNextScreen();
        }
    };

    return (
        <FlowProvider
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
                        renderFooter={() => (
                            <button
                                onClick={() => {
                                    nextFlowHandler(context);
                                }}
                            >
                                {context.currentScreenId !== 'JurisdictionScreen' ? 'Next' : 'Submit'}
                            </button>
                        )}
                        title='Account Flow'
                    >
                        {context.WalletScreen}
                    </ModalStepWrapper>
                );
            }}
        </FlowProvider>
    );
};

export default AccountFlow;
