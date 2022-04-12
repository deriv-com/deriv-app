import React from 'react';
import { DesktopWizard } from '@deriv/ui';
import { localize } from '@deriv/translations';
import { AddAppStep, ChooseProductStep, SelectedApp } from 'Components/wizard-containers';
import CardsLink from 'Components/cards-link';

type StepData = Parameters<typeof DesktopWizard>[0]['steps'];

type AppWizardProps = {
    close: () => void;
};

const TempMainContent = () => <></>;

const AppWizard = ({ close }: AppWizardProps) => {
    const steps: StepData = [
        {
            step_title: localize('Product'),

            main_content: {
                component: ChooseProductStep,
                header: localize('Choose a product'),
                subheader: localize('Choose a product to start.'),
            },
            right_panel_content: {
                upper_block: () => <CardsLink is_linked={false} />,
            },
        },
        {
            step_title: localize('App'),
            main_content: {
                component: AddAppStep,
            },
            right_panel_content: {
                upper_block: SelectedApp,
            },
        },
        {
            step_title: localize('Password'),
            main_content: {
                component: TempMainContent,
                header: localize('Create a password'),
                subheader: localize('You can use this password for all your'),
            },
        },
        {
            step_title: localize('Wallet'),
            main_content: {
                component: TempMainContent,
            },
        },
        {
            step_title: localize('Currency'),
            main_content: {
                component: TempMainContent,
            },
        },
        {
            step_title: localize('Personal details'),
            main_content: {
                component: TempMainContent,
                header: localize('Personal details'),
                subheader: localize(
                    'Please provide your information for verification purposes. If you give us inaccurate information, you may be unable to make deposits or withdrawals.'
                ),
            },
        },
        {
            step_title: localize('Address'),
            main_content: {
                component: TempMainContent,
                header: localize('Address informatio'),
                subheader: localize(
                    'We need this for verification. If the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw.'
                ),
            },
        },
        {
            step_title: localize('Terms of use'),
            main_content: {
                component: TempMainContent,
                header: localize('Terms of use'),
            },
        },
        {
            step_title: localize('Complete'),
            main_content: {
                component: TempMainContent,
                header: localize('Completed'),
            },
        },
    ];

    return (
        <DesktopWizard
            steps={steps}
            onComplete={() => null}
            onClose={() => close()}
            wizard_title={localize("Let's get you a new app.")}
        />
    );
};

export default AppWizard;
