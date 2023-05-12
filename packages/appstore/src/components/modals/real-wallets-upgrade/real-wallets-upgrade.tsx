import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, Button } from '@deriv/components';
import { ContentFlag } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { WalletsIntro } from './components/wallets-intro/wallets-intro';
import ReadyToUpgradeWallets from './components/ready-to-update-wallets';
import './real-wallets-upgrade.scss';

const RealWalletsUpgrade = observer(() => {
    const { traders_hub } = useStore();
    const { is_real_wallets_upgrade_on, toggleWalletsUpgrade, content_flag } = traders_hub;
    const is_eu = content_flag === ContentFlag.EU_REAL || content_flag === ContentFlag.EU_DEMO;

    const [current_step, setCurrentStep] = React.useState(0);
    const [is_disabled, setIsDisabled] = React.useState(false);

    React.useEffect(() => {
        if (!is_real_wallets_upgrade_on) {
            setCurrentStep(0);
        }
    }, [is_real_wallets_upgrade_on]);

    React.useEffect(() => {
        setIsDisabled(false);
    }, [is_real_wallets_upgrade_on]);

    const handleNext = () => {
        setCurrentStep(current_step + 1);
    };
    const handleBack = () => {
        setCurrentStep(current_step - 1);
    };

    const handleClose = () => {
        toggleWalletsUpgrade(false);
    };

    const toggleCheckbox = () => {
        setIsDisabled(!is_disabled);
    };

    // Footer buttons right here fellas (͠≖ ͜ʖ͠≖)👌
    const DefaultFooter = (
        <Modal.Footer className='wallet-steps__footer' has_separator>
            <Button secondary large className='wallet-steps__footer-button' onClick={handleBack}>
                {localize('Back')}
            </Button>
            <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
                {localize('Next')}
            </Button>
        </Modal.Footer>
    );

    const InitialFooter = (
        <Modal.Footer className='wallet-steps__footer' has_separator>
            <Button secondary large className='wallet-steps__footer-button' onClick={handleClose}>
                {localize('Maybe later')}
            </Button>
            <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
                {localize('Next')}
            </Button>
        </Modal.Footer>
    );

    const EndFooter = (
        <Modal.Footer className='wallet-steps__footer' has_separator>
            <Button secondary large className='wallet-steps__footer-button' onClick={handleBack}>
                {localize('Back')}
            </Button>
            <Button primary large className='wallet-steps__footer-button' disabled={!is_disabled} onClick={handleClose}>
                {localize('Upgrade to Wallets')}
            </Button>
        </Modal.Footer>
    );

    const WalletSteps = [
        //  Feel free to add components here or anywhere in between (👍≖‿‿≖)👍 👍(≖‿‿≖👍)
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
            name: 'ready_to_upgrade',
            component: <ReadyToUpgradeWallets is_eu={is_eu} toggleCheckbox={toggleCheckbox} />,
            footer: EndFooter,
        },
    ];

    const ModalContent = WalletSteps[current_step]?.component;
    const ModalFooter = WalletSteps[current_step]?.footer || DefaultFooter;

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
                            <React.Fragment>{ModalFooter}</React.Fragment>
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
                            <Modal.Body>{ModalContent}</Modal.Body>
                        </MobileDialog>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
});

export default RealWalletsUpgrade;
