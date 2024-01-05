import React from 'react';
import { useAdvertiserStats } from '../../../../hooks';
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
    const { data } = useAdvertiserStats();
    console.log(data);

    if (!data) return <h1>Loading...</h1>;

    const {
        averagePayTime,
        averageReleaseTime,
        buyCompletionRate,
        buyOrdersCount,
        sellCompletionRate,
        sellOrdersCount,
        totalOrders,
        tradePartners,
        tradeVolume,
    } = data;

    const getTimeValueText = (minutes: number) => `${minutes === 1 ? '< ' : ''}${minutes} min`;

    return (
        <div className='p2p-v2-my-profile-stats'>
            <MyProfileStatsRow>
                <MyProfileStatsItem
                    duration='30d'
                    label='Buy completion'
                    value={buyCompletionRate ? `${buyCompletionRate}% (${buyOrdersCount})` : '-'}
                />
                <MyProfileStatsItem
                    duration='30d'
                    label='Sell completion'
                    value={sellCompletionRate ? `${sellCompletionRate}% (${sellOrdersCount})` : '-'}
                />
                <MyProfileStatsItem duration='30d' label='Avg pay time' value={getTimeValueText(averagePayTime)} />
                <MyProfileStatsItem
                    duration='30d'
                    label='Avg release time'
                    value={getTimeValueText(averageReleaseTime)}
                />
            </MyProfileStatsRow>
            <MyProfileStatsRow>
                <MyProfileStatsItem duration='30d' isLifetime label='Trade volume' value='-' />
                <MyProfileStatsItem duration='30d' isLifetime label='Total orders' value='0' />
                <MyProfileStatsItem duration='30d' label='Trade partners' value='0' />
            </MyProfileStatsRow>
        </div>
    );
};
