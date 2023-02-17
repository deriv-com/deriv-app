import React from 'react';
import { DesktopWrapper, Loading, MobileWrapper, Text } from '@deriv/components';
import { daysSince, isMobile } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize, localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import RateChangeModal from 'Components/buy-sell/rate-change-modal.jsx';
import BuySellModal from 'Components/buy-sell/buy-sell-modal.jsx';
import PageReturn from 'Components/page-return/page-return.jsx';
import RecommendedBy from 'Components/recommended-by';
import UserAvatar from 'Components/user/user-avatar/user-avatar.jsx';
import AdvertiserPageStats from './advertiser-page-stats.jsx';
import AdvertiserPageAdverts from './advertiser-page-adverts.jsx';
import StarRating from 'Components/star-rating';
import AdvertiserPageDropdownMenu from './advertiser-page-dropdown-menu.jsx';
import TradeBadge from '../trade-badge/trade-badge.jsx';
import BlockUserOverlay from './block-user/block-user-overlay';
import BlockUserModal from 'Components/block-user/block-user-modal';
import ErrorModal from 'Components/error-modal/error-modal';
import classNames from 'classnames';
import { OnlineStatusIcon, OnlineStatusLabel } from 'Components/online-status';
import './advertiser-page.scss';

const AdvertiserPage = () => {
    const { general_store, advertiser_page_store, buy_sell_store, my_profile_store } = useStores();

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
        name,
        rating_average,
        rating_count,
        recommended_average,
        recommended_count,
        sell_orders_count,
    } = info;

    // rating_average_decimal converts rating_average to 1 d.p number
    const rating_average_decimal = rating_average ? Number(rating_average).toFixed(1) : null;
    const joined_since = daysSince(created_time);
    const [is_error_modal_open, setIsErrorModalOpen] = React.useState(false);

    React.useEffect(() => {
        advertiser_page_store.onMount();
        advertiser_page_store.setIsDropdownMenuVisible(false);

        reaction(
            () => [advertiser_page_store.active_index, general_store.block_unblock_user_error],
            () => {
                advertiser_page_store.onTabChange();
                if (general_store.block_unblock_user_error) setIsErrorModalOpen(true);
            },
            { fireImmediately: true }
        );

        return () => {
            advertiser_page_store.onUnmount();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (advertiser_page_store.is_loading || general_store.is_block_unblock_user_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (advertiser_page_store.error_message) {
        return <div className='advertiser-page__error'>{advertiser_page_store.error_message}</div>;
    }

    return (
        <div
            className={classNames('advertiser-page', {
                'advertiser-page--no-scroll':
                    !!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert,
            })}
        >
            <RateChangeModal onMount={advertiser_page_store.setShowAdPopup} />
            <ErrorModal
                error_message={general_store.block_unblock_user_error}
                error_modal_title='Unable to block advertiser'
                has_close_icon={false}
                is_error_modal_open={is_error_modal_open}
                setIsErrorModalOpen={is_open => {
                    if (!is_open) buy_sell_store.hideAdvertiserPage();
                    if (general_store.active_index !== 0)
                        my_profile_store.setActiveTab(my_profile_tabs.MY_COUNTERPARTIES);
                    advertiser_page_store.onCancel();
                    general_store.setBlockUnblockUserError('');
                }}
                width={isMobile() ? '90rem' : '40rem'}
            />
            <BlockUserModal
                advertiser_name={name}
                is_advertiser_blocked={!!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert}
                is_block_user_modal_open={
                    general_store.is_block_user_modal_open && !general_store.block_unblock_user_error
                }
                onCancel={advertiser_page_store.onCancel}
                onSubmit={advertiser_page_store.onSubmit}
            />
            <BuySellModal
                selected_ad={advertiser_page_store.advert}
                should_show_popup={advertiser_page_store.show_ad_popup}
                setShouldShowPopup={advertiser_page_store.setShowAdPopup}
                table_type={advertiser_page_store.counterparty_type === buy_sell.BUY ? buy_sell.BUY : buy_sell.SELL}
            />
            <div className='advertiser-page__page-return-header'>
                <PageReturn
                    className='buy-sell__advertiser-page-return'
                    onClick={() => {
                        buy_sell_store.hideAdvertiserPage();
                        if (general_store.active_index === general_store.path.my_profile)
                            my_profile_store.setActiveTab(my_profile_tabs.MY_COUNTERPARTIES);
                    }}
                    page_title={localize("Advertiser's page")}
                />
                {!is_my_advert && (
                    <MobileWrapper>
                        <AdvertiserPageDropdownMenu />
                    </MobileWrapper>
                )}
            </div>
            <BlockUserOverlay
                is_visible={!!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert}
                onClickUnblock={() => general_store.setIsBlockUserModalOpen(true)}
            >
                <div className='advertiser-page-details-container'>
                    <div className='advertiser-page__header-details'>
                        <UserAvatar
                            nickname={advertiser_page_store.advertiser_details_name}
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
                                        <Text
                                            className='advertiser-page__joined-since'
                                            color='less-prominent'
                                            size='xxxs'
                                        >
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
                                            <OnlineStatusLabel
                                                is_online={is_online}
                                                last_online_time={last_online_time}
                                            />
                                        </div>
                                        <div className='advertiser-page__rating--row'>
                                            <Text
                                                className='advertiser-page__joined-since'
                                                color='less-prominent'
                                                size='xs'
                                            >
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
                                                initial_value={rating_average_decimal}
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
                <AdvertiserPageAdverts />
            </BlockUserOverlay>
        </div>
    );
};

export default observer(AdvertiserPage);
