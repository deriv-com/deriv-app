import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, Button } from '@deriv/components';
import { useWalletMigration } from '@deriv/hooks';
import { ContentFlag } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { WalletsIntro } from './components/wallets-intro/wallets-intro';
import getMockWalletMigrationResponse from 'Constants/mock_wallet_migration_response';
import ReadyToUpgradeWallets from './components/ready-to-upgrade-wallets';
import WalletLinkingStep from './wallet-linking-step/wallet-linking-step';
import './real-wallets-upgrade.scss';

type TDefaultFooter = {
    handleBack: () => void;
    handleNext: () => void;
};

type TInitialFooter = {
    handleClose: () => void;
    handleNext: () => void;
};

type TEndFooter = {
    handleBack: () => void;
    is_disabled: boolean;
    upgradeToWallets: (value: boolean) => void;
};

type TwalletSteps = {
    handleClose: () => void;
    handleNext: () => void;
    handleBack: () => void;
    toggleCheckbox: () => void;
    upgradeToWallets: (value: boolean) => void;
    is_eu: boolean;
    is_disabled: boolean;
};

type TModalContentFooter = TwalletSteps & {
    current_step: number;
};

const DefaultFooter = ({ handleBack, handleNext }: TDefaultFooter) => (
    <Modal.Footer className='wallet-steps__footer' has_separator>
        <Button secondary large className='wallet-steps__footer-button' onClick={handleBack}>
            {localize('Back')}
        </Button>
        <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
            {localize('Next')}
        </Button>
    </Modal.Footer>
);

const InitialFooter = ({ handleClose, handleNext }: TInitialFooter) => (
    <Modal.Footer className='wallet-steps__footer' has_separator>
        <Button secondary large className='wallet-steps__footer-button' onClick={handleClose}>
            {localize('Maybe later')}
        </Button>
        <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
            {localize('Next')}
        </Button>
    </Modal.Footer>
);

const EndFooter = ({ handleBack, is_disabled, upgradeToWallets }: TEndFooter) => (
    <Modal.Footer className='wallet-steps__footer' has_separator>
        <Button secondary large className='wallet-steps__footer-button' onClick={handleBack}>
            {localize('Back')}
        </Button>
        <Button
            primary
            large
            className='wallet-steps__footer-button'
            disabled={!is_disabled}
            onClick={upgradeToWallets}
        >
            {localize('Upgrade to Wallets')}
        </Button>
    </Modal.Footer>
);

//  TODO: Add the remaining wallet steps right here
const walletSteps = ({
    handleClose,
    handleNext,
    handleBack,
    toggleCheckbox,
    upgradeToWallets,
    is_eu,
    is_disabled,
}: TwalletSteps) => [
    {
        name: 'intro_wallets',
        component: <WalletsIntro is_eu={is_eu} current_step={0} />,
        footer: <InitialFooter handleClose={handleClose} handleNext={handleNext} />,
    },
    {
        name: 'intro_wallets',
        component: <WalletsIntro is_eu={is_eu} current_step={1} />,
    },
    {
        name: 'intro_wallets',
        component: <WalletsIntro is_eu={is_eu} current_step={2} />,
    },
    {
        component: <WalletLinkingStep data={getMockWalletMigrationResponse()[0]} />,
    },
    {
        component: <WalletLinkingStep data={getMockWalletMigrationResponse()[1]} />,
    },
    {
        component: <WalletLinkingStep data={getMockWalletMigrationResponse()[2]} />,
    },
    {
        name: 'ready_to_upgrade',
        component: <ReadyToUpgradeWallets is_eu={is_eu} value={is_disabled} toggleCheckbox={toggleCheckbox} />,
        footer: <EndFooter handleBack={handleBack} is_disabled={is_disabled} upgradeToWallets={upgradeToWallets} />,
    },
];

const ModalContent = ({
    handleClose,
    handleNext,
    handleBack,
    toggleCheckbox,
    upgradeToWallets,
    is_eu,
    is_disabled,
    current_step,
}: TModalContentFooter) => {
    const wallet_steps_array = walletSteps({
        handleClose,
        handleNext,
        handleBack,
        toggleCheckbox,
        upgradeToWallets,
        is_eu,
        is_disabled,
    });

    return wallet_steps_array?.[current_step]?.component || wallet_steps_array?.[0].component;
};

const ModalFooter = ({
    handleClose,
    handleNext,
    handleBack,
    toggleCheckbox,
    upgradeToWallets,
    is_eu,
    is_disabled,
    current_step,
}: TModalContentFooter) => {
    const wallet_steps_array = walletSteps({
        handleClose,
        handleNext,
        handleBack,
        toggleCheckbox,
        upgradeToWallets,
        is_eu,
        is_disabled,
    });
    return (
        wallet_steps_array?.[current_step]?.footer || <DefaultFooter handleBack={handleBack} handleNext={handleNext} />
    );
};

const RealWalletsUpgrade = observer(() => {
    const { traders_hub } = useStore();
    const { is_real_wallets_upgrade_on, toggleWalletsUpgrade, content_flag } = traders_hub;
    const is_eu = content_flag === ContentFlag.EU_REAL || content_flag === ContentFlag.EU_DEMO;

    const [current_step, setCurrentStep] = React.useState(0);
    const [is_disabled, setIsDisabled] = React.useState(false);

    React.useEffect(() => {
        if (!is_real_wallets_upgrade_on) {
            setCurrentStep(0);
            setIsDisabled(false);
        }
    }, [is_real_wallets_upgrade_on]);

    const handleNext = React.useCallback(() => setCurrentStep(prev_step => prev_step + 1), []);

    const handleBack = React.useCallback(() => setCurrentStep(prev_step => prev_step - 1), []);

    const handleClose = React.useCallback(() => toggleWalletsUpgrade(false), [toggleWalletsUpgrade]);

    const { start_migration } = useWalletMigration();

    const upgradeToWallets = React.useCallback(() => {
        start_migration();
        toggleWalletsUpgrade(false);
    }, [start_migration, toggleWalletsUpgrade]);

    const toggleCheckbox = React.useCallback(() => {
        setIsDisabled(prevDisabled => !prevDisabled);
    }, []);

    return (
        <React.Fragment>
            {is_real_wallets_upgrade_on && (
                <React.Fragment>
                    <DesktopWrapper>
                        <Modal
                            is_open={is_real_wallets_upgrade_on}
                            toggleModal={handleClose}
                            height='734px'
                            width='1200px'
                            should_header_stick_body={false}
                            has_close_icon
                            title=' '
                        >
                            <Modal.Body className='wallet-steps'>
                                <ModalContent
                                    handleClose={handleClose}
                                    handleNext={handleNext}
                                    handleBack={handleBack}
                                    toggleCheckbox={toggleCheckbox}
                                    upgradeToWallets={upgradeToWallets}
                                    is_eu={is_eu}
                                    is_disabled={is_disabled}
                                    current_step={current_step}
                                />
                            </Modal.Body>
                            <ModalFooter
                                handleClose={handleClose}
                                handleNext={handleNext}
                                handleBack={handleBack}
                                toggleCheckbox={toggleCheckbox}
                                upgradeToWallets={upgradeToWallets}
                                is_eu={is_eu}
                                is_disabled={is_disabled}
                                current_step={current_step}
                            />
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='modal_root'
                            visible={is_real_wallets_upgrade_on}
                            onClose={handleClose}
                            wrapper_classname='wallet-steps'
                            footer={
                                <ModalFooter
                                    handleClose={handleClose}
                                    handleNext={handleNext}
                                    handleBack={handleBack}
                                    toggleCheckbox={toggleCheckbox}
                                    upgradeToWallets={upgradeToWallets}
                                    is_eu={is_eu}
                                    is_disabled={is_disabled}
                                    current_step={current_step}
                                />
                            }
                        >
                            <Modal.Body className='wallet-steps'>
                                <ModalContent
                                    handleClose={handleClose}
                                    handleNext={handleNext}
                                    handleBack={handleBack}
                                    toggleCheckbox={toggleCheckbox}
                                    upgradeToWallets={upgradeToWallets}
                                    is_eu={is_eu}
                                    is_disabled={is_disabled}
                                    current_step={current_step}
                                />
                            </Modal.Body>
                        </MobileDialog>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
});

export default RealWalletsUpgrade;
