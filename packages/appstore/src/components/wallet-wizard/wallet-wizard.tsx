import React from 'react';
import { observer } from 'mobx-react-lite';
import { DesktopWizard, StepData } from '@deriv/ui';
import { localize } from '@deriv/translations';
import { PersonalDetailsStep, AddressDetailsStep, TermsOfUseStep, WalletStep } from 'Components/wizard-containers';
import SkeletonCard from 'Components/skeleton-card';
import WalletCard from 'Components/wallet';
import { useStores } from 'Stores';
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

const TempMainContent2 = ({ onSubmit }: any) => {
    React.useEffect(() => {
        onSubmit({});
    }, []);
    return <></>;
};

const WalletWizard = ({ close }: WalletWizardProps) => {
    const { create_wallet } = useStores();
    const { selected_wallet } = create_wallet;

    const steps: StepData[] = [
        {
            step_title: localize('Wallet'),
            main_content: { component: WalletStep, header: localize('Wallet') },
            right_panel_content: {
                upper_block: () => (
                    <div className='wallet-wizard-create-wallet-right-panel'>
                        {selected_wallet && <WalletCard size='large' wallet_name={selected_wallet} />}
                        {!selected_wallet && <SkeletonCard label='Choose a wallet' should_highlight />}
                    </div>
                ),
            },
        },
        {
            step_title: localize('Currency'),
            main_content: { component: TempMainContent2, header: localize("Choose your wallet's currency") },
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
        },
        {
            step_title: localize('Terms of use'),
            main_content: { component: TermsOfUseStep, header: localize('Terms of use') },
        },
        {
            step_title: localize('Complete'),
            main_content: { component: TempMainContent, header: localize('Completed') },
        },
    ];

    return (
        <div className='wallet-wizard'>
            <DesktopWizard
                steps={steps}
                onComplete={() => null}
                toggleWizard={() => close()}
                wizard_title={localize("Let's get you a new wallet.")}
            />
        </div>
    );
};

export default observer(WalletWizard);
