import React from 'react';
import { useSettings } from '@deriv/api';
import { Text } from '@deriv-com/ui';
import { useAdvertiserStats, useDevice } from '../../hooks';
import { UserAvatar } from '../UserAvatar';
import AdvertiserNameBadges from './AdvertiserNameBadges';
import AdvertiserNameStats from './AdvertiserNameStats';
import AdvertiserNameToggle from './AdvertiserNameToggle';
import './AdvertiserName.scss';

const AdvertiserName = () => {
    const { data: advertiserStats } = useAdvertiserStats();
    const {
        data: { email },
    } = useSettings();
    const { isDesktop } = useDevice();

    const name = advertiserStats?.name || email;

    return (
        <div className='p2p-v2-advertiser-name'>
            <UserAvatar nickname={name!} size={isDesktop ? 64 : 42} textSize='lg' />
            <div className='p2p-v2-advertiser-name__details'>
                <Text size='md' weight='bold'>
                    {name}{' '}
                    {advertiserStats?.show_name && (
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
