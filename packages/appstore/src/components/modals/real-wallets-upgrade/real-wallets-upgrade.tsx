import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, Button } from '@deriv/components';
import { useWalletMigration } from '@deriv/hooks';
import { ContentFlag } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { WalletsIntro } from './components/wallets-intro/wallets-intro';
import ReadyToUpgradeWallets from './components/ready-to-upgrade-wallets';
import './real-wallets-upgrade.scss';
import WalletLinkingStep from './wallet-linking-step/wallet-linking-step';
import getMockWalletMigrationResponse from '../../../constants/mock_wallet_migration_response';

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

    const handleNext = () => setCurrentStep(prev_step => prev_step + 1);

    const handleBack = () => setCurrentStep(prev_step => prev_step - 1);

    const handleClose = () => toggleWalletsUpgrade(false);

    const { start_migration } = useWalletMigration();

    const upgradeToWallets = () => {
        start_migration();
        toggleWalletsUpgrade(false);
    };

    const toggleCheckbox = React.useCallback(() => {
        setIsDisabled(prevDisabled => !prevDisabled);
    }, []);

    const DefaultFooter = React.useMemo(
        () => (
            <Modal.Footer className='wallet-steps__footer' has_separator>
                <Button secondary large className='wallet-steps__footer-button' onClick={handleBack}>
                    {localize('Back')}
                </Button>
                <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
                    {localize('Next')}
                </Button>
            </Modal.Footer>
        ),
        []
    );

    const InitialFooter = React.useMemo(
        () => (
            <Modal.Footer className='wallet-steps__footer' has_separator>
                <Button secondary large className='wallet-steps__footer-button' onClick={handleClose}>
                    {localize('Maybe later')}
                </Button>
                <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
                    {localize('Next')}
                </Button>
            </Modal.Footer>
        ),
        []
    );

    const EndFooter = React.useMemo(
        () => (
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
        ),
        [is_disabled]
    );

    //  TODO: Add the remaining wallet steps right here
    const WalletSteps = React.useMemo(
        () => [
            {
                name: 'intro_wallets',
                component: <WalletsIntro is_eu={is_eu} current_step={0} />,
                footer: InitialFooter,
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
                footer: EndFooter,
            },
        ],
        [is_eu, InitialFooter, EndFooter, toggleCheckbox]
    );

    const ModalContent = React.useMemo(
        () => WalletSteps[current_step]?.component || WalletSteps[0].component,
        [WalletSteps, current_step]
    );
    const ModalFooter = React.useMemo(
        () => WalletSteps[current_step]?.footer || DefaultFooter,
        [WalletSteps, current_step, DefaultFooter]
    );

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
                            <Modal.Body className='wallet-steps'>{ModalContent}</Modal.Body>
                            {ModalFooter}
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='modal_root'
                            visible={is_real_wallets_upgrade_on}
                            onClose={handleClose}
                            wrapper_classname='wallet-steps'
                            footer={ModalFooter}
                        >
                            <Modal.Body className='wallet-steps'>{ModalContent}</Modal.Body>
                        </MobileDialog>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
});

export default RealWalletsUpgrade;
