import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CFDPlatformsList } from '../../features';
import useDevice from '../../hooks/useDevice';
import { TSubscribedBalance } from '../../types';
import { OptionsAndMultipliersListing } from '../OptionsAndMultipliersListing';
import {
    WalletsPrimaryTabList,
    WalletsPrimaryTabPanel,
    WalletsPrimaryTabPanels,
    WalletsPrimaryTabs,
} from '../WalletsPrimaryTabs';
import './AccountsList.scss';

const AccountsList: FC<TSubscribedBalance> = ({ balance }) => {
    const { isMobile } = useDevice();
    const { t } = useTranslation();

    if (isMobile) {
        return (
            <WalletsPrimaryTabs className='wallets-accounts-list'>
                <WalletsPrimaryTabList list={[t('CFDs'), t('Options')]} />
                <WalletsPrimaryTabPanels>
                    <WalletsPrimaryTabPanel>
                        <CFDPlatformsList />
                    </WalletsPrimaryTabPanel>
                    <WalletsPrimaryTabPanel>
                        <OptionsAndMultipliersListing balance={balance} />
                    </WalletsPrimaryTabPanel>
                </WalletsPrimaryTabPanels>
            </WalletsPrimaryTabs>
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
