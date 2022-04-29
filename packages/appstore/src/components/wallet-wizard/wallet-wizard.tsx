import React from 'react';
import { observer } from 'mobx-react-lite';
import { DesktopWizard } from '@deriv/ui';
import { localize } from '@deriv/translations';
import {
    PersonalDetailsStep,
    AddressDetailsStep,
    TermsOfUseStep,
    WalletStep,
    SelectedWallet,
    CompletedStep,
} from 'Components/wizard-containers';
import WalletDescription from 'Components/wallet-description';
import './wallet-wizard.scss';

type WalletWizardProps = {
    close: () => void;
};

type CreateWalletState = {
    wallet_type?: string;
    [x: string]: any;
};

const WalletWizard = ({ close }: WalletWizardProps) => {
    const [create_wallet_state, setCreateWalletState] = React.useState<CreateWalletState>({});
    const [current_step_key, setCurrentStepKey] = React.useState<string>();

    const updateState = (new_state: Partial<CreateWalletState>) => {
        setCreateWalletState({ ...create_wallet_state, ...new_state });
    };

    const onChangeStep = (_current_step: number, _current_step_key?: string) => {
        setCurrentStepKey(_current_step_key);
    };

    const is_final_step = current_step_key === 'complete_step';

    const { wallet_type } = create_wallet_state;

    return (
        <div className='wallet-wizard'>
            <DesktopWizard
                onComplete={() => null}
                onClose={() => close()}
                wizard_title={localize("Let's get you a new wallet.")}
                lock_final_step
                primary_button_label={is_final_step ? 'Deposit' : 'Next'}
                secondary_button_label={is_final_step ? 'Maybe later' : 'Back'}
                onChangeStep={onChangeStep}
            >
                <DesktopWizard.Step title='Wallet' is_submit_disabled={!wallet_type}>
                    <WalletStep wallet_type={wallet_type} onSelect={type => updateState({ wallet_type: type })} />
                </DesktopWizard.Step>
                <DesktopWizard.Step title='Currency' is_disabled>
                    <div />
                </DesktopWizard.Step>
                <DesktopWizard.Step title='Personal details'>
                    <PersonalDetailsStep onUpdateState={updateState} />
                </DesktopWizard.Step>
                <DesktopWizard.Step title='Address details'>
                    <AddressDetailsStep onUpdateState={updateState} />
                </DesktopWizard.Step>
                <DesktopWizard.Step
                    title='Terms of use'
                    is_submit_disabled={!(create_wallet_state.agreed_tos && create_wallet_state.agreed_tnc)}
                >
                    <TermsOfUseStep onUpdateState={updateState} />
                </DesktopWizard.Step>
                <DesktopWizard.Step step_key='complete_step' title='Complete' is_fullwidth>
                    <CompletedStep selected_wallet={wallet_type as string} />
                </DesktopWizard.Step>
                <DesktopWizard.RightPanel>
                    <div className='wallet-wizard__right-panel'>
                        <SelectedWallet selected_wallet={wallet_type} />
                        <WalletDescription selected_wallet={wallet_type} />
                    </div>
                </DesktopWizard.RightPanel>
            </DesktopWizard>
        </div>
    );
};

export default observer(WalletWizard);
