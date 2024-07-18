import React from 'react';
import { ModalStepWrapper } from '../../../../src/components/Base/ModalStepWrapper';
import { FlowProvider, TFlowProviderContext, useFlow } from '../../../../src/components/FlowProvider';
import { useModal } from '../../../../src/components/ModalProvider';
import VerificationFlow from './VerificationFlow';

const PasswordScreen = () => {
    return (
        <div style={{ display: 'grid', fontSize: 40, height: '100%', placeItems: 'center', width: '100%' }}>
            Password Screen in Account Flow
        </div>
    );
};

const ScreenB = () => {
    const { formValues, setFormValues } = useFlow();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '30vh', padding: '4px' }}>
            <h1>Screen B</h1>
            <input
                onChange={e => setFormValues('testb', e.target.value)}
                style={{ border: '1px solid black', padding: '4px', width: '100%' }}
                type='text'
                value={formValues.testb}
            />
            <input
                onChange={e => setFormValues('testa', e.target.value)}
                style={{ border: '1px solid black', padding: '4px', width: '100%' }}
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
                style={{ border: '1px solid black', padding: '4px', width: '100%' }}
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
    aScreen: <ScreenA />,
    bScreen: <ScreenB />,
    JurisdictionScreen: <JurisdictionScreen />,
    passwordScreen: <PasswordScreen />,
};

const AccountFlow = () => {
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
            initialValues={{
                testa: '',
                testb: '',
            }}
            screens={screens}
            screensOrder={['JurisdictionScreen', 'passwordScreen', 'aScreen', 'bScreen']}
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
