import React from 'react';
import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { daysSince, isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { OnlineStatusIcon, OnlineStatusLabel } from 'Components/online-status';
import TradeBadge from 'Components/trade-badge';
import UserAvatar from 'Components/user/user-avatar';
import { useStores } from 'Stores/index';
import AdvertiserPageDropdownMenu from '../advertiser-page-dropdown-menu';
import AdvertiserPageProfileRating from './advertiser-page-profile-rating';
import AdvertiserPageStats from './advertiser-page-stats';

const AdvertiserPageProfile = () => {
    const { advertiser_page_store, general_store } = useStores();

    const is_my_advert = advertiser_page_store.advertiser_details_id === general_store.advertiser_id;
    // Use general_store.advertiser_info since resubscribing to the same id from advertiser page returns error
    const info = is_my_advert ? general_store.advertiser_info : advertiser_page_store.counterparty_advertiser_info;

    const {
        basic_verification,
        buy_orders_count,
        created_time,
        first_name,
        full_verification,
        is_online,
        last_online_time,
        last_name,
        sell_orders_count,
    } = info;

    const joined_since = daysSince(created_time);

    const getJoinedSince = () => {
        if (joined_since) {
            return (
                <Localize
                    i18n_default_text='Joined {{days_since_joined}}d'
                    values={{ days_since_joined: joined_since }}
                />
            );
        }
        return <Localize i18n_default_text='Joined today' />;
    };

    return (
        <div className='advertiser-page-details-container'>
            <div className='advertiser-page__header-details'>
                <UserAvatar
                    nickname={advertiser_page_store.advertiser_details_name ?? ''}
                    size={isMobile() ? 32 : 64}
                    text_size={isMobile() ? 's' : 'sm'}
                />
                <div className='advertiser-page__header-name--column'>
                    <div className='advertiser-page__header-name'>
                        <Text color='prominent' weight='bold'>
                            {advertiser_page_store.advertiser_details_name}
                        </Text>
                        {first_name && last_name && (
                            <div className='advertiser-page__header-real-name'>
                                <Text color='less-prominent' line_height='xs' size='xs'>
                                    {`(${first_name} ${last_name})`}
                                </Text>
                            </div>
                        )}
                    </div>
                    <MobileWrapper>
                        <div className='advertiser-page__row'>
                            <div className='advertiser-page__rating--row'>
                                <OnlineStatusIcon is_online={is_online} />
                                <OnlineStatusLabel is_online={is_online} last_online_time={last_online_time} />
                            </div>
                            <div className='advertiser-page__rating--row'>
                                <Text className='advertiser-page__joined-since' color='less-prominent' size='xxxs'>
                                    {getJoinedSince()}
                                </Text>
                            </div>
                        </div>
                    </MobileWrapper>
                    <div className='advertiser-page__rating'>
                        <DesktopWrapper>
                            <React.Fragment>
                                <div className='advertiser-page__rating--row'>
                                    <OnlineStatusIcon is_online={is_online} />
                                    <OnlineStatusLabel is_online={is_online} last_online_time={last_online_time} />
                                </div>
                                <div className='advertiser-page__rating--row'>
                                    <Text className='advertiser-page__joined-since' color='less-prominent' size='xs'>
                                        {getJoinedSince()}
                                    </Text>
                                </div>
                            </React.Fragment>
                        </DesktopWrapper>
                        <AdvertiserPageProfileRating />
                    </div>
                    <div className='advertiser-page__row'>
                        <TradeBadge
                            is_poa_verified={!!full_verification}
                            is_poi_verified={!!basic_verification}
                            trade_count={Number(buy_orders_count) + Number(sell_orders_count)}
                            large
                        />
                    </div>
                </div>
                {!is_my_advert && (
                    <DesktopWrapper>
                        <AdvertiserPageDropdownMenu />
                    </DesktopWrapper>
                )}
            </div>
            <AdvertiserPageStats />
        </div>
    );
};

export default observer(AdvertiserPageProfile);
