import React from 'react';
import { MyProfileBalance } from '../MyProfileBalance';
import { MyProfileName } from '../MyProfileName';
import { useDevice } from '../../../../hooks';
import './MyProfileContent.scss';
import { MyProfileNameToggle } from '../MyProfileName/MyProfileName';

const MyProfileContent = () => {
    const { isMobile } = useDevice();

    return (
        <div className='p2p-v2-my-profile-content'>
            <MyProfileName />
            <MyProfileBalance />
            {isMobile && <MyProfileNameToggle fullName='Full name' />}
        </div>
    );
};

export default MyProfileContent;
