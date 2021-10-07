import React from 'react';
import MyProfileBalance from './my-profile-balance';
import MyProfilePrivacy from './my-profile-privacy';
import MyProfileStatsTable from './my-profile-stats-table';
import MyProfileName from './my-profile-name';
import MyProfileSeparatorContainer from '../my-profile-separator-container';

const MyStats = () => {
    return (
        <React.Fragment>
            <MyProfileName />
            <MyProfileBalance />
            <MyProfileSeparatorContainer.Line className='my-profile-stats-separator' />
            <MyProfileStatsTable />
            <MyProfilePrivacy />
        </React.Fragment>
    );
};

export default MyStats;
