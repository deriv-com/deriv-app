import React, { FC, useCallback } from 'react';
import { useActiveWalletAccount, useGrowthbookIsOn, useIsEuRegion } from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { Divider, Tab, Tabs, useDevice } from '@deriv-com/ui';
import { CFDPlatformsList } from '../../features';
import { OptionsAndMultipliersListing } from '../OptionsAndMultipliersListing';
import { WalletsTabsLoader } from '../SkeletonLoader';
import { WalletsP2PRedirectionBanner } from '../WalletsP2PRedirectionBanner';
import './AccountsList.scss';

type TProps = {
    accountsActiveTabIndex?: number;
    onTabClickHandler?: React.Dispatch<React.SetStateAction<number>>;
};

const AccountsList: FC<TProps> = ({ accountsActiveTabIndex, onTabClickHandler }) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const { data: isEuRegion, isLoading: isEuRegionLoading } = useIsEuRegion();
    const { data: activeWallet } = useActiveWalletAccount();
    const [isP2PWalletEnabled, isGBLoaded] = useGrowthbookIsOn({
        featureFlag: 'p2p_wallet_enabled',
    });

    const optionsAndMultipliersTabTitle = isEuRegion ? localize('Multipliers') : localize('Options');

    const tabs = [localize('CFDs'), optionsAndMultipliersTabTitle];

    const onChangeTabHandler = useCallback((activeTab: number) => onTabClickHandler?.(activeTab), [onTabClickHandler]);

    if (isDesktop)
        return (
            <div className='wallets-accounts-list' data-testid='dt_desktop_accounts_list'>
                <div className='wallets-accounts-list__content'>
                    <Divider color='var(--border-divider)' height={2} />
                    {Boolean(isGBLoaded && isP2PWalletEnabled) && activeWallet?.account_type === 'doughflow' && (
                        <WalletsP2PRedirectionBanner />
                    )}
                    <CFDPlatformsList />
                    <Divider color='var(--border-divider)' height={2} />
                    <OptionsAndMultipliersListing />
                </div>
            </div>
        );

    if (isEuRegionLoading && !isDesktop) {
        return (
            <div className='wallets-accounts-list'>
                <WalletsTabsLoader />
            </div>
        );
    }

    return (
        <>
            {Boolean(isGBLoaded && isP2PWalletEnabled) && activeWallet?.account_type === 'doughflow' && (
                <WalletsP2PRedirectionBanner />
            )}
            <Tabs
                activeTab={tabs[accountsActiveTabIndex ?? 0]}
                className='wallets-accounts-list__tabs'
                onChange={onChangeTabHandler}
                wrapperClassName='wallets-accounts-list'
            >
                <Tab className='wallets-accounts-list__tab' title={localize('CFDs')}>
                    <CFDPlatformsList />
                    <Divider className='wallets-accounts-list__divider' color='var(--wallets-banner-border-color)' />
                </Tab>
                <Tab className='wallets-accounts-list__tab' title={optionsAndMultipliersTabTitle}>
                    <OptionsAndMultipliersListing />
                    <Divider className='wallets-accounts-list__divider' color='var(--wallets-banner-border-color)' />
                </Tab>
            </Tabs>
        </>
    );
};

export default AccountsList;
