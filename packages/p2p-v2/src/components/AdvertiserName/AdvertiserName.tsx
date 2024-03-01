import React from 'react';
import { TAdvertiserStats } from 'types';
import { UserAvatar } from '@/components';
import { getCurrentRoute } from '@/utils';
import { useSettings } from '@deriv/api-v2';
import { LabelPairedEllipsisVerticalLgRegularIcon } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';
import AdvertiserNameBadges from './AdvertiserNameBadges';
import AdvertiserNameStats from './AdvertiserNameStats';
import AdvertiserNameToggle from './AdvertiserNameToggle';
import './AdvertiserName.scss';

const AdvertiserName = ({ advertiserStats }: { advertiserStats: TAdvertiserStats }) => {
    const {
        data: { email },
    } = useSettings();
    const { isDesktop } = useDevice();
    const isMyProfile = getCurrentRoute() === 'my-profile';

    const name = advertiserStats?.name || email;

    return (
        <div className='p2p-v2-advertiser-name' data-testid='dt_p2p_v2_advertiser_name'>
            <UserAvatar nickname={name!} size={isDesktop ? 64 : 42} textSize='lg' />
            <div className='p2p-v2-advertiser-name__details'>
                <div className='flex items-center gap-3'>
                    <Text size='md' weight='bold'>
                        {name}
                    </Text>
                    {(advertiserStats?.show_name || !isMyProfile) && (
                        <Text color='less-prominent' size='sm'>
                            ({advertiserStats?.fullName})
                        </Text>
                    )}
                </div>
                <AdvertiserNameStats advertiserStats={advertiserStats} />
                <AdvertiserNameBadges advertiserStats={advertiserStats} />
            </div>
            {isDesktop && isMyProfile && <AdvertiserNameToggle advertiserInfo={advertiserStats} />}
            {isDesktop && !isMyProfile && <LabelPairedEllipsisVerticalLgRegularIcon className='cursor-pointer' />}
        </div>
    );
};
AdvertiserName.displayName = 'AdvertiserName';

export default AdvertiserName;
