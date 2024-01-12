import React from 'react';
import { MyProfileBalance } from '../MyProfileBalance';
import { MyProfileName } from '../MyProfileName';
import './MyProfileContent.scss';

const MyProfileContent = () => {
    return (
        <div className='p2p-v2-my-profile-content'>
            <MyProfileName />
            <MyProfileBalance />
        </div>
    );
};

export default MyProfileContent;
