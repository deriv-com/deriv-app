import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Table, Text, Button, Icon } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { buy_sell } from 'Constants/buy-sell';
import { Localize, localize } from 'Components/i18next';
import UserAvatar from 'Components/user/user-avatar';
import { useStores } from 'Stores';
import './buy-sell-row.scss';

const BuySellRow = ({ row: advert }) => {
    const { buy_sell_store, general_store } = useStores();

    if (advert.id === 'WATCH_THIS_SPACE') {
        // This allows for the sliding animation on the Buy/Sell toggle as it pushes
        // an empty item with an item that holds the same height of the toggle container.
        // Also see: buy-sell-table.jsx
        return <div style={{ height: '77px' }} />;
    }

    const {
        account_currency,
        counterparty_type,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit_display,
        price_display,
    } = advert;

    const is_my_advert = advert.advertiser_details.id === general_store.advertiser_id;
    const is_buy_advert = counterparty_type === buy_sell.BUY;
    const { name: advertiser_name } = advert.advertiser_details;

    if (isMobile()) {
        return (
            <div className='buy-sell-row'>
                <div className='buy-sell-row__advertiser' onClick={() => buy_sell_store.showAdvertiserPage(advert)}>
                    <UserAvatar nickname={advertiser_name} size={32} text_size='s' />
                    <div className='buy-sell-row__advertiser-name'>
                        <Text size='xs' line_height='m' color='general' weight='bold'>
                            {advertiser_name}
                        </Text>
                    </div>
                    <Icon className='buy-sell-row__advertiser-arrow' icon='IcChevronRightBold' size={16} />
                </div>
                <div className='buy-sell-row__information'>
                    <div className='buy-sell-row__rate'>
                        <Text as='div' color='general' line_height='m' size='xxs'>
                            <Localize
                                i18n_default_text='Rate (1 {{currency}})'
                                values={{ currency: general_store.client.currency }}
                            />
                        </Text>
                        <Text as='div' color='profit-success' line_height='m' size='s' weight='bold'>
                            {price_display} {local_currency}
                        </Text>
                        <Text as='div' color='general' line_height='m' size='xxs'>
                            <Localize
                                i18n_default_text='Limit {{ min_order }}–{{ max_order }} {{ currency }}'
                                values={{
                                    min_order: min_order_amount_limit_display,
                                    max_order: max_order_amount_limit_display,
                                    currency: account_currency,
                                }}
                            />
                        </Text>
                    </div>
                    {!is_my_advert && (
                        <Button primary large onClick={() => buy_sell_store.setSelectedAdvert(advert)}>
                            {is_buy_advert ? (
                                <Localize i18n_default_text='Buy {{account_currency}}' values={{ account_currency }} />
                            ) : (
                                <Localize i18n_default_text='Sell {{account_currency}}' values={{ account_currency }} />
                            )}
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <Table.Row className='buy-sell__table-row'>
            <Table.Cell>
                <div
                    className={classNames('buy-sell__cell', { 'buy-sell__cell-hover': !general_store.is_barred })}
                    onClick={() => (general_store.is_barred ? undefined : buy_sell_store.showAdvertiserPage(advert))}
                >
                    <UserAvatar nickname={advertiser_name} size={24} text_size='xxs' />
                    <div
                        className={classNames('buy-sell__name', {
                            'buy-sell__name--allow-hover': !general_store.is_barred,
                        })}
                    >
                        {advertiser_name}
                    </div>
                </div>
            </Table.Cell>
            <Table.Cell>
                {min_order_amount_limit_display}&ndash;{max_order_amount_limit_display} {account_currency}
            </Table.Cell>
            <Table.Cell>
                <Text color='profit-success' size='xs' line-height='m' weight='bold'>
                    {price_display} {local_currency}
                </Text>
            </Table.Cell>
            {is_my_advert ? (
                <Table.Cell />
            ) : (
                <Table.Cell className='buy-sell__button'>
                    <Button
                        is_disabled={general_store.is_barred}
                        onClick={() => buy_sell_store.setSelectedAdvert(advert)}
                        primary
                        small
                    >
                        {is_buy_advert
                            ? localize('Buy {{account_currency}}', { account_currency })
                            : localize('Sell {{account_currency}}', { account_currency })}
                    </Button>
                </Table.Cell>
            )}
        </Table.Row>
    );
};

BuySellRow.propTypes = {
    advert: PropTypes.object,
    is_buy: PropTypes.bool,
    setSelectedAdvert: PropTypes.func,
    style: PropTypes.object,
};

export default observer(BuySellRow);
