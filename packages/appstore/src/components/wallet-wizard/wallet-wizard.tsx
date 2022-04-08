import React from 'react';
import { observer } from 'mobx-react-lite';
import { DesktopWizard } from '@deriv/ui';
import { localize } from '@deriv/translations';
import PersonalDetails from 'Components/wizard-containers/personal-details';
import AddressDetails from 'Components/wizard-containers/address-details';
import TermsOfUse from 'Components/wizard-containers/terms-of-use';

import CreateWallet from 'Components/create-wallet';
import SkeletonCard from 'Components/skeleton-card';
import WalletCard from 'Components/wallet';
import { useStores } from 'Stores';
import './wallet-wizard.scss';

type StepData = Parameters<typeof DesktopWizard>[0]['steps'];
type MainComponentProps = {
    onSubmit: (
        values?: {
            [key: string]: unknown;
        },
        should_disable_next_step?: boolean
    ) => void;
};

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

const CreateWalletStep = ({ onSubmit }: MainComponentProps) => {
    const { create_wallet } = useStores();
    const { selected_wallet, setSelectedWallet } = create_wallet;
    const [should_show_fiat, setShouldShowFiat] = React.useState(false);

    const handleSubmit = (wallet: string) => {
        setSelectedWallet(wallet);
        onSubmit({ wallet }, true);
    };

    return (
        <CreateWallet
            dark={false}
            should_show_fiat={should_show_fiat}
            setShouldShowFiat={setShouldShowFiat}
            setSeletedWallet={handleSubmit}
            selected_wallet={selected_wallet}
        />
    );
};

const WalletWizard = ({ close }: WalletWizardProps) => {
    const { create_wallet } = useStores();
    const { selected_wallet } = create_wallet;

    const steps: StepData = [
        {
            step_title: localize('Wallet'),
            main_content_header: '',
            main_content: CreateWalletStep,
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
            main_content_header: localize("Choose your wallet's currency"),
            main_content: TempMainContent2,
        },
        {
            step_title: localize('Personal details'),
            main_content_header: localize('Personal details'),
            main_content_subheader: localize(
                'Please provide your information for verification purposes. If you give us inaccurate information, you may be unable to make deposits or withdrawals.'
            ),
            main_content: PersonalDetails,
        },
        {
            step_title: localize('Address'),
            main_content_header: localize('Address information'),
            main_content_subheader: localize(
                'We need this for verification. If the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw.'
            ),
            main_content: AddressDetails,
        },
        {
            step_title: localize('Terms of use'),
            main_content_header: localize('Terms of use'),
            main_content: TermsOfUse,
        },
        {
            step_title: localize('Complete'),
            main_content_header: localize('Completed'),
            main_content: TempMainContent,
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
