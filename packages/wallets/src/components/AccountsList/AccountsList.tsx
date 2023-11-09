import React, { useRef } from 'react';
import { CFDPlatformsList } from '../../features';
import useDevice from '../../hooks/useDevice';
import { TabList, TabPanel, TabPanels, Tabs } from '../Base';
import { OptionsAndMultipliersListing } from '../OptionsAndMultipliersListing';
import { WalletMobileTourGuide } from '../WalletTourGuide';
import './AccountsList.scss';

const AccountsList = () => {
    const { isMobile } = useDevice();
    const cfdRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    if (isMobile) {
        return (
            <Tabs className='wallets-accounts-list'>
                {/* TODO: Localization needed on tab headers */}
                <TabList list={['CFDs', 'Options & multipliers']} />
                <TabPanels>
                    <TabPanel>
                        <CFDPlatformsList ref={cfdRef} />
                    </TabPanel>
                    <TabPanel>
                        <OptionsAndMultipliersListing ref={optionsRef} />
                    </TabPanel>
                </TabPanels>
                <WalletMobileTourGuide cfdRef={cfdRef} optionsRef={optionsRef} />
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
