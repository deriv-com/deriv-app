import React from 'react';
import { useAdvertiserStats } from '../../../../hooks';
import './MyProfileStats.scss';
import clsx from 'clsx';
import { useActiveAccount } from '@deriv/api';

type MyProfileStatsItemProps = {
    currency?: string;
    duration?: string;
    label: string;
    onClickLifetime?: (isLifetimeClicked: boolean) => void;
    shouldShowLifetime?: boolean;
    value: string;
};
const MyProfileStatsItem = ({
    currency,
    duration,
    label,
    onClickLifetime,
    shouldShowLifetime,
    value,
}: MyProfileStatsItemProps) => {
    const [hasClickedLifetime, setHasClickedLifetime] = useState(false);

    return (
        <div className='p2p-v2-my-profile-stats__item'>
            <span>
                {label}{' '}
                <em
                    className={clsx(
                        !hasClickedLifetime && shouldShowLifetime && 'p2p-v2-my-profile-stats__item--active'
                    )}
                    onClick={() => {
                        setHasClickedLifetime(false);
                        onClickLifetime?.(false);
                    }}
                >
                    {duration}
                </em>{' '}
                {shouldShowLifetime && (
                    <>
                        |{' '}
                        <em
                            className={clsx(
                                'p2p-v2-my-profile-stats__item-lifetime',
                                hasClickedLifetime && 'p2p-v2-my-profile-stats__item--active'
                            )}
                            onClick={() => {
                                setHasClickedLifetime(true);
                                onClickLifetime?.(true);
                            }}
                        >
                            lifetime
                        </em>
                    </>
                )}
            </span>
            <span>
                <strong>
                    {value} {currency}
                </strong>
            </span>
        </div>
    );
};

const MyProfileStatsRow = ({ children }: React.PropsWithChildren<unknown>) => {
    return <div className='p2p-v2-my-profile-stats__row'>{children}</div>;
};

type MyProfileStatsProps = {
    advertiserId?: string;
};

export const MyProfileStats = ({ advertiserId }: MyProfileStatsProps) => {
    const [shouldShowTradeVolumeLifetime, setShouldShowTradeVolumeLifetime] = useState(false);
    const [shouldShowTotalOrdersLifetime, setShouldShowTotalOrdersLifetime] = useState(false);
    const { data } = useAdvertiserStats(advertiserId);
    const { data: activeAccountData } = useActiveAccount();

    if (!data || !activeAccountData) return <h1>Loading...</h1>;

    // NOTE: This component is only visible for accounts with USD currency
    if (activeAccountData?.currency !== 'USD') return <></>;

    const {
        averagePayTime,
        averageReleaseTime,
        buyCompletionRate,
        buyOrdersCount,
        sellCompletionRate,
        sellOrdersCount,
        totalOrders,
        totalOrdersLifetime,
        tradePartners,
        tradeVolume,
        tradeVolumeLifetime,
    } = data;

    const getTimeValueText = (minutes: number) => `${minutes === 1 ? '< ' : ''}${minutes} min`;
    const getCurrencyText = (currency: number) =>
        new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
            currency
        );

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
                <MyProfileStatsItem
                    currency='USD'
                    duration='30d'
                    label='Trade volume'
                    onClickLifetime={hasClickedLifetime => setShouldShowTradeVolumeLifetime(hasClickedLifetime)}
                    shouldShowLifetime
                    value={
                        shouldShowTradeVolumeLifetime
                            ? getCurrencyText(tradeVolumeLifetime)
                            : getCurrencyText(tradeVolume)
                    }
                />
                <MyProfileStatsItem
                    currency='USD'
                    duration='30d'
                    label='Total orders'
                    onClickLifetime={hasClickedLifetime => setShouldShowTotalOrdersLifetime(hasClickedLifetime)}
                    shouldShowLifetime
                    value={
                        shouldShowTotalOrdersLifetime
                            ? getCurrencyText(totalOrdersLifetime)
                            : getCurrencyText(totalOrders)
                    }
                />
                <MyProfileStatsItem duration='30d' label='Trade partners' value={tradePartners?.toString()} />
            </MyProfileStatsRow>
        </div>
    );
};
