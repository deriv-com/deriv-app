import React from 'react';
import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import UserAvatar from 'Components/user/user-avatar/user-avatar.jsx';
import { useStores } from 'Stores';
import { daysSince, isMobile } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import TradeBadge from '../../../trade-badge';
import MyProfilePrivacy from '../my-profile-privacy';
import StarRating from 'Components/star-rating';
import RecommendedBy from 'Components/recommended-by';
import BlockUserCount from 'Components/advertiser-page/block-user/block-user-count';

const MyProfileName = () => {
    const { general_store, my_profile_store } = useStores();

    const {
        basic_verification,
        buy_orders_count,
        created_time,
        full_verification,
        rating_average,
        rating_count,
        recommended_average,
        recommended_count,
        sell_orders_count,
    } = my_profile_store.advertiser_info;

    const joined_since = daysSince(created_time);
    // rating_average_decimal converts rating_average to 1 d.p number
    const rating_average_decimal = rating_average ? Number(rating_average).toFixed(1) : null;

    return (
        <div className='my-profile-name'>
            <UserAvatar
                className='my-profile-name__avatar'
                nickname={general_store.nickname}
                size={isMobile() ? 32 : 64}
                text_size={isMobile() ? 's' : 'sm'}
            />
            <div className='my-profile-name__name'>
                <div className='my-profile-name--privacy'>
                    <div className='my-profile-name--column'>
                        <Text color='prominent' weight='bold' size='s' line_height='m'>
                            {general_store.nickname}
                        </Text>
                        <div className='my-profile-name--rating'>
                            {rating_average ? (
                                <React.Fragment>
                                    <div className='my-profile-name--rating__row'>
                                        <StarRating
                                            empty_star_icon='IcEmptyStar'
                                            full_star_icon='IcFullStar'
                                            initial_value={rating_average_decimal}
                                            is_readonly
                                            number_of_stars={5}
                                            should_allow_hover_effect={false}
                                            star_size={isMobile() ? 17 : 20}
                                        />
                                        <div className='my-profile-name--rating__text'>
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
                                    <div className='my-profile-name--rating__row'>
                                        <RecommendedBy
                                            recommended_average={recommended_average}
                                            recommended_count={recommended_count}
                                        />
                                    </div>
                                </React.Fragment>
                            ) : (
                                <div className='my-profile-name--rating__row'>
                                    <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                                        <Localize i18n_default_text='Not rated yet' />
                                    </Text>
                                </div>
                            )}
                            <DesktopWrapper>
                                <div className='my-profile-name--rating__row'>
                                    <BlockUserCount />
                                </div>
                                <Text
                                    className='my-profile-name--rating__row'
                                    color='less-prominent'
                                    size={isMobile() ? 'xxxs' : 'xs'}
                                >
                                    {joined_since > 0 ? (
                                        <Localize
                                            i18n_default_text='Joined {{days_since_joined}}d'
                                            values={{ days_since_joined: joined_since }}
                                        />
                                    ) : (
                                        <Localize i18n_default_text='Joined today' />
                                    )}
                                </Text>
                            </DesktopWrapper>
                        </div>
                        <MobileWrapper>
                            <div className='my-profile-name__row'>
                                <div className='my-profile-name--rating__row'>
                                    <BlockUserCount />
                                </div>
                                <Text
                                    className='my-profile-name--rating__row'
                                    color='less-prominent'
                                    size={isMobile() ? 'xxxs' : 'xs'}
                                >
                                    {joined_since > 0 ? (
                                        <Localize
                                            i18n_default_text='Joined {{days_since_joined}}d'
                                            values={{ days_since_joined: joined_since }}
                                        />
                                    ) : (
                                        <Localize i18n_default_text='Joined today' />
                                    )}
                                </Text>
                            </div>
                        </MobileWrapper>
                        <div className='my-profile-name__row'>
                            <TradeBadge
                                is_poa_verified={!!full_verification}
                                is_poi_verified={!!basic_verification}
                                trade_count={Number(buy_orders_count) + Number(sell_orders_count)}
                                large
                            />
                        </div>
                    </div>
                    <DesktopWrapper>
                        <MyProfilePrivacy />
                    </DesktopWrapper>
                </div>
            </div>
        </div>
    );
};

export default observer(MyProfileName);
