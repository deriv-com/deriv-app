/* eslint-disable camelcase */
import React, { Fragment, useEffect } from 'react';
import clsx from 'clsx';
import { Badge, PaymentMethodLabel, StarRating, UserAvatar } from '@/components';
import { BUY_SELL } from '@/constants';
import { generateEffectiveRate } from '@/utils';
import { p2p, useExchangeRateSubscription } from '@deriv/api';
import { LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { TBuySellTableRowRenderer } from '../BuySellTable/BuySellTable';
import './BuySellTableRow.scss';

const BASE_CURRENCY = 'USD';

const BuySellTableRow = (props: TBuySellTableRowRenderer) => {
    const { data: exchangeRateValue, subscribe } = useExchangeRateSubscription();
    const { isMobile } = useDevice();
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
        if (local_currency) {
            subscribe({
                base_currency: BASE_CURRENCY,
                target_currency: local_currency,
            });
        }
    }, [local_currency, subscribe]);

    const exchangeRate = exchangeRateValue?.rates?.[local_currency ?? ''];
    const Container = isMobile ? 'div' : Fragment;

    const { completed_orders_count, id, is_online, name, rating_average, rating_count } = advertiser_details || {};

    const { displayEffectiveRate } = generateEffectiveRate({
        exchange_rate: exchangeRate,
        local_currency,
        market_rate: effective_rate,
        price: price_display,
        rate,
        rate_type,
    });
    const hasRating = !!rating_average && !!rating_count;
    const isBuyAdvert = counterparty_type === BUY_SELL.BUY;
    const isMyAdvert = data?.id === id;
    const ratingAverageDecimal = rating_average ? Number(rating_average).toFixed(1) : null;

    return (
        <div className='p2p-v2-buy-sell-table-row'>
            <Container>
                <div className='flex flex-row gap-4 items-center'>
                    <UserAvatar isOnline={is_online} nickname={name || ''} showOnlineStatus size={25} textSize='xs' />
                    <div className='flex flex-col'>
                        <div
                            className={clsx('flex flex-row items-center gap-2', {
                                'mb-[-0.5rem]': hasRating,
                            })}
                        >
                            <Text size='sm' weight={isMobile ? 'bold' : 400}>
                                {name}
                            </Text>
                            <Badge tradeCount={completed_orders_count} />
                        </div>
                        <div className='flex flex-row items-center'>
                            {hasRating ? (
                                <>
                                    <Text className='lg:mr-0 mr-[-1.2rem]' color='less-prominent' size='xs'>
                                        {ratingAverageDecimal}
                                    </Text>
                                    <StarRating
                                        isReadonly
                                        ratingValue={Number(ratingAverageDecimal)}
                                        starsScale={isMobile ? 0.7 : 0.9}
                                    />
                                    <Text className='lg:ml-1 ml-[-1rem]' color='less-prominent' size='xs'>
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
                <Container {...(isMobile && { className: 'flex flex-col ml-14 mt-3' })}>
                    {isMobile && <Text size='2xs'>Rate (1 USD)</Text>}
                    <Container {...(isMobile && { className: 'flex flex-col-reverse mb-7' })}>
                        <Text color={isMobile ? 'less-prominent' : 'general'} size={isMobile ? 'xs' : 'sm'}>
                            {isMobile && 'Limits:'} {min_order_amount_limit_display}-{max_order_amount_limit_display}{' '}
                            {account_currency}
                        </Text>
                        <Text className='text-wrap w-[90%]' color='success' size='sm' weight='bold'>
                            {displayEffectiveRate} {local_currency}
                        </Text>
                    </Container>
                    <div className='flex flex-wrap gap-2'>
                        {payment_method_names ? (
                            payment_method_names.map((method: string, idx: number) => (
                                <PaymentMethodLabel
                                    color={isMobile ? 'less-prominent' : 'general'}
                                    key={idx}
                                    paymentMethodName={method}
                                />
                            ))
                        ) : (
                            <PaymentMethodLabel color={isMobile ? 'less-prominent' : 'general'} paymentMethodName='-' />
                        )}
                    </div>
                </Container>
            </Container>
            {!isMyAdvert && (
                <div className='h-full flex flex-col justify-center relative'>
                    {isMobile && <LabelPairedChevronRightMdRegularIcon className='absolute top-0 right-4' />}
                    <Button className='lg:w-[7.5rem]' size={isMobile ? 'md' : 'sm'} textSize={isMobile ? 'md' : 'xs'}>
                        {isBuyAdvert ? 'Buy' : 'Sell'} {account_currency}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default BuySellTableRow;
