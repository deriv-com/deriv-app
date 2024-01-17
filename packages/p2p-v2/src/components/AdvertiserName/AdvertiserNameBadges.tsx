import React from 'react';
import { useAdvertiserStats } from '../../hooks';
import { Badge } from '../Badge';
import './AdvertiserNameBadges.scss';

const AdvertiserNameBadges = () => {
    const { data: advertiserStats, isLoading } = useAdvertiserStats();

    if (isLoading || !advertiserStats) return <h1>Loading...</h1>;

    const { isAddressVerified, isIdentityVerified, totalOrders } = advertiserStats;

    return (
        <div className='p2p-v2-advertiser-name-badges'>
            {totalOrders >= 100 && <Badge label='100+' status='trades' variant='warning' />}
            <Badge
                label='ID'
                status={isIdentityVerified ? 'verified' : 'not verified'}
                variant={isIdentityVerified ? 'success' : 'general'}
            />
            <Badge
                label='Address'
                status={isAddressVerified ? 'verified' : 'not verified'}
                variant={isAddressVerified ? 'success' : 'general'}
            />
        </div>
    );
};
AdvertiserNameBadges.displayName = 'AdvertiserNameBadges';

export default AdvertiserNameBadges;
