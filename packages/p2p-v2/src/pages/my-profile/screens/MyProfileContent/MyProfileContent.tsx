import React from 'react';
import { AdvertiserName, AdvertiserNameToggle } from '@/components';
import { useDevice } from '@/hooks';
import { MyProfileBalance } from '../MyProfileBalance';
import './MyProfileContent.scss';

const MyProfileContent = () => {
    const { isMobile } = useDevice();
    return (
        <>
            <div className='p2p-v2-my-profile-content'>
                <AdvertiserName />
                <MyProfileBalance />
            </div>
            {isMobile && <AdvertiserNameToggle />}
        </>
    );
};

export default MyProfileContent;
