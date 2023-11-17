import React, { useState } from 'react';
import { CFDPlatformsList } from '../../features';
import useDevice from '../../hooks/useDevice';
import { OptionsAndMultipliersListing } from '../OptionsAndMultipliersListing';
import {
    WalletsPrimaryTabList,
    WalletsPrimaryTabPanel,
    WalletsPrimaryTabPanels,
    WalletsPrimaryTabs,
} from '../WalletsPrimaryTabs';
import { WalletMobileTourGuide } from '../WalletTourGuide';
import './AccountsList.scss';

type TProps = {
    isWalletSettled?: boolean;
};

const AccountsList = ({ isWalletSettled }: TProps) => {
    const { isMobile } = useDevice();
    const [isMT5PlatformListLoaded, setIsMT5PlatformListLoaded] = useState(false);
    const [isOptionsAndMultipliersLoaded, setIsOptionsAndMultipliersLoaded] = useState(false);

    if (isMobile) {
        return (
            <WalletsPrimaryTabs className='wallets-accounts-list'>
                {/* TODO: Localization needed on tab headers */}
                <WalletsPrimaryTabList list={['CFDs', 'Options & multipliers']} />
                <WalletsPrimaryTabPanels>
                    <WalletsPrimaryTabPanel>
                        <CFDPlatformsList onMT5PlatformListLoaded={setIsMT5PlatformListLoaded} />
                    </WalletsPrimaryTabPanel>
                    <WalletsPrimaryTabPanel>
                        <OptionsAndMultipliersListing
                            onOptionsAndMultipliersLoaded={setIsOptionsAndMultipliersLoaded}
                        />
                    </WalletsPrimaryTabPanel>
                </WalletsPrimaryTabPanels>
                <WalletMobileTourGuide
                    isMT5PlatformListLoaded={isMT5PlatformListLoaded}
                    isOptionsAndMultipliersLoaded={isOptionsAndMultipliersLoaded}
                    isWalletSettled={isWalletSettled}
                />
            </WalletsPrimaryTabs>
        );
    }

    return (
        <div className='wallets-accounts-list'>
            <div className='wallets-accounts-list__content'>
                <CFDPlatformsList />
                <OptionsAndMultipliersListing />
            </div>
        </div>
    );
};

export default AccountsList;
