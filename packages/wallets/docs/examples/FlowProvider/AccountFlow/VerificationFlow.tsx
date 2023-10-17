import React from 'react';
import { ModalWrapper } from '../../../../src/components/Base';
import { ModalStepWrapper } from '../../../../src/components/Base/ModalStepWrapper';
import { FlowProvider, TFlowProviderContext, useFlow } from '../../../../src/components/FlowProvider';
import { useModal } from '../../../../src/components/ModalProvider';

const PasswordScreen = () => {
    return (
        <div style={{ display: 'grid', fontSize: 40, height: '100%', placeItems: 'center', width: '100%' }}>
            Password Screen in Verification Flow
        </div>
    );
};

const ScreenB = () => {
    const { formValues, setFormValues } = useFlow();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '30vh', padding: '4px' }}>
            <h1>Screen X in Verification Flow</h1>
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

const SuccessModal = () => {
    return (
        <ModalWrapper>
            <div
                style={{
                    background: 'white',
                    height: '50vh',
                    width: '50vw',
                }}
            >
                <h1>SUCCESS MODAL!</h1>
            </div>
        </ModalWrapper>
    );
};

const screens = {
    aScreen: <ScreenA />,
    bScreen: <ScreenB />,
    passwordScreen: <PasswordScreen />,
};

const VerificationFlow = () => {
    const { show } = useModal();
    const nextFlowHandler = ({ currentScreenId, switchNextScreen }: TFlowProviderContext<typeof screens>) => {
        switch (currentScreenId) {
            case 'bScreen':
                show(<SuccessModal />);
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
            screensOrder={['passwordScreen', 'aScreen', 'bScreen']}
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
                                {context.currentScreenId !== 'bScreen' ? 'Next' : 'Submit'}
                            </button>
                        )}
                        title='Verification Flow'
                    >
                        {context.WalletScreen}
                    </ModalStepWrapper>
                );
            }}
        </FlowProvider>
    );
};

export default VerificationFlow;
