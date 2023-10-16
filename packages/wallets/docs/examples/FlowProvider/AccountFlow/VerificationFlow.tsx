import React from 'react';
import { ModalStepWrapper } from '../../../../src/components/Base/ModalStepWrapper';
import { TFlowProviderContext, useFlow, FlowProvider } from '../../../../src/components/FlowProvider';
import { useModal } from '../../../../src/components/ModalProvider';
import { ModalWrapper } from '../../../../src/components/Base';

const PasswordScreen = () => {
    return (
        <div style={{ display: 'grid', placeItems: 'center', fontSize: 40, height: '100%', width: '100%' }}>
            Password Screen in Verification Flow
        </div>
    );
};

const ScreenB = () => {
    const { formValues, setFormValues } = useFlow();
    return (
        <div style={{ height: '30vh', padding: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h1>Screen X in Verification Flow</h1>
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

const SuccessModal = () => {
    return (
        <ModalWrapper>
            <div
                style={{
                    background: 'white',
                    width: '50vw',
                    height: '50vh',
                }}
            >
                <h1>SUCCESS MODAL!</h1>
            </div>
        </ModalWrapper>
    );
};

const screens = {
    passwordScreen: <PasswordScreen />,
    aScreen: <ScreenA />,
    bScreen: <ScreenB />,
};

const VerificationFlow = () => {
    const { show } = useModal();
    const nextFlowHandler = ({
        currentScreenId,
        switchNextScreen,
        switchScreen,
    }: TFlowProviderContext<typeof screens>) => {
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
            initialScreenId='passwordScreen'
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
