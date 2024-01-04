import React from 'react';
import './MyProfileStats.scss';

type MyProfileStatsItem = {
    duration?: string;
    isLifetime?: boolean;
    label: string;
    value: string;
};
const MyProfileStatsItem = ({ duration, isLifetime, label, value }: MyProfileStatsItem) => {
    return (
        <div className='p2p-v2-my-profile-stats__item'>
            <span>
                {label} <i>{duration}</i> {isLifetime && <i>| lifetime</i>}
            </span>
            <span>{value}</span>
        </div>
    );
};

export const MyProfileStats = () => {
    return (
        <div className='p2p-v2-my-profile-stats'>
            <MyProfileStatsItem duration='30d' label='Buy completion' value='-' />
            <MyProfileStatsItem duration='30d' label='Sell completion' value='-' />
            <MyProfileStatsItem duration='30d' label='Avg pay time' value='30d' />
            <MyProfileStatsItem duration='30d' label='Avg release time' value='-' />
            <MyProfileStatsItem duration='30d' isLifetime label='Trade volume' value='-' />
            <MyProfileStatsItem duration='30d' isLifetime label='Total orders' value='0' />
            <MyProfileStatsItem duration='30d' label='Trade partners' value='0' />
        </div>
    );
};
