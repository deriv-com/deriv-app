import * as React from 'react';
import { Button, Money, Table, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { observer } from 'mobx-react-lite';

const MyProfileDetailsTable = () => {
    const { general_store, my_profile_store } = useStores();

    const { daily_buy_limit, daily_sell_limit, upgradable_daily_limits } = general_store.advertiser_info;
    const { advertiser_buy_limit, advertiser_sell_limit, client } = general_store;

    return (
        <div>
            <div className='my-profile-details-table'>
                <Table>
                    <Table.Head>
                        <Text color='prominent' size='xs'>
                            <Localize i18n_default_text='Buy' />
                        </Text>
                    </Table.Head>
                    <Table.Row className='my-profile-details-table--row'>
                        <Table.Cell className='my-profile-details-table--cell'>
                            <Text color='less-prominent' size='xs'>
                                <Localize i18n_default_text='Daily limit' />
                            </Text>
                            <Text color='prominent' size='xs' weight='bold'>
                                <Money amount={daily_buy_limit} currency={client.currency} show_currency />
                            </Text>
                        </Table.Cell>
                        <Table.Cell className='my-profile-details-table--cell'>
                            <Text color='less-prominent' size='xs'>
                                <Localize i18n_default_text='Available' />
                            </Text>
                            <Text color='prominent' size='xs' weight='bold'>
                                <Money amount={advertiser_buy_limit} currency={client.currency} show_currency />
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                </Table>
                <Table>
                    <Table.Head>
                        <Text color='prominent' size='xs'>
                            <Localize i18n_default_text='Sell' />
                        </Text>
                    </Table.Head>
                    <Table.Row className='my-profile-details-table--row'>
                        <Table.Cell className='my-profile-details-table--cell'>
                            <Text color='less-prominent' size='xs'>
                                <Localize i18n_default_text='Daily limit' />
                            </Text>
                            <Text color='prominent' size='xs' weight='bold'>
                                <Money amount={daily_sell_limit} currency={client.currency} show_currency />
                            </Text>
                        </Table.Cell>
                        <Table.Cell className='my-profile-details-table--cell'>
                            <Text color='less-prominent' size='xs'>
                                <Localize i18n_default_text='Available' />
                            </Text>
                            <Text color='prominent' size='xs' weight='bold'>
                                <Money
                                    amount={advertiser_sell_limit}
                                    currency={general_store.client.currency}
                                    show_currency
                                />
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                </Table>
            </div>
            {upgradable_daily_limits && (
                <Text as='div' className='my-profile-details-table--limit'>
                    <Text color='less-prominent' line-height='l' size='xxs'>
                        <Localize
                            i18n_default_text='Want to increase your daily limits to <0>{{max_daily_buy}} {{currency}}</0> (buy) and <1>{{max_daily_sell}} {{currency}}</1> (sell)?'
                            components={[<strong key={0} />, <strong key={1} />]}
                            values={{
                                currency: client.currency,
                                max_daily_buy: formatMoney(
                                    client.currency,
                                    upgradable_daily_limits.max_daily_buy,
                                    true
                                ),
                                max_daily_sell: formatMoney(
                                    client.currency,
                                    upgradable_daily_limits.max_daily_sell,
                                    true
                                ),
                            }}
                        />
                    </Text>
                    <Button
                        onClick={() => {
                            my_profile_store.setIsDailyLimitModalOpen(true);
                        }}
                        small
                        tertiary
                    >
                        <Localize i18n_default_text='Increase my limits' />
                    </Button>
                </Text>
            )}
        </div>
    );
};

export default observer(MyProfileDetailsTable);
