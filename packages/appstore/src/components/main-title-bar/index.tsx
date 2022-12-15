import React from 'react';
import { Text, DesktopWrapper, MobileWrapper } from '@deriv/components';
import AccountTypeDropdown from './account-type-dropdown';
import AssetSummary from './asset-summary';
import RegulatorSwitcher from './regulators-switcher';
import { localize } from '@deriv/translations';
import './main-title-bar.scss';

const MainTitleBar = () => {
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
                <AccountTypeDropdown />
                <AssetSummary />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default MainTitleBar;
