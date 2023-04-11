import React from 'react';
import { observer } from 'mobx-react-lite';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, Button } from '@deriv/components';
import './components/wallet-steps.scss';
import WalletSteps from './components/wallet-steps';
import { ContentFlag } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import { steps } from 'Constants/wallet-static-steps-config';

const RealWalletsUpgrade = () => {
    const { traders_hub } = useStore();
    const { is_real_wallets_upgrade_on, toggleWalletsUpgrade, content_flag } = traders_hub;
    const eu_user = content_flag === ContentFlag.EU_REAL;

    const [currentStep, setCurrentStep] = React.useState(1);

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };
    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleClose = () => {
        toggleWalletsUpgrade(false);
    };

    React.useEffect(() => {
        if (!is_real_wallets_upgrade_on) {
            setCurrentStep(1);
        }
    }, [is_real_wallets_upgrade_on]);

    const step_config = steps(eu_user);

    const StepComponent = () => {
        return (
            <React.Fragment>
                {step_config.map((step, index) => {
                    if (index === currentStep - 1) {
                        return (
                            <WalletSteps
                                key={index}
                                icon={step?.icon}
                                title={step?.title}
                                description={step?.description}
                                bullets={step?.bullets || []}
                            />
                        );
                    }
                    return null;
                })}
            </React.Fragment>
        );
    };

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
                            elements_to_ignore={[document.querySelector('.modal-root')]}
                            title={' '}
                        >
                            <Modal.Body>
                                <StepComponent />
                            </Modal.Body>
                            <Modal.Footer has_separator>
                                <Button
                                    secondary
                                    large
                                    onClick={() => {
                                        if (currentStep === 1) {
                                            handleClose();
                                            return;
                                        }
                                        handleBack();
                                    }}
                                >
                                    {currentStep === 1 ? localize('Maybe later') : localize('Back')}
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
                                <StepComponent />
                            </Modal.Body>
                            <Modal.Footer className='wallet-steps__footer' has_separator>
                                <Button
                                    secondary
                                    className='wallet-steps__footer-button'
                                    large
                                    onClick={() => {
                                        if (currentStep === 1) {
                                            handleClose();
                                            return;
                                        }
                                        handleBack();
                                    }}
                                >
                                    {currentStep === 1 ? localize('Maybe later') : localize('Back')}
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
