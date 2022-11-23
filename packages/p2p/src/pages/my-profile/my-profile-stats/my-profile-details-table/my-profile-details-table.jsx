import * as React from 'react';
import { Money, Table, Text } from '@deriv/components';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { observer } from 'mobx-react-lite';

const MyProfileDetailsTable = () => {
    const { general_store } = useStores();

    const { daily_buy_limit, daily_sell_limit } = general_store.advertiser_info;
    const { advertiser_buy_limit, advertiser_sell_limit, client } = general_store;

    return (
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
    );
};

export default observer(MyProfileDetailsTable);
