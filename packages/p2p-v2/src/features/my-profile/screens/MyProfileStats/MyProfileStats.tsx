import React from 'react';
import './MyProfileStats.scss';

type MyProfileStatsItemProps = {
    duration?: string;
    isLifetime?: boolean;
    label: string;
    value: string;
};
const MyProfileStatsItem = ({ duration, isLifetime, label, value }: MyProfileStatsItemProps) => {
    return (
        <div className='p2p-v2-my-profile-stats__item'>
            <span>
                {label} <em>{duration}</em>{' '}
                {isLifetime && (
                    <>
                        | <em className='p2p-v2-my-profile-stats__item--lifetime'>lifetime</em>
                    </>
                )}
            </span>
            <span>
                <strong>{value}</strong>
            </span>
        </div>
    );
};

const MyProfileStatsRow = ({ children }: React.PropsWithChildren<unknown>) => {
    return <div className='p2p-v2-my-profile-stats__row'>{children}</div>;
};

export const MyProfileStats = () => {
    return (
        <div className='p2p-v2-my-profile-stats'>
            <MyProfileStatsRow>
                <MyProfileStatsItem duration='30d' label='Buy completion' value='-' />
                <MyProfileStatsItem duration='30d' label='Sell completion' value='-' />
                <MyProfileStatsItem duration='30d' label='Avg pay time' value='30d' />
                <MyProfileStatsItem duration='30d' label='Avg release time' value='-' />
            </MyProfileStatsRow>
            <MyProfileStatsRow>
                <MyProfileStatsItem duration='30d' isLifetime label='Trade volume' value='-' />
                <MyProfileStatsItem duration='30d' isLifetime label='Total orders' value='0' />
                <MyProfileStatsItem duration='30d' label='Trade partners' value='0' />
            </MyProfileStatsRow>
        </div>
    );
};
