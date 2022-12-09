import * as React from 'react';
import { Button, Money, Table, Text } from '@deriv/components';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { observer } from 'mobx-react-lite';

const MyProfileDetailsTable = () => {
    const { general_store, my_profile_store } = useStores();

    const { daily_buy_limit, daily_sell_limit, upgradable_band_limit } = general_store.advertiser_info;
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
            {upgradable_band_limit && (
                <Text as='div' color='less-prominent' line-height='l' size='xxs'>
                    <Localize
                        i18n_default_text='Want to increase your daily limits to <0>{{max_daily_buy}}</0> for buy and <1>{{max_daily_sell}}</1> for sell? <2>Increase my limits<2>'
                        components={[
                            <strong key={0} />,
                            <strong key={1} />,
                            <Button
                                key={2}
                                onClick={() => {
                                    my_profile_store.setIsDailyLimitModalOpen(true);
                                }}
                                small
                                tertiary
                            />,
                        ]}
                        values={{
                            max_daily_buy: upgradable_band_limit.max_daily_buy,
                            max_daily_sell: upgradable_band_limit.max_daily_sell,
                        }}
                    />
                </Text>
            )}
        </div>
    );
};

export default observer(MyProfileDetailsTable);
