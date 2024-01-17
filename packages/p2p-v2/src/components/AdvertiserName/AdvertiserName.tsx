import React from 'react';
import { Avatar } from '../Avatar';
import { useAdvertiserStats, useDevice } from '../../hooks';
import AdvertiserNameStats from './AdvertiserNameStats';
import AdvertiserNameBadges from './AdvertiserNameBadges';
import AdvertiserNameToggle from './AdvertiserNameToggle';
import './AdvertiserName.scss';

const AdvertiserName = () => {
    const { data: advertiserStats, isLoading } = useAdvertiserStats();
    const { isDesktop } = useDevice();

    if (isLoading || !advertiserStats) return <h1>Loading...</h1>;

    return (
        <div className='p2p-v2-advertiser-name'>
            <Avatar name={advertiserStats.name || ''} />
            <div className='p2p-v2-advertiser-name__details'>
                <h1>
                    {advertiserStats.name} {advertiserStats.show_name && <span>({advertiserStats.fullName})</span>}
                </h1>
                <AdvertiserNameStats />
                <AdvertiserNameBadges />
            </div>
            {isDesktop && <AdvertiserNameToggle />}
        </div>
    );
};
AdvertiserName.displayName = 'AdvertiserName';

export default AdvertiserName;
