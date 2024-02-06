/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import { StarRating, UserAvatar } from '@/components';
import { BUY_SELL } from '@/constants';
import { generateEffectiveRate } from '@/utils';
import { p2p, useExchangeRateSubscription } from '@deriv/api';
import { Button, Text } from '@deriv-com/ui';
import { TBuySellRowRenderer } from '../BuySellTable';

const BASE_CURRENCY = 'USD';

const BuySellRow = (props: TBuySellRowRenderer) => {
    const { data: exchangeRateValue, subscribe } = useExchangeRateSubscription();
    const { data } = p2p.advertiser.useGetInfo() || {};
    const {
        account_currency,
        advertiser_details,
        counterparty_type,
        effective_rate,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit_display,
        payment_method_names,
        price_display,
        rate,
        rate_type,
    } = props;

    useEffect(() => {
        subscribe({
            base_currency: BASE_CURRENCY,
            target_currency: local_currency!,
        });
    }, [local_currency, subscribe]);

    const exchangeRate = exchangeRateValue?.rates?.[local_currency ?? ''];

    const { completed_orders_count, id, is_online, name, rating_average, rating_count } = advertiser_details || {};

    const { displayEffectiveRate } = generateEffectiveRate({
        exchange_rate: exchangeRate,
        local_currency,
        market_rate: effective_rate,
        price: price_display,
        rate,
        rate_type,
    });
    const isBuyAdvert = counterparty_type === BUY_SELL.BUY;
    const isMyAdvert = data?.id === id;
    const ratingAverageDecimal = rating_average ? Number(rating_average).toFixed(1) : null;

    return (
        <div className='p2p-v2-buy-sell-row w-full grid grid-cols-[2fr_1.4fr_1fr_1.8fr_0.8fr] p-[1.6rem] items-center border-solid border-b-[1px] border-b-[#f2f3f4] '>
            <div className='flex flex-row gap-4 items-center'>
                <UserAvatar isOnline={is_online} nickname={name!} showOnlineStatus textSize='sm' />
                <div className='flex flex-col'>
                    <Text size='sm'>{name}</Text>
                    <div className='flex flex-row items-center'>
                        {!!rating_average && !!rating_count ? (
                            <>
                                <Text color='less-prominent' size='xs'>
                                    {ratingAverageDecimal}
                                </Text>
                                <StarRating ratingValue={ratingAverageDecimal} />
                                <Text className='ml-2' color='less-prominent' size='xs'>
                                    ({rating_count})
                                </Text>
                            </>
                        ) : (
                            <Text color='less-prominent' size='xs'>
                                Not rated yet
                            </Text>
                        )}
                    </div>
                </div>
            </div>
            <Text size='sm'>
                {min_order_amount_limit_display}-{max_order_amount_limit_display} {account_currency}
            </Text>
            <Text color='success' size='sm' weight='bold'>
                {displayEffectiveRate} {local_currency}
            </Text>
            <div className='flex flex-wrap gap-2'>
                {payment_method_names ? (
                    payment_method_names.map((method: string, idx: number) => (
                        <Text
                            className='border-solid border-[1px] border-[#D6DADB] rounded-lg px-[8px] py-1'
                            key={idx}
                            size='sm'
                        >
                            {method}
                        </Text>
                    ))
                ) : (
                    <Text className='border-solid border-[1px] border-[#D6DADB] rounded-lg px-[8px] py-1' size='sm'>
                        -
                    </Text>
                )}
            </div>
            {!isMyAdvert && (
                <Button className='w-[7.5rem]' size='sm'>
                    {isBuyAdvert ? 'Buy' : 'Sell'} {account_currency}
                </Button>
            )}
        </div>
    );
};

export default BuySellRow;
