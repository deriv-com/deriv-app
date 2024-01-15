import React from 'react';
import { useAdvertiserUpdate } from '@deriv/api';
import { Avatar, Badge, ToggleSwitch } from '../../../../components';
import { useAdvertiserStats, useDevice } from '../../../../hooks';
import BlockedUserOutlineIcon from '../../../../public/ic-user-blocked-outline.svg';
import ThumbUpIcon from '../../../../public/ic-thumb-up.svg';
import './MyProfileName.scss';
import { MyProfileRating } from '../MyProfileRating';

type TAdvertiserStatsData = ReturnType<typeof useAdvertiserStats>['data'];

type TMyProfileNameStatsProps = {
    blockedByCount: NonNullable<TAdvertiserStatsData>['blocked_by_count'];
    daysSinceJoined: NonNullable<TAdvertiserStatsData>['daysSinceJoined'];
    ratingAverage: NonNullable<TAdvertiserStatsData>['rating_average'];
    ratingCount: NonNullable<TAdvertiserStatsData>['rating_count'];
    recommendedAverage: NonNullable<TAdvertiserStatsData>['recommended_average'];
};
const MyProfileNameStats = memo(
    ({ blockedByCount, daysSinceJoined, ratingAverage, ratingCount, recommendedAverage }: TMyProfileNameStatsProps) => {
        return (
            <div className='p2p-v2-my-profile-name__details-stats'>
                <div>
                    <h2>Joined {daysSinceJoined}d</h2>
                </div>
                {!ratingAverage && (
                    <div>
                        <h2>Not rated yet</h2>
                    </div>
                )}
                {ratingAverage && (
                    <>
                        <div>
                            <MyProfileRating rating={ratingAverage || 0} totalCount={ratingCount || 0} />
                        </div>
                        <div>
                            <ThumbUpIcon />
                            <h2>{recommendedAverage || 0}%</h2>
                        </div>
                    </>
                )}
                <div>
                    <BlockedUserOutlineIcon />
                    <h2>{blockedByCount}</h2>
                </div>
            </div>
        );
    }
);

type TMyProfileNameBadgesProps = {
    isAddressVerified: NonNullable<TAdvertiserStatsData>['isAddressVerified'];
    isIdentityVerified: NonNullable<TAdvertiserStatsData>['isIdentityVerified'];
    totalOrders: NonNullable<TAdvertiserStatsData>['totalOrders'];
};
const MyProfileNameBadges = memo(
    ({ isAddressVerified, isIdentityVerified, totalOrders }: TMyProfileNameBadgesProps) => {
        return (
            <div className='p2p-v2-my-profile-name__details-badges'>
                {totalOrders >= 100 && <Badge label='100+' status='trades' variant='warning' />}
                {isIdentityVerified && <Badge label='ID' status='verified' variant='success' />}
                {isAddressVerified && <Badge label='Address' status='verified' variant='success' />}
            </div>
        );
    }
);

type TMyProfileNameToggleProps = {
    fullName: NonNullable<TAdvertiserStatsData>['fullName'];
    onToggleShowRealName: () => void;
    shouldShowRealName: boolean;
};
const MyProfileNameToggle = memo(
    ({ fullName, onToggleShowRealName, shouldShowRealName }: TMyProfileNameToggleProps) => {
        return (
            <div className='p2p-v2-my-profile-name__toggle'>
                <div className='p2p-v2-my-profile-name__toggle-switch'>
                    <h1>Show my real name</h1>
                    <h2>{fullName}</h2>
                </div>
                <ToggleSwitch onChange={onToggleShowRealName} value={shouldShowRealName} />
            </div>
        );
    }
);

const MyProfileName = () => {
    const { data: advertiserInfo, isLoading } = useAdvertiserStats();
    const [shouldShowRealName, setShouldShowRealName] = useState(false);
    const { mutate: advertiserUpdate } = useAdvertiserUpdate();
    const { isDesktop, isMobile } = useDevice();

    useEffect(() => {
        setShouldShowRealName(advertiserInfo?.show_name || false);
    }, [advertiserInfo?.show_name]);

    if (isLoading || !advertiserInfo) return <h1>Loading...</h1>;

    const onToggleShowRealName = () => {
        advertiserUpdate({
            show_name: !shouldShowRealName ? 1 : 0,
        });
        setShouldShowRealName(!shouldShowRealName);
    };

    return (
        <div className='p2p-v2-my-profile-name'>
            <Avatar name={advertiserInfo.name || ''} />
            <div className='p2p-v2-my-profile-name__details'>
                <h1>{advertiserInfo.name}</h1>
                <MyProfileNameStats
                    blockedByCount={advertiserInfo.blocked_by_count}
                    daysSinceJoined={advertiserInfo.daysSinceJoined}
                    ratingAverage={advertiserInfo.rating_average}
                    ratingCount={advertiserInfo.rating_count}
                    recommendedAverage={advertiserInfo.recommended_average}
                />
                <MyProfileNameBadges
                    isAddressVerified={advertiserInfo.isAddressVerified}
                    isIdentityVerified={advertiserInfo.isIdentityVerified}
                    totalOrders={advertiserInfo.totalOrders}
                />
            </div>
            <MyProfileNameToggle
                fullName={advertiserInfo.fullName}
                onToggleShowRealName={onToggleShowRealName}
                shouldShowRealName={shouldShowRealName}
            />
        </div>
    );
};

export default MyProfileName;
