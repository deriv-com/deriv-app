import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '@deriv-com/ui';
import { CFDPlatformsList } from '../../features';
import useDevice from '../../hooks/useDevice';
import { TSubscribedBalance } from '../../types';
import { OptionsAndMultipliersListing } from '../OptionsAndMultipliersListing';
import './AccountsList.scss';

const tabs = ['CFDs', 'Options'];

type TProps = {
    accountsActiveTabIndex?: number;
    balance: TSubscribedBalance['balance'];
    onTabClickHandler?: React.Dispatch<React.SetStateAction<number>>;
};

const AccountsList: FC<TProps> = ({ accountsActiveTabIndex, balance, onTabClickHandler }) => {
    const { isMobile } = useDevice();
    const { t } = useTranslation();

    const onChangeTabHandler = useCallback((activeTab: number) => onTabClickHandler?.(activeTab), [onTabClickHandler]);

    if (isMobile) {
        return (
            <Tabs
                activeTab={tabs[accountsActiveTabIndex]}
                className='wallets-accounts-list__tabs'
                onChange={onChangeTabHandler}
                wrapperClassName='wallets-accounts-list'
            >
                <Tab className='wallets-accounts-list__tab' title={t('CFDs')}>
                    <CFDPlatformsList />
                </Tab>
                <Tab className='wallets-accounts-list__tab' title={t('Options')}>
                    <OptionsAndMultipliersListing balance={balance} />
                </Tab>
            </Tabs>
        );
    }

    return (
        <div className='wallets-accounts-list' data-testid='dt_desktop_accounts_list'>
            <div className='wallets-accounts-list__content'>
                <CFDPlatformsList />
                <OptionsAndMultipliersListing balance={balance} />
            </div>
        </div>
    );
};

export default AccountsList;
