import React from 'react';
import { TAdvertiserStats } from 'types';
import { Badge } from '@/components';
import './AdvertiserNameBadges.scss';

/**
 * This component is used to show an advertiser's badge, for instance:
 * +100 Trades, ID verified, Address not verified, etc
 *
 * Use cases are usually in My Profile page and Advertiser page used under the advertiser's name
 */
const AdvertiserNameBadges = ({ advertiserStats }: { advertiserStats: TAdvertiserStats }) => {
    const { isAddressVerified, isIdentityVerified, totalOrders } = advertiserStats || {};

    return (
        <div className='p2p-v2-advertiser-name-badges' data-testid='dt_p2p_v2_advertiser_name_badges'>
            {(totalOrders || 0) >= 100 && <Badge label='100+' status='trades' variant='warning' />}
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
