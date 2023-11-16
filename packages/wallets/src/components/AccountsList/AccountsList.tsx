import React, { useState } from 'react';
import { CFDPlatformsList } from '../../features';
import useDevice from '../../hooks/useDevice';
import { TabList, TabPanel, TabPanels, Tabs } from '../Base';
import { OptionsAndMultipliersListing } from '../OptionsAndMultipliersListing';
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
            <Tabs className='wallets-accounts-list'>
                {/* TODO: Localization needed on tab headers */}
                <TabList list={['CFDs', 'Options & multipliers']} />
                <TabPanels>
                    <TabPanel>
                        <CFDPlatformsList onMT5PlatformListLoaded={setIsMT5PlatformListLoaded} />
                    </TabPanel>
                    <TabPanel>
                        <OptionsAndMultipliersListing
                            onOptionsAndMultipliersLoaded={setIsOptionsAndMultipliersLoaded}
                        />
                    </TabPanel>
                </TabPanels>
                <WalletMobileTourGuide
                    isMT5PlatformListLoaded={isMT5PlatformListLoaded}
                    isOptionsAndMultipliersLoaded={isOptionsAndMultipliersLoaded}
                    isWalletSettled={isWalletSettled}
                />
            </Tabs>
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
