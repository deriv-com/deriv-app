import React from 'react';
import { Text, DesktopWrapper, MobileWrapper, Tabs, Icon } from '@deriv/components';
import { ContentFlag } from '@deriv/shared';
import AccountTypeDropdown from './account-type-dropdown';
import AssetSummary from './asset-summary';
import RegulatorSwitcher from './regulators-switcher';
import { localize } from '@deriv/translations';
import './main-title-bar.scss';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores/index';
import RegulationsSwitcherLoader from 'Components/pre-loader/regulations-switcher-loader';
import WalletsBanner from 'Components/wallets-banner';

const MainTitleBar = () => {
    const { traders_hub, client, notifications } = useStores();
    const {
        selected_region,
        handleTabItemClick,
        toggleRegulatorsCompareModal,
        content_flag,
        setWalletsMigrationFailedPopup,
    } = traders_hub;
    const { is_landing_company_loaded, is_switching } = client;
    const { removeAllNotificationMessages, filterNotificationMessages } = notifications;
    const is_low_risk_cr_real_account =
        content_flag === ContentFlag.LOW_RISK_CR_NON_EU || content_flag === ContentFlag.LOW_RISK_CR_EU;

    const [active_index, setActiveIndex] = React.useState(selected_region === 'Non-EU' ? 0 : 1);

    // TODO: Remove this when we have BE API ready
    removeAllNotificationMessages();

    React.useEffect(() => {
        filterNotificationMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <DesktopWrapper>
                {/* TODO: This is for testing purposes only */}
                <button onClick={() => setWalletsMigrationFailedPopup(true)}>Modal wallet migration failed</button>
                {/* TODO: Add logic to show and hide the banner here */}
                <WalletsBanner />
                <div className='main-title-bar'>
                    <div className='main-title-bar__right'>
                        <Text size='m' weight='bold' color='prominent'>
                            {localize("Trader's Hub")}
                        </Text>
                        <AccountTypeDropdown />
                    </div>
                    {is_low_risk_cr_real_account && is_landing_company_loaded && <RegulatorSwitcher />}
                    <AssetSummary />
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <WalletsBanner />

                <Text weight='bold' className='main-title-bar__text' color='prominent'>
                    {localize("Trader's Hub")}
                </Text>
                <div className='main-title-bar-mobile'>
                    <div className='main-title-bar-mobile--account-type-dropdown'>
                        <AccountTypeDropdown />
                    </div>
                    {/* TODO: This is for testing purposes only */}
                    <button onClick={() => setWalletsMigrationFailedPopup(true)}>Modal wallet migration failed</button>
                    {is_low_risk_cr_real_account && is_landing_company_loaded ? (
                        <div className='main-title-bar-mobile--regulator'>
                            {!is_switching ? (
                                <>
                                    <div
                                        className='main-title-bar-mobile--regulator--compare-modal'
                                        onClick={() => toggleRegulatorsCompareModal()}
                                    >
                                        <Icon icon='IcInfoOutline' />
                                    </div>
                                    <Tabs
                                        active_index={active_index}
                                        onTabItemClick={(index: number) => {
                                            setActiveIndex(index);
                                            handleTabItemClick(index);
                                        }}
                                        top
                                        is_scrollable
                                        is_overflow_hidden
                                    >
                                        <div label={localize('Non-EU')} />
                                        <div label={localize('EU')} />
                                    </Tabs>
                                </>
                            ) : (
                                <div className='main-title-bar-mobile--regulator__container content-loader'>
                                    <RegulationsSwitcherLoader />
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
                <AssetSummary />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(MainTitleBar);
