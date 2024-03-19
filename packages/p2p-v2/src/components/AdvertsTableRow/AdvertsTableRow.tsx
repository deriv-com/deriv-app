/* eslint-disable camelcase */
import React, { Fragment, memo, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { TAdvertsTableRowRenderer } from 'types';
import { Badge, BuySellForm, PaymentMethodLabel, StarRating, UserAvatar } from '@/components';
import { BUY_SELL } from '@/constants';
import { generateEffectiveRate, getCurrentRoute } from '@/utils';
import { p2p, useExchangeRateSubscription } from '@deriv/api-v2';
import { LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './AdvertsTableRow.scss';

const BASE_CURRENCY = 'USD';

const AdvertsTableRow = memo((props: TAdvertsTableRowRenderer) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: exchangeRateValue, subscribe } = useExchangeRateSubscription();
    const { isDesktop, isMobile } = useDevice();
    const history = useHistory();
    const isBuySellPage = getCurrentRoute() === 'buy-sell';

    const { data: paymentMethods } = p2p.paymentMethods.useGet();
    const { data: advertiserPaymentMethods } = p2p.advertiserPaymentMethods.useGet();
    const { data } = p2p.advertiser.useGetInfo() || {};
    const { daily_buy = 0, daily_buy_limit = 0, daily_sell = 0, daily_sell_limit = 0 } = data || {};

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

    const { displayEffectiveRate, effectiveRate } = generateEffectiveRate({
        exchangeRate,
        localCurrency: local_currency,
        marketRate: Number(effective_rate),
        price: Number(price_display),
        rate,
        rateType: rate_type,
    });
    const hasRating = !!rating_average && !!rating_count;
    const isBuyAdvert = counterparty_type === BUY_SELL.BUY;
    const isMyAdvert = data?.id === id;
    const ratingAverageDecimal = rating_average ? Number(rating_average).toFixed(1) : null;
    const textColor = isMobile ? 'less-prominent' : 'general';

    return (
        <div
            className={clsx('p2p-v2-adverts-table-row', {
                'p2p-v2-adverts-table-row--advertiser': !isBuySellPage,
            })}
        >
            <Container>
                {isBuySellPage && (
                    <div
                        className='flex gap-4 items-center cursor-pointer'
                        onClick={() => history.push(`/cashier/p2p-v2/advertiser?id=${id}`)}
                    >
                        <UserAvatar
                            isOnline={is_online}
                            nickname={name || ''}
                            showOnlineStatus
                            size={25}
                            textSize='xs'
                        />
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
                            <div className='flex items-center'>
                                {hasRating ? (
                                    <>
                                        <Text className='lg:mr-0' color='less-prominent' size='xs'>
                                            {ratingAverageDecimal}
                                        </Text>
                                        <StarRating
                                            allowHalfIcon
                                            isReadonly
                                            ratingValue={Number(ratingAverageDecimal)}
                                            starsScale={isMobile ? 0.7 : 0.9}
                                        />
                                        <Text className='lg:ml-[-0.5rem] ml-[-2.5rem]' color='less-prominent' size='xs'>
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
                )}
                <Container {...(isMobile && { className: clsx('flex flex-col', { 'mt-3 ml-14': isBuySellPage }) })}>
                    {isMobile && (
                        <Text color={isBuySellPage ? 'general' : 'less-prominent'} size={isBuySellPage ? '2xs' : 'sm'}>
                            Rate (1 USD)
                        </Text>
                    )}
                    <Container {...(isMobile && { className: 'flex flex-col-reverse mb-7' })}>
                        <Text color={textColor} size={isMobile && isBuySellPage ? 'xs' : 'sm'}>
                            {isMobile && 'Limits:'} {min_order_amount_limit_display}-{max_order_amount_limit_display}{' '}
                            {account_currency}
                        </Text>
                        <Text
                            className='text-wrap w-[90%]'
                            color='success'
                            size={isBuySellPage || isDesktop ? 'sm' : 'md'}
                            weight='bold'
                        >
                            {displayEffectiveRate} {local_currency}
                        </Text>
                    </Container>
                    <div className='flex flex-wrap gap-2'>
                        {payment_method_names ? (
                            payment_method_names.map((method: string, idx: number) => (
                                <PaymentMethodLabel color={textColor} key={idx} paymentMethodName={method} />
                            ))
                        ) : (
                            <PaymentMethodLabel color={textColor} paymentMethodName='-' />
                        )}
                    </div>
                </Container>
            </Container>
            {!isMyAdvert && (
                <div
                    className={clsx('flex relative', {
                        'flex-col h-full justify-center': isBuySellPage,
                        'flex-row justify-end': !isBuySellPage,
                    })}
                >
                    {isMobile && isBuySellPage && (
                        <LabelPairedChevronRightMdRegularIcon className='absolute top-0 right-0' />
                    )}
                    <Button
                        className='lg:w-[7.5rem]'
                        onClick={() => setIsModalOpen(true)}
                        size={isMobile ? 'lg' : 'sm'}
                        textSize={isMobile ? 'md' : 'xs'}
                    >
                        {isBuyAdvert ? 'Buy' : 'Sell'} {account_currency}
                    </Button>
                </div>
            )}
            {isModalOpen && (
                <BuySellForm
                    advert={props}
                    advertiserBuyLimit={Number(daily_buy_limit) - Number(daily_buy)}
                    advertiserPaymentMethods={advertiserPaymentMethods}
                    advertiserSellLimit={Number(daily_sell_limit) - Number(daily_sell)}
                    balanceAvailable={data?.balance_available ?? 0}
                    displayEffectiveRate={displayEffectiveRate}
                    effectiveRate={effectiveRate}
                    isModalOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    paymentMethods={paymentMethods}
                />
            )}
        </div>
    );
});

AdvertsTableRow.displayName = 'AdvertsTableRow';
export default AdvertsTableRow;
