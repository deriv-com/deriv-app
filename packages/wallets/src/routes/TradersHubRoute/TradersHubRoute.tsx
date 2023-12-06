import React from 'react';
import { OptionsAndMultipliersListing, WalletsPrimaryTabList, WalletsPrimaryTabs, WalletText } from '../../components';
import { CFDPlatformsList } from '../../features';
import './TradersHubRoute.scss';

const TradesHubRoute: React.FC = () => {
    return (
        <div className='wallets-traders-hub-route'>
            <div className='wallets-traders-hub-route'>
                <div className='wallets-traders-hub-route__content__header'>
                    <div className='wallets-traders-hub-route__content__header__title'>
                        <WalletText size='xl' weight='bold'>
                            Traders Hub
                        </WalletText>
                    </div>
                    <div className='wallets-traders-hub-route__content__header__regulation'>
                        <WalletText size='xs'>Regulation:</WalletText>
                        <WalletsPrimaryTabs className='wallets-traders-hub-route__content__header__regulation__tabs'>
                            <WalletsPrimaryTabList list={['Non-EU', 'EU']} />
                        </WalletsPrimaryTabs>
                    </div>
                    <div className='wallets-traders-hub-route__content__header__language'>
                        <WalletText size='xs'>Total Assets</WalletText>
                    </div>
                </div>
                <div className='wallets-traders-hub-route__content__options-and-multipliers'>
                    <OptionsAndMultipliersListing />
                </div>
                <div className='wallets-traders-hub-route__content__cfds'>
                    <CFDPlatformsList />
                </div>
            </div>
        </div>
    );
};

export default TradesHubRoute;
