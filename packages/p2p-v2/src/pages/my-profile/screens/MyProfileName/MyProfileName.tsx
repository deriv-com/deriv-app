import React from 'react';
import { useAdvertiserInfo } from '@deriv/api';
import { Avatar, Badge } from '../../../../components';
import BlockedUserOutlineIcon from '../../../../public/ic-user-blocked-outline.svg';
import './MyProfileName.scss';

const MyProfileName = () => {
    const { data: advertiserInfo, isLoading } = useAdvertiserInfo();

    if (isLoading || !advertiserInfo) return <h1>Loading...</h1>;

    return (
        <div className='p2p-v2-my-profile-name'>
            <Avatar name={advertiserInfo.name} />
            <div className='p2p-v2-my-profile-name__details'>
                <h1>{advertiserInfo.name}</h1>
                <div className='p2p-v2-my-profile-name__details-stats'>
                    <h2>Joined 1d</h2>
                    <h2>Not rated yet</h2>
                    <h2>
                        <BlockedUserOutlineIcon /> 0
                    </h2>
                </div>
                <div className='p2p-v2-my-profile-name__details-badges'>
                    <Badge label='ID' status='verified' />
                    <Badge label='Address' status='verified' />
                </div>
            </div>
        </div>
    );
};

export default MyProfileName;
