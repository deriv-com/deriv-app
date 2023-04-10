import React from 'react';
import { observer } from 'mobx-react-lite';
import { DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
import './components/wallet-steps.scss';
import WalletSteps from './components/wallet-steps';
import { ContentFlag } from '@deriv/shared';
import { localize } from '@deriv/translations';
import TradingPlatformIcon from 'Assets/wallets';
import { Wizard } from '@deriv/ui';
import { useStore } from '@deriv/stores';

const RealWalletsUpgrade = () => {
    const { traders_hub } = useStore();
    const { is_real_wallets_upgrade_on, toggleWalletsUpgrade, content_flag } = traders_hub;
    const eu_user = content_flag === ContentFlag.EU_REAL;

    const steps = [
        {
            icon: <TradingPlatformIcon icon={eu_user ? 'IntroducingWalletsEU' : 'IntroducingWallets'} />,
            title: localize('Introducing Wallets'),
            description: localize('A better way to manage your funds'),
            bullets: [
                localize('One Wallet, one currency'),
                localize('A Wallet for each currency to focus your funds'),
                !eu_user && localize('Get one Wallet, get several - your choice'),
            ],
        },
        {
            icon: <TradingPlatformIcon icon='HowItWorks' />,
            title: localize('How it works'),
            description: localize('Get a Wallet, add funds, trade'),
            bullets: [
                localize('Get a Wallet for the currency you want'),
                localize('Add funds to your Wallet via your favourite payment method'),
                localize('Move funds to your trading account to start trading'),
            ],
        },
        {
            icon: <TradingPlatformIcon icon='TradingAccounts' />,
            title: localize('What happens to my trading accounts'),
            description: localize("We'll link them"),
            bullets: [
                localize("We'll connect your existing trading accounts of the same currency to your new Wallet"),
                !eu_user && localize('For example, all your USD trading account(s) will be linked to your USD Wallet'),
            ],
        },
    ];

    return (
        <React.Fragment>
            {is_real_wallets_upgrade_on && (
                <React.Fragment>
                    <DesktopWrapper>
                        <Wizard
                            has_dark_background
                            lock_final_step={false}
                            onClose={() => toggleWalletsUpgrade(false)}
                            primary_button_label={localize('Next')}
                            secondary_button_label={localize('Back')}
                            show_steps_sidebar={false}
                            show_header={true}
                        >
                            {steps.map((step, index) => {
                                return (
                                    <Wizard.Step key={index} show_steps_sidebar={false}>
                                        <WalletSteps
                                            icon={step?.icon}
                                            title={step?.title}
                                            description={step?.description}
                                            bullets={step?.bullets || []}
                                        />
                                    </Wizard.Step>
                                );
                            })}
                        </Wizard>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='modal_root'
                            visible={is_real_wallets_upgrade_on}
                            onClose={() => toggleWalletsUpgrade(false)}
                            wrapper_classname='wallet-steps'
                        >
                            {steps.map((step, index) => {
                                return (
                                    <WalletSteps
                                        key={index}
                                        icon={step?.icon}
                                        title={step?.title}
                                        description={step?.description}
                                        bullets={step?.bullets || []}
                                    />
                                );
                            })}
                        </MobileDialog>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default observer(RealWalletsUpgrade);
