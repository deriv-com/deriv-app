import React from 'react';
import MyProfileBalance from '../my-profile-balance';
import MyProfileDetailsTable from '../my-profile-details-table';
import MyProfileName from '../my-profile-name';

const MyProfileDetailsContainer = () => (
    <div className='my-profile-details-container'>
        <MyProfileName />
        <div className='my-profile-details-container__table'>
            <MyProfileBalance />
            <MyProfileDetailsTable />
        </div>
    </div>
);

export default MyProfileDetailsContainer;
