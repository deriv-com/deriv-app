import React from 'react';
import { WalletFlowProvider } from '../Flow';
import { ModalStepWrapper } from '../ModalStepWrapper';
import { useFlowSwitcher } from '../Flow/WalletFlowSwitcher';
import { TFlowProviderContext } from '../Flow/WalletFlowProvider';

const AccountFlow = ({ selectedMarketType }: { selectedMarketType: 'all' | 'financial' | 'synthetic' | undefined }) => {
    const { switchFlow } = useFlowSwitcher();
    const nextFlowHandler = ({ currentScreenId, switchScreen, switchNextScreen }: TFlowProviderContext) => {
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
                        {context.WalletScreen}
                    </ModalStepWrapper>
                );
            }}
        </WalletFlowProvider>
    );
};

export default AccountFlow;
