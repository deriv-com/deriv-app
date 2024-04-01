import React from 'react';
import { AdvertiserName, AdvertiserNameToggle } from '@/components';
import { useAdvertiserStats } from '@/hooks';
import { getCurrentRoute } from '@/utils';
import { useDevice } from '@deriv-com/ui';
import { ProfileBalance } from './ProfileBalance';
import { ProfileStats } from './ProfileStats';
import './ProfileContent.scss';

type TProfileContentProps = {
    id?: string;
};

const ProfileContent = ({ id }: TProfileContentProps) => {
    const { isMobile } = useDevice();
    const { data } = useAdvertiserStats(id);
    const isMyProfile = getCurrentRoute() === 'my-profile';

    return (
        <>
            <div className='p2p-v2-profile-content'>
                <AdvertiserName advertiserStats={data} />
                {isMyProfile ? <ProfileBalance advertiserStats={data} /> : <ProfileStats advertiserStats={data} />}
            </div>
            {isMobile && isMyProfile && <AdvertiserNameToggle advertiserInfo={data} />}
        </>
    );
};

export default ProfileContent;
