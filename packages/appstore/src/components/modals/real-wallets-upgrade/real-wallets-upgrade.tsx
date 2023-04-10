import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, DesktopWrapper, MobileDialog, MobileWrapper, Button } from '@deriv/components';
import { useStores } from 'Stores/index';
import './components/wallet-steps.scss';
import WalletSteps from './components/wallet-steps';
import { ContentFlag } from '@deriv/shared';
import { localize } from '@deriv/translations';
import TradingPlatformIcon from 'Assets/wallets';

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
            component: (
                <WalletSteps
                    icon={<TradingPlatformIcon icon={eu_user ? 'IntroducingWalletsEU' : 'IntroducingWallets'} />}
                    title={localize('Introducing Wallets')}
                    description={localize('A better way to manage your funds')}
                    bullets={[
                        localize('One Wallet, one currency'),
                        localize('A Wallet for each currency to focus your funds'),
                        !eu_user && localize('Get one Wallet, get several - your choice'),
                    ]}
                />
            ),
            footerActions: [
                <Button key={0} text={localize('Maybe later')} onClick={closeRealWalletsUpgrade} secondary large />,
                <Button key={1} text={localize('Next')} onClick={handleNext} primary large />,
            ],
        },
        {
            title: 'how_it_works',
            component: (
                <WalletSteps
                    icon={<TradingPlatformIcon icon='HowItWorks' />}
                    title={localize('How it works')}
                    description={localize('Get a Wallet, add funds, trade')}
                    bullets={[
                        localize('Get a Wallet for the currency you want'),
                        localize('Add funds to your Wallet via your favourite payment method'),
                        localize('Move funds to your trading account to start trading'),
                    ]}
                />
            ),
            footerActions: [
                <Button key={0} text={localize('Back')} onClick={handleBack} secondary large />,
                <Button key={1} text={localize('Next')} onClick={handleNext} primary large />,
            ],
        },
        {
            title: 'trading_accounts',
            component: (
                <WalletSteps
                    icon={<TradingPlatformIcon icon='TradingAccounts' />}
                    title={localize('What happens to my trading accounts')}
                    description={localize("We'll link them")}
                    bullets={[
                        localize(
                            "We'll connect your existing trading accounts of the same currency to your new Wallet"
                        ),
                        !eu_user &&
                            localize('For example, all your USD trading account(s) will be linked to your USD Wallet'),
                    ]}
                />
            ),
            footerActions: [
                <Button key={0} text={localize('Back')} onClick={handleBack} secondary large />,
                <Button key={1} text={localize('Next')} onClick={closeRealWalletsUpgrade} primary large />,
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
                                {steps.map((step, index) => {
                                    if (index === currentStep - 1) {
                                        return <div key={index}>{step.footerActions}</div>;
                                    }
                                    return null;
                                })}
                            </Modal.Footer>
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='modal_root'
                            visible={is_real_wallets_upgrade_on}
                            onClose={closeRealWalletsUpgrade}
                            wrapper_classname='wallet-steps'
                        >
                            {steps.map((step, index) => {
                                if (index === currentStep - 1) {
                                    return <div key={index}>{step.component}</div>;
                                }
                                return null;
                            })}
                            <Modal.Footer className='wallet-steps__footer' has_separator>
                                {steps.map((step, index) => {
                                    if (index === currentStep - 1) {
                                        return <div key={index}>{step.footerActions}</div>;
                                    }
                                    return null;
                                })}
                            </Modal.Footer>
                        </MobileDialog>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default observer(RealWalletsUpgrade);
