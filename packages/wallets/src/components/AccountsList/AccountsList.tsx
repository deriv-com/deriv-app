import React from 'react';
import useDevice from '../../hooks/useDevice';
import { TabList, TabPanel, TabPanels, Tabs } from '../Tabs';
import { OptionsAndMultipliersListing } from '..';
import './AccountsList.scss';

const AccountsList = () => {
    const { is_mobile } = useDevice();

    if (is_mobile) {
        return (
            <Tabs className='wallets-accounts-list'>
                {/* TODO: Localization needed on tab headers */}
                <TabList list={['CFDs', 'Options & multipliers']} />
                <TabPanels>
                    <TabPanel>
                        <h1>CFDs</h1>
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
                <OptionsAndMultipliersListing />
            </div>
        </div>
    );
};

export default AccountsList;
