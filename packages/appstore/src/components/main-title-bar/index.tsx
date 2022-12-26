import React from 'react';
import { Text, DesktopWrapper, MobileWrapper, Tabs, Icon } from '@deriv/components';
import AccountTypeDropdown from './account-type-dropdown';
import AssetSummary from './asset-summary';
import RegulatorSwitcher from './regulators-switcher';
import { localize } from '@deriv/translations';
import './main-title-bar.scss';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores/index';

const MainTitleBar = () => {
    const { traders_hub, client } = useStores();
    const { active_index, handleTabItemClick, selected_account_type, toggleRegulatorsCompareModal } = traders_hub;
    const { is_eu } = client;
    const is_real = selected_account_type === 'real';

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='main-title-bar'>
                    <div className='main-title-bar__right'>
                        <Text size='m' weight='bold'>
                            {localize("Trader's Hub")}
                        </Text>
                        <AccountTypeDropdown />
                    </div>
                    {is_real && !is_eu && <RegulatorSwitcher />}
                    <AssetSummary />
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <Text weight='bold'>{localize("Trader's Hub")}</Text>
                <div className='main-title-bar-mobile'>
                    <div className='main-title-bar-mobile--account-type-dropdown'>
                        <AccountTypeDropdown />
                    </div>
                    {is_real && !is_eu ? (
                        <div className='main-title-bar-mobile--regulator'>
                            <div
                                className='main-title-bar-mobile--regulator--compare-modal'
                                onClick={() => toggleRegulatorsCompareModal()}
                            >
                                <Icon icon='IcInfoOutline' />
                            </div>
                            <Tabs
                                active_index={active_index}
                                onTabItemClick={handleTabItemClick}
                                top
                                is_scrollable
                                is_overflow_hidden
                            >
                                <div label={localize('Non-EU')} />
                                <div label={localize('EU')} />
                            </Tabs>
                        </div>
                    ) : null}
                </div>
                <AssetSummary />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(MainTitleBar);
