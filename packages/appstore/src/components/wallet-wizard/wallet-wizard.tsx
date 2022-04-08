import React from 'react';
import { observer } from 'mobx-react-lite';
import { DesktopWizard, StepData } from '@deriv/ui';
import { localize } from '@deriv/translations';
import {
    PersonalDetailsStep,
    AddressDetailsStep,
    TermsOfUseStep,
    WalletStep,
    WizardContext,
    SelectedWallet,
} from 'Components/wizard-containers';
import './wallet-wizard.scss';

type WalletWizardProps = {
    close: () => void;
};

// TODO: remove temp components
const TempMainContent = ({ onSubmit }: any) => {
    React.useEffect(() => {
        onSubmit({});
    }, []);
    return <></>;
};

const WalletWizard = ({ close }: WalletWizardProps) => {
    const right_panel_content = {
        upper_block: SelectedWallet,
    };
    const steps: StepData[] = [
        {
            step_title: localize('Wallet'),
            main_content: { component: WalletStep },
            right_panel_content,
        },
        {
            step_title: localize('Currency'),
            main_content: { component: TempMainContent, header: localize("Choose your wallet's currency") },
            right_panel_content,
        },
        {
            step_title: localize('Personal details'),
            main_content: {
                component: PersonalDetailsStep,
                header: localize('Personal details'),
                subheader: localize(
                    'Please provide your information for verification purposes. If you give us inaccurate information, you may be unable to make deposits or withdrawals.'
                ),
            },
            right_panel_content,
        },
        {
            step_title: localize('Address'),
            main_content: {
                component: AddressDetailsStep,
                header: localize('Address information'),
                subheader: localize(
                    'We need this for verification. If the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw.'
                ),
            },
            right_panel_content,
        },
        {
            step_title: localize('Terms of use'),
            main_content: { component: TermsOfUseStep, header: localize('Terms of use') },
            right_panel_content,
        },
        {
            step_title: localize('Complete'),
            main_content: { component: TempMainContent, header: localize('Completed') },
            right_panel_content,
        },
    ];

    return (
        <div className='wallet-wizard'>
            <WizardContext.Provider value={{}}>
                <DesktopWizard
                    steps={steps}
                    onComplete={() => null}
                    onClose={() => close()}
                    wizard_title={localize("Let's get you a new wallet.")}
                />
            </WizardContext.Provider>
        </div>
    );
};

export default observer(WalletWizard);
