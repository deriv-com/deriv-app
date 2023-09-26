import React from 'react';
import useDevice from '../../hooks/useDevice';
import { CFDPlatformsList } from '../ExternalTradingPlatforms';
import { OptionsAndMultipliersListing } from '../OptionsAndMultipliersListing';
import { TabList, TabPanel, TabPanels, Tabs } from '../Tabs';
import './AccountsList.scss';

const AccountsList = () => {
    const { isMobile } = useDevice();

    if (isMobile) {
        return (
            <Tabs className='wallets-accounts-list'>
                {/* TODO: Localization needed on tab headers */}
                <TabList list={['CFDs', 'Options & multipliers']} />
                <TabPanels>
                    <TabPanel>
                        <CFDPlatformsList />
                    </TabPanel>
                    <TabPanel>
                        <OptionsAndMultipliersListing />
                    </TabPanel>
                </TabPanels>
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
