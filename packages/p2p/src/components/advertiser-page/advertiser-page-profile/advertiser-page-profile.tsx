import React from 'react';
import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { daysSince, isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { OnlineStatusIcon, OnlineStatusLabel } from 'Components/online-status';
import RecommendedBy from 'Components/recommended-by';
import StarRating from 'Components/star-rating';
import TradeBadge from 'Components/trade-badge';
import UserAvatar from 'Components/user/user-avatar/user-avatar.jsx';
import { useStores } from 'Stores/index';
import AdvertiserPageDropdownMenu from '../advertiser-page-dropdown-menu';
import AdvertiserPageStats from './advertiser-page-stats';

const AdvertiserPage = () => {
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
        rating_average,
        rating_count,
        recommended_average,
        recommended_count,
        sell_orders_count,
    } = info;

    // rating_average_decimal converts rating_average to 1 d.p number
    const rating_average_decimal = rating_average ? Number(rating_average).toFixed(1) : null;
    const joined_since = daysSince(created_time);

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
                        <Text color='prominent' line-height='m' size='s' weight='bold'>
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
                                    {joined_since ? (
                                        <Localize
                                            i18n_default_text='Joined {{days_since_joined}}d'
                                            values={{ days_since_joined: joined_since }}
                                        />
                                    ) : (
                                        <Localize i18n_default_text='Joined today' />
                                    )}
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
                                        {joined_since ? (
                                            <Localize
                                                i18n_default_text='Joined {{days_since_joined}}d'
                                                values={{ days_since_joined: joined_since }}
                                            />
                                        ) : (
                                            <Localize i18n_default_text='Joined today' />
                                        )}
                                    </Text>
                                </div>
                            </React.Fragment>
                        </DesktopWrapper>
                        {rating_average ? (
                            <React.Fragment>
                                <div className='advertiser-page__rating--row'>
                                    <StarRating
                                        empty_star_className='advertiser-page__rating--star'
                                        empty_star_icon='IcEmptyStar'
                                        full_star_className='advertiser-page__rating--star'
                                        full_star_icon='IcFullStar'
                                        initial_value={rating_average_decimal ?? 0}
                                        is_readonly
                                        number_of_stars={5}
                                        should_allow_hover_effect={false}
                                        star_size={isMobile() ? 17 : 20}
                                    />
                                    <div className='advertiser-page__rating--text'>
                                        <Text color='prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                                            {rating_average_decimal}
                                        </Text>
                                        <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                                            {rating_count === 1 ? (
                                                <Localize
                                                    i18n_default_text='({{number_of_ratings}} rating)'
                                                    values={{ number_of_ratings: rating_count }}
                                                />
                                            ) : (
                                                <Localize
                                                    i18n_default_text='({{number_of_ratings}} ratings)'
                                                    values={{ number_of_ratings: rating_count }}
                                                />
                                            )}
                                        </Text>
                                    </div>
                                </div>
                                <div className='advertiser-page__rating--row'>
                                    <RecommendedBy
                                        recommended_average={recommended_average}
                                        recommended_count={recommended_count}
                                    />
                                </div>
                            </React.Fragment>
                        ) : (
                            <div className='advertiser-page__rating--row'>
                                <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                                    <Localize i18n_default_text='Not rated yet' />
                                </Text>
                            </div>
                        )}
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

export default observer(AdvertiserPage);
