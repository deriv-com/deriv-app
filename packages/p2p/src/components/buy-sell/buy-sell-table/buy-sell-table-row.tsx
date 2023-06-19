import React from 'react';
import classNames from 'classnames';
import { Button, DesktopWrapper, Icon, MobileWrapper, Table, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { buy_sell } from 'Constants/buy-sell';
import { Localize } from 'Components/i18next';
import { OnlineStatusAvatar } from 'Components/online-status';
import StarRating from 'Components/star-rating';
import TradeBadge from 'Components/trade-badge';
import { useStores } from 'Stores';
import { generateEffectiveRate } from 'Utils/format-value';

type TBuySellTableRowProps = {
    row: {
        account_currency: string;
        advertiser_details: {
            completed_orders_count: number;
            id: string;
            is_online: boolean;
            name: string;
            rating_average: number;
            rating_count: number;
        };
        counterparty_type: string;
        effective_rate?: number;
        id: string;
        local_currency: string;
        max_order_amount_limit_display: string;
        min_order_amount_limit_display: string;
        payment_method_names: Array<string>;
        price_display?: string;
        rate_type?: string;
        rate?: number;
    };
};
const BuySellTableRow = ({ row: advert }: TBuySellTableRowProps) => {
    const { buy_sell_store, floating_rate_store, general_store } = useStores();
    const { setSelectedAdvert, setShouldShowVerification, showAdvertiserPage } = buy_sell_store;
    const { exchange_rate } = floating_rate_store;
    const { advertiser_id, is_advertiser, is_barred } = general_store;
    const {
        client: { currency },
    } = useStore();
    const {
        account_currency,
        advertiser_details,
        counterparty_type,
        effective_rate,
        id: advert_id,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit_display,
        payment_method_names,
        price_display,
        rate_type,
        rate,
    } = advert;

    const {
        completed_orders_count,
        id,
        is_online,
        name: advertiser_name,
        rating_average,
        rating_count,
    } = advertiser_details || {};
    const is_my_advert = id === advertiser_id;
    const is_buy_advert = counterparty_type === buy_sell.BUY;
    const rating_average_decimal = rating_average ? Number(rating_average.toFixed(1)) : null;
    const { display_effective_rate } = generateEffectiveRate({
        price: price_display,
        rate_type,
        rate,
        local_currency,
        exchange_rate,
        market_rate: effective_rate,
    });
    const onClickRow = () => {
        if (!is_advertiser) {
            setShouldShowVerification(true);
        } else if (!is_barred) {
            showAdvertiserPage(advert);
        }
    };

    if (advert_id === 'WATCH_THIS_SPACE') {
        // This allows for the sliding animation on the Buy/Sell toggle as it pushes
        // an empty item with an item that holds the same height of the toggle container.
        // Also see: buy-sell-table.jsx
        return <div data-testid='dt_buy_sell_table_empty_row' style={{ height: '140px' }} />;
    }

    if (advert_id === 'NO_MATCH_ROW') {
        // Empty row when there is a search_term but no search_results
        return (
            <div className='buy-sell-table-row__no-match'>
                <Text color='prominent' size='xs'>
                    <Localize i18n_default_text='There are no matching ads.' />
                </Text>
            </div>
        );
    }

    return (
        <React.Fragment>
            <MobileWrapper>
                <div className='buy-sell-table-row'>
                    <div className='buy-sell-table-row__advertiser' onClick={() => onClickRow()}>
                        <OnlineStatusAvatar is_online={is_online} nickname={advertiser_name} size={32} text_size='s' />
                        <div className='buy-sell-table-row__advertiser-name'>
                            <div className='buy-sell-table-row__cell--container__row'>
                                <Text className='buy-sell-table-row__advertiser-name--text' size='xs' weight='bold'>
                                    {advertiser_name}
                                </Text>
                                <TradeBadge trade_count={completed_orders_count} />
                            </div>
                            <div className='buy-sell-table-row__rating'>
                                {!!rating_count && !!rating_average ? (
                                    <StarRating
                                        empty_star_className='buy-sell-table-row__rating--star'
                                        empty_star_icon='IcEmptyStar'
                                        full_star_className='buy-sell-table-row__rating--star'
                                        full_star_icon='IcFullStar'
                                        initial_value={rating_average_decimal}
                                        is_readonly
                                        number_of_stars={5}
                                        should_allow_hover_effect={false}
                                        star_size={14}
                                    />
                                ) : (
                                    <Text color='less-prominent' size='xxs'>
                                        <Localize i18n_default_text='Not rated yet' />
                                    </Text>
                                )}
                            </div>
                        </div>
                        <Icon className='buy-sell-table-row__advertiser-arrow' icon='IcChevronRightBold' />
                    </div>
                    <div className='buy-sell-table-row__information'>
                        <div className='buy-sell-table-row__rate'>
                            <Text as='div' size='xxs'>
                                <Localize i18n_default_text='Rate (1 {{currency}})' values={{ currency }} />
                            </Text>
                            <Text as='div' color='profit-success' weight='bold'>
                                {display_effective_rate} {local_currency}
                            </Text>
                            <Text as='div' color='less-prominent' size='xxs'>
                                <Localize
                                    i18n_default_text='Limits {{ min_order }}–{{ max_order }} {{ currency }}'
                                    values={{
                                        min_order: min_order_amount_limit_display,
                                        max_order: max_order_amount_limit_display,
                                        currency: account_currency,
                                    }}
                                />
                            </Text>
                        </div>
                        <div className='buy-sell-table-row__payment-methods-list'>
                            {payment_method_names ? (
                                payment_method_names.map(payment_method => {
                                    return (
                                        <div className='buy-sell-table-row__payment-method' key={payment_method}>
                                            {payment_method}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className='buy-sell-table-row__payment-method'>-</div>
                            )}
                        </div>
                        {!is_my_advert && (
                            <Button
                                className='buy-sell-table-row__button'
                                is_disabled={is_barred}
                                large
                                onClick={() => setSelectedAdvert(advert)}
                                primary
                            >
                                {is_buy_advert ? (
                                    <Localize
                                        i18n_default_text='Buy {{account_currency}}'
                                        values={{ account_currency }}
                                    />
                                ) : (
                                    <Localize
                                        i18n_default_text='Sell {{account_currency}}'
                                        values={{ account_currency }}
                                    />
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </MobileWrapper>
            <DesktopWrapper>
                <Table.Row className='buy-sell-table-row'>
                    <Table.Cell>
                        <div
                            className={classNames('buy-sell-table-row__cell', {
                                'buy-sell-table-row__cell-hover': !is_barred,
                            })}
                            data-testid='dt_buy_sell_table_row_advertiser'
                            onClick={() => onClickRow()}
                        >
                            <OnlineStatusAvatar
                                is_online={is_online}
                                nickname={advertiser_name}
                                size={24}
                                text_size='xxs'
                            />
                            <div className='buy-sell-table-row__cell--container'>
                                <div className='buy-sell-table-row__cell--container__row'>
                                    <div
                                        className={classNames({
                                            'buy-sell-table-row__name': !is_barred,
                                        })}
                                    >
                                        {advertiser_name}
                                    </div>
                                    <TradeBadge trade_count={completed_orders_count} />
                                </div>
                                <div className='buy-sell-table-row__rating'>
                                    {!!rating_count && !!rating_average ? (
                                        <StarRating
                                            empty_star_className='buy-sell-table-row__rating--star'
                                            empty_star_icon='IcEmptyStar'
                                            full_star_className='buy-sell-table-row__rating--star'
                                            full_star_icon='IcFullStar'
                                            initial_value={rating_average_decimal}
                                            is_readonly
                                            number_of_stars={5}
                                            should_allow_hover_effect={false}
                                            star_size={14}
                                        />
                                    ) : (
                                        <Text color='less-prominent' size='xxs'>
                                            <Localize i18n_default_text='Not rated yet' />
                                        </Text>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Table.Cell>
                    <Table.Cell>
                        {min_order_amount_limit_display} {max_order_amount_limit_display} {account_currency}
                    </Table.Cell>
                    <Table.Cell>
                        <Text color='profit-success' size='xs' weight='bold'>
                            {display_effective_rate} {local_currency}
                        </Text>
                    </Table.Cell>
                    <Table.Cell>
                        <div className='buy-sell-table-row__payment-method'>
                            {payment_method_names ? (
                                payment_method_names.map(payment_method => {
                                    return (
                                        <div className='buy-sell-table-row__payment-method--label' key={payment_method}>
                                            <Text size='xs' line-height='l'>
                                                {payment_method}
                                            </Text>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className='buy-sell-table-row__payment-method--label'>
                                    <Text size='xs' line-height='l'>
                                        -
                                    </Text>
                                </div>
                            )}
                        </div>
                    </Table.Cell>
                    {is_my_advert ? (
                        <Table.Cell />
                    ) : (
                        <Table.Cell className='buy-sell-table-row__button'>
                            <Button is_disabled={is_barred} onClick={() => setSelectedAdvert(advert)} primary small>
                                {is_buy_advert ? (
                                    <Localize
                                        i18n_default_text='Buy {{account_currency}}'
                                        values={{ account_currency }}
                                    />
                                ) : (
                                    <Localize
                                        i18n_default_text='Sell {{account_currency}}'
                                        values={{ account_currency }}
                                    />
                                )}
                            </Button>
                        </Table.Cell>
                    )}
                </Table.Row>
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default observer(BuySellTableRow);
