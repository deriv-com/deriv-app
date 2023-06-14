import React from 'react';
import { Money, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores/index';

const AdvertiserPageStats = () => {
    const { advertiser_page_store, general_store } = useStores();
    const {
        client: { currency },
    } = useStore();

    const is_my_advert = advertiser_page_store.advertiser_details_id === general_store.advertiser_id;
    // Use general_store.advertiser_info since resubscribing to the same id from advertiser page returns error
    const info = is_my_advert ? general_store.advertiser_info : advertiser_page_store.counterparty_advertiser_info;

    const {
        buy_completion_rate,
        buy_orders_amount,
        buy_orders_count,
        buy_time_avg,
        partner_count,
        release_time_avg,
        sell_completion_rate,
        sell_orders_amount,
        sell_orders_count,
    } = info;

    const avg_buy_time_in_minutes = buy_time_avg > 60 ? Math.round(buy_time_avg / 60) : '< 1';
    const avg_release_time_in_minutes = release_time_avg > 60 ? Math.round(release_time_avg / 60) : '< 1';

    return (
        <React.Fragment>
            <div className='advertiser-page__stats'>
                <div className='advertiser-page__stats-cell'>
                    <Text as='p' color='less-prominent' line_height='m' size={isMobile() ? 'xxxs' : 'xs'}>
                        <Localize
                            i18n_default_text='Buy completion  <0>30d</0>'
                            components={[
                                <Text
                                    key={0}
                                    className='advertiser-page__italic'
                                    color='less-prominent'
                                    size={isMobile() ? 'xxxs' : 'xs'}
                                />,
                            ]}
                        />
                    </Text>
                    <Text as='p' color='prominent' line_height='m' size={isMobile() ? 'xs' : 'm'} weight='bold'>
                        {buy_completion_rate ? `${buy_completion_rate}% (${buy_orders_count})` : '-'}
                    </Text>
                </div>
                <div className='advertiser-page__stats-cell'>
                    <Text as='p' color='less-prominent' line_height='m' size={isMobile() ? 'xxxs' : 'xs'}>
                        <Localize
                            i18n_default_text='Sell completion  <0>30d</0>'
                            components={[
                                <Text
                                    key={0}
                                    className='advertiser-page__italic'
                                    color='less-prominent'
                                    size={isMobile() ? 'xxxs' : 'xs'}
                                />,
                            ]}
                        />
                    </Text>
                    <Text as='p' color='prominent' line_height='m' size={isMobile() ? 'xs' : 'm'} weight='bold'>
                        {sell_completion_rate ? `${sell_completion_rate}% (${sell_orders_count})` : '-'}
                    </Text>
                </div>
                <div className='advertiser-page__stats-cell'>
                    <Text as='p' color='less-prominent' line_height='m' size={isMobile() ? 'xxxs' : 'xs'}>
                        <Localize
                            i18n_default_text='Trade volume  <0>30d</0>'
                            components={[
                                <Text
                                    key={0}
                                    className='advertiser-page__italic'
                                    color='less-prominent'
                                    size={isMobile() ? 'xxxs' : 'xs'}
                                />,
                            ]}
                        />
                    </Text>
                    <Text as='p' color='prominent' line_height='m' size={isMobile() ? 'xs' : 'm'} weight='bold'>
                        {buy_orders_amount && sell_orders_amount ? (
                            <Money
                                amount={Number(buy_orders_amount) + Number(sell_orders_amount)}
                                currency={currency}
                                show_currency
                            />
                        ) : (
                            '-'
                        )}
                    </Text>
                </div>
                <div className='advertiser-page__stats-cell'>
                    <Text as='p' color='less-prominent' line_height='m' size={isMobile() ? 'xxxs' : 'xs'}>
                        <Localize
                            i18n_default_text='Avg. pay time  <0>30d</0>'
                            components={[
                                <Text
                                    key={0}
                                    className='advertiser-page__italic'
                                    color='less-prominent'
                                    size={isMobile() ? 'xxxs' : 'xs'}
                                />,
                            ]}
                        />
                    </Text>
                    <Text color='prominent' size={isMobile() ? 'xs' : 'm'} weight='bold'>
                        {buy_time_avg
                            ? localize('{{- avg_buy_time_in_minutes}} min', {
                                  avg_buy_time_in_minutes,
                              })
                            : '-'}
                    </Text>
                </div>
                <div className='advertiser-page__stats-cell'>
                    <Text as='p' color='less-prominent' line_height='m' size={isMobile() ? 'xxxs' : 'xs'}>
                        <Localize
                            i18n_default_text='Avg. release time  <0>30d</0>'
                            components={[
                                <Text
                                    key={0}
                                    className='advertiser-page__italic'
                                    color='less-prominent'
                                    size={isMobile() ? 'xxxs' : 'xs'}
                                />,
                            ]}
                        />
                    </Text>
                    <Text color='prominent' size={isMobile() ? 'xs' : 'm'} weight='bold'>
                        {release_time_avg
                            ? localize('{{- avg_release_time_in_minutes}} min', {
                                  avg_release_time_in_minutes,
                              })
                            : '-'}
                    </Text>
                </div>
                <div className='advertiser-page__stats-cell'>
                    <Text as='p' color='less-prominent' line_height='m' size={isMobile() ? 'xxxs' : 'xs'}>
                        <Localize i18n_default_text='Trade partners' />
                    </Text>
                    <Text as='p' color='prominent' line_height='m' size={isMobile() ? 'xs' : 'm'} weight='bold'>
                        {partner_count || '0'}
                    </Text>
                </div>
            </div>
        </React.Fragment>
    );
};

export default observer(AdvertiserPageStats);
