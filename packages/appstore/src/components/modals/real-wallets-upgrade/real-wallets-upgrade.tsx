import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, Button } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { ContentFlag } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import WalletsIntro from './components/wallets-intro/wallets-intro';
import ReadyToUpgradeWallets from './components/ready-to-update-wallets';

const RealWalletsUpgrade = () => {
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
        return () => {
            setIsDisabled(false);
        };
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

    // footer buttons here ( ˶ˆᗜˆ˵ )
    const DefaultFooter = (
        <React.Fragment>
            <Button secondary large className='wallet-steps__footer-button' onClick={handleBack}>
                {localize('Back')}
            </Button>
            <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
                {localize('Next')}
            </Button>
        </React.Fragment>
    );

    const InitialFooter = (
        <React.Fragment>
            <Button secondary large className='wallet-steps__footer-button' onClick={handleClose}>
                {localize('Maybe later')}
            </Button>
            <Button primary large className='wallet-steps__footer-button' onClick={handleNext}>
                {localize('Next')}
            </Button>
        </React.Fragment>
    );

    const EndFooter = (
        <React.Fragment>
            <Button secondary large className='wallet-steps__footer-button' onClick={handleClose}>
                {localize('Back')}
            </Button>
            <Button primary large className='wallet-steps__footer-button' disabled={!is_disabled} onClick={handleClose}>
                {localize('Upgrade to Wallets')}
            </Button>
        </React.Fragment>
    );

    const WalletSteps = [
        //  Feel free to add components here or anywhere in between ( ˶ˆᗜˆ˵ )
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
                            <Modal.Footer className='wallet-steps__footer' has_separator>
                                {ModalFooter}
                            </Modal.Footer>
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='modal_root'
                            visible={is_real_wallets_upgrade_on}
                            onClose={handleClose}
                            wrapper_classname='wallet-steps'
                        >
                            <Modal.Body>{ModalContent}</Modal.Body>
                            <Modal.Footer className='wallet-steps__footer' has_separator>
                                {ModalFooter}
                            </Modal.Footer>
                        </MobileDialog>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default observer(RealWalletsUpgrade);
