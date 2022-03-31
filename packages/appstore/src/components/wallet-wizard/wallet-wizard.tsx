import React from 'react';
import { DesktopWizard } from '@deriv/ui';
import { localize } from '@deriv/translations';
import './wallet-wizard.scss';

type StepData = Parameters<typeof DesktopWizard>[0]['steps'];

type WalletWizardProps = {
    close: () => void;
};

const TempMainContent = () => <></>;

const WalletWizard = ({ close }: WalletWizardProps) => {
    const steps: StepData = [
        {
            step_title: localize('Wallet'),
            main_content_header: localize('Create a wallet'),
            main_content_subheader: localize('Create a wallet that can be link to your choosen app.'),
            main_content: TempMainContent,
        },
        {
            step_title: localize('Currency'),
            main_content_header: localize("Choose your wallet's currency"),
            main_content: TempMainContent,
        },
        {
            step_title: localize('Personal details'),
            main_content_header: localize('Personal details'),
            main_content_subheader: localize(
                'Please provide your information for verification purposes. If you give us inaccurate information, you may be unable to make deposits or withdrawals.'
            ),
            main_content: TempMainContent,
        },
        {
            step_title: localize('Address'),
            main_content_header: localize('Address information'),
            main_content_subheader: localize(
                'We need this for verification. If the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw.'
            ),
            main_content: TempMainContent,
        },
        {
            step_title: localize('Terms of use'),
            main_content_header: localize('Terms of use'),
            main_content: TempMainContent,
        },
        {
            step_title: localize('Complete'),
            main_content_header: localize('Completed'),
            main_content: TempMainContent,
        },
    ];

    return (
        <DesktopWizard
            steps={steps}
            onComplete={() => null}
            toggleWizard={() => close()}
            wizard_title={localize("Let's get you a new wallet.")}
        />
    );
};

export default WalletWizard;
