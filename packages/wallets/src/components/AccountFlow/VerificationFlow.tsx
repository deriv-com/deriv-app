import React from 'react';
import { WalletFlowProvider, WalletScreen } from '../Flow';
import { ModalStepWrapper } from '../ModalStepWrapper';
import { useFlow } from '../Flow/WalletFlowProvider';
import { useModal } from '../ModalProvider';

const PasswordScreen = () => {
    return (
        <div style={{ display: 'grid', placeItems: 'center', fontSize: 40, height: '100%', width: '100%' }}>
            New Flow
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

const VerificationFlow = () => {
    const { hide } = useModal();
    const nextFlowHandler = ({ currentScreenId, switchScreen, switchNextScreen }) => {
        switch (currentScreenId) {
            case 'b_screen':
                hide();
                break;
            default:
                switchNextScreen();
        }
    };

    return (
        <WalletFlowProvider
            initialScreenId='new_flow_screen'
            initialValues={{
                testa: '',
                testb: '',
            }}
        >
            {context => {
                return (
                    <ModalStepWrapper
                        title='Verification Flow'
                        renderFooter={() => (
                            <button onClick={() => nextFlowHandler(context)}>
                                {context.currentScreenId !== 'password_screen' ? 'Next' : 'Submit'}
                            </button>
                        )}
                    >
                        <WalletScreen screenId='new_flow_screen' component={<PasswordScreen />} />
                        <WalletScreen screenId='a_screen' component={<ScreenA />} />
                        <WalletScreen screenId='b_screen' component={<ScreenB />} />
                    </ModalStepWrapper>
                );
            }}
        </WalletFlowProvider>
    );
};

export default VerificationFlow;
