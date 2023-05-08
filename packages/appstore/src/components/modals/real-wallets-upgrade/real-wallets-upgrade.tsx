import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, Button } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { ContentFlag } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import StepComponent from './components/wallet-steps/wallet-steps';

const RealWalletsUpgrade = () => {
    const { traders_hub } = useStore();
    const { is_real_wallets_upgrade_on, toggleWalletsUpgrade, content_flag } = traders_hub;
    const eu_user = content_flag === ContentFlag.EU_REAL || content_flag === ContentFlag.EU_DEMO;

    const [current_step, setCurrentStep] = React.useState(1);

    const handleNext = () => {
        setCurrentStep(current_step + 1);
    };
    const handleBack = () => {
        setCurrentStep(current_step - 1);
    };

    const handleClose = () => {
        toggleWalletsUpgrade(false);
    };

    React.useEffect(() => {
        if (!is_real_wallets_upgrade_on) {
            setCurrentStep(1);
        }
    }, [is_real_wallets_upgrade_on]);

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
                            <Modal.Body>
                                <StepComponent eu_user={eu_user} current_step={current_step} />
                            </Modal.Body>
                            <Modal.Footer has_separator>
                                <Button
                                    secondary
                                    large
                                    onClick={() => {
                                        if (current_step === 1) {
                                            handleClose();
                                            return;
                                        }
                                        handleBack();
                                    }}
                                >
                                    {current_step === 1 ? localize('Maybe later') : localize('Back')}
                                </Button>
                                <Button
                                    primary
                                    large
                                    onClick={() => {
                                        handleNext();
                                    }}
                                >
                                    {localize('Next')}
                                </Button>
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
                            <Modal.Body>
                                <StepComponent eu_user={eu_user} current_step={current_step} />
                            </Modal.Body>
                            <Modal.Footer className='wallet-steps__footer' has_separator>
                                <Button
                                    secondary
                                    className='wallet-steps__footer-button'
                                    large
                                    onClick={() => {
                                        if (current_step === 1) {
                                            handleClose();
                                            return;
                                        }
                                        handleBack();
                                    }}
                                >
                                    {current_step === 1 ? localize('Maybe later') : localize('Back')}
                                </Button>
                                <Button
                                    primary
                                    className='wallet-steps__footer-button'
                                    large
                                    onClick={() => {
                                        handleNext();
                                    }}
                                >
                                    {localize('Next')}
                                </Button>
                            </Modal.Footer>
                        </MobileDialog>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default observer(RealWalletsUpgrade);
