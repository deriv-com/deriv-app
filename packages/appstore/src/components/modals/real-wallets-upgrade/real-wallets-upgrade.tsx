import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, DesktopWrapper, MobileDialog, MobileWrapper, Button } from '@deriv/components';
import { useStores } from 'Stores/index';
import './real-wallets-upgrade.scss';
import IntroducingWallets from './components/introducing-wallets';
import HowItWorksWallets from './components/how-it-works-wallets';
import TradingAccountsWallets from './components/trading-accounts-wallets';
import { ContentFlag } from '@deriv/shared';
import { localize } from '@deriv/translations';

const RealWalletsUpgrade = () => {
    const { traders_hub } = useStores();
    const { is_real_wallets_upgrade_on, closeRealWalletsUpgrade, content_flag } = traders_hub;
    const [currentStep, setCurrentStep] = React.useState(1);

    const eu_user = content_flag === ContentFlag.EU_REAL;

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    React.useEffect(() => {
        if (!is_real_wallets_upgrade_on) {
            setCurrentStep(1);
        }
    }, [is_real_wallets_upgrade_on]);

    const steps = [
        {
            title: 'introducing_wallets',
            component: <IntroducingWallets onNext={handleNext} onClose={closeRealWalletsUpgrade} eu_user={eu_user} />,
            footerActions: [
                { text: localize('Maybe later'), onClick: closeRealWalletsUpgrade, type: 'secondary' },
                { text: localize('Next'), onClick: handleNext, type: 'primary' },
            ],
        },
        {
            title: 'how_it_works',
            component: <HowItWorksWallets onNext={handleNext} onBack={handleBack} />,
            footerActions: [
                {
                    text: localize('Back'),
                    onClick: handleBack,
                    type: 'secondary',
                },
                {
                    text: localize('Next'),
                    onClick: handleNext,
                    type: 'primary',
                },
            ],
        },
        {
            title: 'trading_accounts',
            component: (
                <TradingAccountsWallets onBack={handleBack} onClose={closeRealWalletsUpgrade} eu_user={eu_user} />
            ),
            footerActions: [
                {
                    text: localize('Back'),
                    onClick: handleBack,
                    type: 'secondary',
                },
                {
                    text: localize('Close'),
                    onClick: closeRealWalletsUpgrade,
                    type: 'primary',
                },
            ],
        },
    ];

    return (
        <React.Fragment>
            {is_real_wallets_upgrade_on && (
                <React.Fragment>
                    <DesktopWrapper>
                        <Modal
                            is_open={is_real_wallets_upgrade_on}
                            toggleModal={closeRealWalletsUpgrade}
                            height='734px'
                            width='1200px'
                            elements_to_ignore={[document.querySelector('.modal-root')]}
                        >
                            <Modal.Body>
                                {steps.map((step, index) => {
                                    if (index === currentStep - 1) {
                                        return <div key={index}>{step.component}</div>;
                                    }
                                    return null;
                                })}
                            </Modal.Body>
                            <Modal.Footer has_separator>
                                {steps[currentStep - 1].footerActions.map((action, index) => (
                                    <Button
                                        key={index}
                                        className='introducing-wallets--footer--button'
                                        has_effect
                                        onClick={action.onClick}
                                        text={action.text}
                                        large
                                        type={action.type}
                                    />
                                ))}
                            </Modal.Footer>
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='modal_root'
                            visible={is_real_wallets_upgrade_on}
                            onClose={closeRealWalletsUpgrade}
                            wrapper_classname='introducing-wallets'
                        >
                            {currentStep === 1 && (
                                <IntroducingWallets
                                    onNext={handleNext}
                                    onClose={closeRealWalletsUpgrade}
                                    eu_user={eu_user}
                                />
                            )}
                            {currentStep === 2 && <HowItWorksWallets onNext={handleNext} onBack={handleBack} />}
                            {currentStep === 3 && (
                                <TradingAccountsWallets
                                    onBack={handleBack}
                                    onClose={closeRealWalletsUpgrade}
                                    eu_user={eu_user}
                                />
                            )}
                        </MobileDialog>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default observer(RealWalletsUpgrade);
