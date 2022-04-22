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

// const right_panel_content = {
//     upper_block: SelectedWallet,
//     middle_block: WalletDescription,
// };
// const steps: StepData[] = [
//     {
//         step_title: localize('Wallet'),
//         main_content: { component: WalletStep },
//         right_panel_content,
//     },
//     {
//         step_title: localize('Currency'),
//         main_content: { component: TempMainContent, header: localize("Choose your wallet's currency") },
//         right_panel_content,
//     },
//     {
//         step_title: localize('Personal details'),
//         main_content: {
//             component: PersonalDetailsStep,
//             header: localize('Personal details'),
//             subheader: localize(
//                 'Please provide your information for verification purposes. If you give us inaccurate information, you may be unable to make deposits or withdrawals.'
//             ),
//         },
//         right_panel_content,
//     },
//     {
//         step_title: localize('Address'),
//         main_content: {
//             component: AddressDetailsStep,
//             header: localize('Address information'),
//             subheader: localize(
//                 'We need this for verification. If the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw.'
//             ),
//         },
//         right_panel_content,
//     },
//     {
//         step_title: localize('Terms of use'),
//         main_content: { component: TermsOfUseStep, header: localize('Terms of use') },
//         right_panel_content,
//     },
//     {
//         step_title: localize('Complete'),
//         main_content: { component: CompletedStep, header: localize('Completed') },
//         is_fullwidth: true,
//         submit_button_name: localize('Link with an app'),
//         cancel_button_name: localize('I understand'),
//     },
// ];

type CreateWalletState = {
    selected_wallet?: string;
    [x: string]: any;
};

const WalletWizard = ({ close }: WalletWizardProps) => {
    const [create_wallet_state, setCreateWalletState] = React.useState<CreateWalletState>({});

    const updateState = (new_state: Partial<CreateWalletState>) => {
        setCreateWalletState({ ...create_wallet_state, ...new_state });
    };

    return (
        <div className='wallet-wizard'>
            <DesktopWizard
                onComplete={() => null}
                onClose={() => close()}
                wizard_title={localize("Let's get you a new wallet.")}
            >
                <DesktopWizard.Step>
                    <WalletStep
                        selected_wallet={create_wallet_state.wallet}
                        onSelect={wallet => updateState({ wallet })}
                    />
                </DesktopWizard.Step>
                <DesktopWizard.RightPanel>
                    <SelectedWallet />
                    <WalletDescription />
                </DesktopWizard.RightPanel>
            </DesktopWizard>
        </div>
    );
};

export default observer(WalletWizard);
