import * as React from 'react';
import MyProfileBalance from '../my-profile-balance';
import MyProfileDetailsTable from '../my-profile-details-table';
import MyProfileName from '../my-profile-name';
import './my-profile-details-container.scss';

const MyProfileDetailsContainer = () => (
    <div className='my-profile-details-container'>
        <MyProfileName />
        <div className='my-profile-details-container--table'>
            <MyProfileBalance />
            <MyProfileDetailsTable />
        </div>
    </div>
);

export default MyProfileDetailsContainer;
