import React from 'react';
import { MyProfileBalance } from '../MyProfileBalance';
import { MyProfileName } from '../MyProfileName';
import { useDevice } from '../../../../hooks';
import './MyProfileContent.scss';
import { MyProfileNameToggle } from '../MyProfileName/MyProfileName';
import { MyProfileStats } from '../MyProfileStats';
import { FullPageMobileWrapper } from '../../../../components';

const MyProfileContent = () => {
    const { isMobile } = useDevice();

    if (isMobile) {
        return (
            <FullPageMobileWrapper>
                <div className='p2p-v2-my-profile-content'>
                    <MyProfileName />
                    <MyProfileBalance />
                    <MyProfileNameToggle fullName='Full name' />
                    <MyProfileStats />
                </div>
            </FullPageMobileWrapper>
        );
    }
    return (
        <div className='p2p-v2-my-profile-content'>
            <MyProfileName />
            <MyProfileBalance />
        </div>
    );
};

export default MyProfileContent;
