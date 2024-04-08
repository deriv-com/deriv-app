import React from 'react';
import { Text, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { ContentFlag } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import WalletsBanner from 'Components/wallets-banner';
import AccountTypeTab from './account-type-active-tab';
// import RegulatorSwitcher from './regulators-switcher';
import './main-title-bar.scss';

const MainTitleBar = () => {
    const { traders_hub } = useStore();
    const { content_flag } = traders_hub;
    // const { is_landing_company_loaded } = client;
    // const is_low_risk_cr_real_account =
    content_flag === ContentFlag.LOW_RISK_CR_NON_EU || content_flag === ContentFlag.LOW_RISK_CR_EU;

    return (
        <React.Fragment>
            <WalletsBanner />
            <DesktopWrapper>
                <div className='main-title-bar'>
                    <div className='main-title-bar__right'>
                        <Text size='m' weight='bold' color='prominent'>
                            <Localize i18n_default_text="Trader's Hub" />
                        </Text>
                        <AccountTypeTab />
                    </div>
                    {/* {is_low_risk_cr_real_account && is_landing_company_loaded && <RegulatorSwitcher />} */}
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <div className='main-title-bar__container'>
                    <Text weight='bold' className='main-title-bar__text' color='prominent'>
                        <Localize i18n_default_text="Trader's Hub" />
                    </Text>
                    <div className='main-title-bar-mobile'>
                        <div className='main-title-bar-mobile--account-type-active-tab'>
                            <AccountTypeTab />
                            {/* {is_low_risk_cr_real_account && is_landing_company_loaded && <RegulatorSwitcher />} */}
                        </div>
                    </div>
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(MainTitleBar);
