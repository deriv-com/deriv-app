import React from 'react';
import { Text, DesktopWrapper, MobileWrapper, Tabs, Div100vhContainer } from '@deriv/components';
import AccountTypeDropdown from './account-type-dropdown';
import AssetSummary from './asset-summary';
import RegulatorSwitcher from './regulators-switcher';
import { localize } from '@deriv/translations';
import './main-title-bar.scss';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores/index';

const MainTitleBar = () => {
    const { tradinghub } = useStores();
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
                    <RegulatorSwitcher />
                    <AssetSummary />
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <div className='main-title-bar-mobile'>
                    <Text size='m' weight='bold'>
                        {localize("Trader's Hub")}
                    </Text>
                </div>
                <div className='main-title-bar-mobile'>
                    <AccountTypeDropdown />
                    <Tabs
                        active_index={tradinghub.selected_region}
                        onTabItemClick={tradinghub.selectRegion}
                        top
                        is_scrollable
                        is_overflow_hidden
                    >
                        <div label={localize('Non-EU')} />
                        <div label={localize('EU')} />
                    </Tabs>
                </div>
                <AssetSummary />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(MainTitleBar);
