import React from 'react';
import { Avatar } from '../Avatar';
import { useAdvertiserStats, useDevice } from '../../hooks';
import AdvertiserNameStats from './AdvertiserNameStats';
import AdvertiserNameBadges from './AdvertiserNameBadges';
import AdvertiserNameToggle from './AdvertiserNameToggle';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './AdvertiserName.scss';

const AdvertiserName = () => {
    const { data: advertiserStats, isLoading } = useAdvertiserStats();
    const { isDesktop } = useDevice();

    if (isLoading || !advertiserStats) return <h1>Loading...</h1>;

    return (
        <div className='p2p-v2-advertiser-name'>
            {/* TODO: To be replaced with useravatar component */}
            <Avatar name={advertiserStats.name || ''} />
            <div className='p2p-v2-advertiser-name__details'>
                <Text size='md' weight='bold'>
                    {advertiserStats.name}{' '}
                    {advertiserStats.show_name && (
                        <Text color='less-prominent' size='sm'>
                            ({advertiserStats.fullName})
                        </Text>
                    )}
                </Text>
                <AdvertiserNameStats />
                <AdvertiserNameBadges />
            </div>
            {isDesktop && <AdvertiserNameToggle />}
        </div>
    );
};
AdvertiserName.displayName = 'AdvertiserName';

export default AdvertiserName;
