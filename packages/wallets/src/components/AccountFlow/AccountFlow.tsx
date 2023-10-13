import React, { useEffect } from 'react';
import { WalletFlowProvider, WalletScreen } from '../Flow';
import { ModalStepWrapper } from '../ModalStepWrapper';
import { MT5AccountType } from '../ExternalTradingPlatforms';
import JurisdictionScreen from '../JurisdictionModal/JurisdictionScreen';
import { useFlow } from '../Flow/WalletFlowProvider';
import { useFlowSwitcher } from '../Flow/WalletFlowSwitcher';

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

const AccountFlow = ({ selectedMarketType }: { selectedMarketType: 'all' | 'financial' | 'synthetic' | undefined }) => {
    const { switchFlow } = useFlowSwitcher();
    const nextFlowHandler = ({ currentScreenId, switchScreen, switchNextScreen }) => {
        switch (currentScreenId) {
            case 'b_screen':
                switchFlow('verification_flow');
                break;
            default:
                switchNextScreen();
        }
    };

    return (
        <WalletFlowProvider
            initialScreenId='select_account_type_screen'
            initialValues={{
                testa: '',
                testb: '',
            }}
        >
            {context => {
                return (
                    <ModalStepWrapper
                        title='Account Flow'
                        renderFooter={() => (
                            <button onClick={() => nextFlowHandler(context)}>
                                {context.currentScreenId !== 'b_screen' ? 'Next' : 'Submit'}
                            </button>
                        )}
                    >
                        <WalletScreen
                            screenId='select_account_type_screen'
                            component={<MT5AccountType selectedMarketType={selectedMarketType} />}
                        />
                        <WalletScreen screenId='select_jurisdiction_screen' component={<JurisdictionScreen />} />
                        <WalletScreen screenId='password_screen' component={<PasswordScreen />} />
                        <WalletScreen screenId='a_screen' component={<ScreenA />} />
                        <WalletScreen screenId='b_screen' component={<ScreenB />} />
                    </ModalStepWrapper>
                );
            }}
        </WalletFlowProvider>
    );
};

export default AccountFlow;
