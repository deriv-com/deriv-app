import React from 'react';
import { observer } from 'mobx-react-lite';
import { DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
import './components/wallet-steps.scss';
import WalletSteps from './components/wallet-steps';
import { ContentFlag } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Wizard } from '@deriv/ui';
import { useStore } from '@deriv/stores';
import { steps } from 'Constants/wallet-steps-config';

const RealWalletsUpgrade = () => {
    const { traders_hub } = useStore();
    const { is_real_wallets_upgrade_on, toggleWalletsUpgrade, content_flag } = traders_hub;
    const eu_user = content_flag === ContentFlag.EU_REAL;

    const step_config = steps(eu_user);

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
                            {step_config.map((step, index) => {
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
                            {step_config.map((step, index) => {
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
