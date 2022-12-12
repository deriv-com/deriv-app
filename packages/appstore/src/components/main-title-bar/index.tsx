import React from 'react';
import { Text } from '@deriv/components';
import AccountTypeDropdown from './account-type-dropdown';
import AssetSummary from './asset-summary';
import RegulatorSwitcher from './regulators-switcher';
import { localize } from '@deriv/translations';
import './main-title-bar.scss';

const MainTitleBar = () => {
    return (
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
    );
};

export default MainTitleBar;
