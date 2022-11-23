import * as React from 'react';
import { Money, Table, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const MyProfileStatsTable = () => {
    const { general_store } = useStores();

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
        total_orders_count,
        total_turnover,
    } = general_store.advertiser_info;

    const [show_lifetime_turnover_value, setShowLifetimeTurnoverValue] = React.useState(false);
    const [show_lifetime_order_value, setShowLifetimeOrderValue] = React.useState(false);

    const avg_buy_time_in_minutes = buy_time_avg > 60 ? Math.round(buy_time_avg / 60) : '< 1';
    const avg_release_time_in_minutes = release_time_avg > 60 ? Math.round(release_time_avg / 60) : '< 1';

    if (isMobile()) {
        return (
            <React.Fragment>
                <Table>
                    <Table.Row className='my-profile-stats-table--mobile'>
                        <Table.Cell className='my-profile-stats-table__cell'>
                            <Text as='p' color='less-prominent' line_height='m' size='xxxs'>
                                <Localize
                                    i18n_default_text='Buy completion  <0>30d</0>'
                                    components={[
                                        <Text
                                            key={0}
                                            className='my-profile-stats-table--italic'
                                            color='less-prominent'
                                            size='xxxs'
                                        />,
                                    ]}
                                />
                            </Text>
                            <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                                {buy_completion_rate ? `${buy_completion_rate}% (${buy_orders_count})` : '-'}
                            </Text>
                        </Table.Cell>
                        <Table.Cell className='my-profile-stats-table__cell'>
                            <Text as='p' color='less-prominent' line_height='m' size='xxxs'>
                                <Localize
                                    i18n_default_text='Avg pay time  <0>30d</0>'
                                    components={[
                                        <Text
                                            key={0}
                                            className='my-profile-stats-table--italic'
                                            color='less-prominent'
                                            size='xxxs'
                                        />,
                                    ]}
                                />
                            </Text>
                            <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                                {buy_time_avg
                                    ? localize('{{- avg_buy_time_in_minutes}} min', {
                                          avg_buy_time_in_minutes,
                                      })
                                    : '-'}
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row className='my-profile-stats-table--mobile'>
                        <Table.Cell className='my-profile-stats-table__cell'>
                            <Text as='p' color='less-prominent' line_height='m' size='xxxs'>
                                <Localize
                                    i18n_default_text='Sell completion  <0>30d</0>'
                                    components={[
                                        <Text
                                            key={0}
                                            className='my-profile-stats-table--italic'
                                            color='less-prominent'
                                            size='xxxs'
                                        />,
                                    ]}
                                />
                            </Text>
                            <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                                {sell_completion_rate ? `${sell_completion_rate}% (${sell_orders_count})` : '-'}
                            </Text>
                        </Table.Cell>
                        <Table.Cell className='my-profile-stats-table__cell'>
                            <Text as='p' color='less-prominent' line_height='m' size='xxxs'>
                                <Localize
                                    i18n_default_text='Avg release time  <0>30d</0>'
                                    components={[
                                        <Text
                                            key={0}
                                            className='my-profile-stats-table--italic'
                                            color='less-prominent'
                                            size='xxxs'
                                        />,
                                    ]}
                                />
                            </Text>
                            <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                                {release_time_avg
                                    ? localize('{{- avg_release_time_in_minutes}} min', {
                                          avg_release_time_in_minutes,
                                      })
                                    : '-'}
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row className='my-profile-stats-table--mobile'>
                        <Table.Cell className='my-profile-stats-table__cell'>
                            <Text as='p' color='less-prominent' line_height='m' size='xs'>
                                <Localize
                                    i18n_default_text='Trade volume  <0>30d</0> | <1>lifetime</1>'
                                    components={[
                                        <Text
                                            key={0}
                                            className='my-profile-stats-table--pointer'
                                            color={show_lifetime_turnover_value ? 'loss-danger' : 'less-prominent'}
                                            onClick={() => setShowLifetimeTurnoverValue(!show_lifetime_turnover_value)}
                                            size='xxxs'
                                        />,
                                        <Text
                                            key={0}
                                            className='my-profile-stats-table--pointer'
                                            color={show_lifetime_turnover_value ? 'less-prominent' : 'loss-danger'}
                                            onClick={() => setShowLifetimeTurnoverValue(!show_lifetime_turnover_value)}
                                            size='xxxs'
                                        />,
                                    ]}
                                />
                            </Text>
                            <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                                {show_lifetime_turnover_value ? (
                                    <Money
                                        amount={total_turnover}
                                        currency={general_store.client.currency}
                                        show_currency
                                    />
                                ) : (
                                    <Money
                                        amount={Number(buy_orders_amount) + Number(sell_orders_amount)}
                                        currency={general_store.client.currency}
                                        show_currency
                                    />
                                )}
                            </Text>
                        </Table.Cell>
                        <Table.Cell className='my-profile-stats-table__cell'>
                            <Text as='p' color='less-prominent' line_height='m' size='xxxs'>
                                <Localize i18n_default_text='Trade partners' />
                            </Text>
                            <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                                {partner_count || '0'}
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row className='my-profile-stats-table--mobile'>
                        <Table.Cell className='my-profile-stats-table__cell'>
                            <Text as='p' color='less-prominent' line_height='m' size='xxxs'>
                                <Localize
                                    i18n_default_text='Total orders  <0>30d</0> | <1>lifetime</1>'
                                    components={[
                                        <Text
                                            key={0}
                                            className='my-profile-stats-table--pointer'
                                            color={show_lifetime_order_value ? 'loss-danger' : 'less-prominent'}
                                            onClick={() => setShowLifetimeOrderValue(!show_lifetime_order_value)}
                                            size='xxxs'
                                        />,
                                        <Text
                                            key={0}
                                            className='my-profile-stats-table--pointer'
                                            color={show_lifetime_order_value ? 'less-prominent' : 'loss-danger'}
                                            onClick={() => setShowLifetimeOrderValue(!show_lifetime_order_value)}
                                            size='xxxs'
                                        />,
                                    ]}
                                />
                            </Text>
                            <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                                {show_lifetime_order_value
                                    ? total_orders_count
                                    : Number(buy_orders_count) + Number(sell_orders_count)}
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                </Table>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Table>
                <Table.Row className='my-profile-stats-table'>
                    <Table.Cell className='my-profile-stats-table__cell'>
                        <Text as='p' color='less-prominent' line_height='m' size='xs'>
                            <Localize
                                i18n_default_text='Buy completion  <0>30d</0>'
                                components={[
                                    <Text
                                        key={0}
                                        className='my-profile-stats-table--italic'
                                        color='less-prominent'
                                        size='xs'
                                    />,
                                ]}
                            />
                        </Text>
                        <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                            {buy_completion_rate ? `${buy_completion_rate}% (${buy_orders_count})` : '-'}
                        </Text>
                    </Table.Cell>
                    <Table.Cell className='my-profile-stats-table__cell'>
                        <Text as='p' color='less-prominent' line_height='m' size='xs'>
                            <Localize
                                i18n_default_text='Sell completion  <0>30d</0>'
                                components={[
                                    <Text
                                        key={0}
                                        className='my-profile-stats-table--italic'
                                        color='less-prominent'
                                        size='xs'
                                    />,
                                ]}
                            />
                        </Text>
                        <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                            {sell_completion_rate ? `${sell_completion_rate}% (${sell_orders_count})` : '-'}
                        </Text>
                    </Table.Cell>
                    <Table.Cell className='my-profile-stats-table__cell'>
                        <Text as='p' color='less-prominent' line_height='m' size='xs'>
                            <Localize
                                i18n_default_text='Avg pay time  <0>30d</0>'
                                components={[
                                    <Text
                                        key={0}
                                        className='my-profile-stats-table--italic'
                                        color='less-prominent'
                                        size='xs'
                                    />,
                                ]}
                            />
                        </Text>
                        <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                            {buy_time_avg
                                ? localize('{{- avg_buy_time_in_minutes}} min', {
                                      avg_buy_time_in_minutes,
                                  })
                                : '-'}
                        </Text>
                    </Table.Cell>
                    <Table.Cell className='my-profile-stats-table__cell'>
                        <Text as='p' color='less-prominent' line_height='m' size='xs'>
                            <Localize
                                i18n_default_text='Avg release time  <0>30d</0>'
                                components={[
                                    <Text
                                        key={0}
                                        className='my-profile-stats-table--italic'
                                        color='less-prominent'
                                        size='xs'
                                    />,
                                ]}
                            />
                        </Text>
                        <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                            {release_time_avg
                                ? localize('{{- avg_release_time_in_minutes}} min', {
                                      avg_release_time_in_minutes,
                                  })
                                : '-'}
                        </Text>
                    </Table.Cell>
                </Table.Row>
            </Table>
            <Table className='my-profile-stats-table--second'>
                <Table.Row className='my-profile-stats-table'>
                    <Table.Cell className='my-profile-stats-table__cell'>
                        <Text as='p' color='less-prominent' line_height='m' size='xs'>
                            <Localize
                                i18n_default_text='Trade volume  <0>30d</0> | <1>lifetime</1>'
                                components={[
                                    <Text
                                        key={0}
                                        className='my-profile-stats-table--pointer'
                                        color={show_lifetime_turnover_value ? 'loss-danger' : 'less-prominent'}
                                        onClick={() => setShowLifetimeTurnoverValue(!show_lifetime_turnover_value)}
                                        size='xs'
                                    />,
                                    <Text
                                        key={0}
                                        className='my-profile-stats-table--pointer'
                                        color={show_lifetime_turnover_value ? 'less-prominent' : 'loss-danger'}
                                        onClick={() => setShowLifetimeTurnoverValue(!show_lifetime_turnover_value)}
                                        size='xs'
                                    />,
                                ]}
                            />
                        </Text>
                        <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                            {show_lifetime_turnover_value ? (
                                <Money amount={total_turnover} currency={general_store.client.currency} show_currency />
                            ) : (
                                <Money
                                    amount={Number(buy_orders_amount) + Number(sell_orders_amount)}
                                    currency={general_store.client.currency}
                                    show_currency
                                />
                            )}
                        </Text>
                    </Table.Cell>
                    <Table.Cell className='my-profile-stats-table__cell'>
                        <Text as='p' color='less-prominent' line_height='m' size='xs'>
                            <Localize
                                i18n_default_text='Total orders  <0>30d</0> | <1>lifetime</1>'
                                components={[
                                    <Text
                                        key={0}
                                        className='my-profile-stats-table--pointer'
                                        color={show_lifetime_order_value ? 'loss-danger' : 'less-prominent'}
                                        onClick={() => setShowLifetimeOrderValue(!show_lifetime_order_value)}
                                        size='xs'
                                    />,
                                    <Text
                                        key={0}
                                        className='my-profile-stats-table--pointer'
                                        color={show_lifetime_order_value ? 'less-prominent' : 'loss-danger'}
                                        onClick={() => setShowLifetimeOrderValue(!show_lifetime_order_value)}
                                        size='xs'
                                    />,
                                ]}
                            />
                        </Text>
                        <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                            {show_lifetime_order_value
                                ? total_orders_count
                                : Number(buy_orders_count) + Number(sell_orders_count)}
                        </Text>
                    </Table.Cell>
                    <Table.Cell className='my-profile-stats-table__cell'>
                        <Text as='p' color='less-prominent' line_height='m' size='xs'>
                            <Localize i18n_default_text='Trade partners' />
                        </Text>
                        <Text as='p' color='prominent' line_height='m' size='xs' weight='bold'>
                            {partner_count || '0'}
                        </Text>
                    </Table.Cell>
                </Table.Row>
            </Table>
        </React.Fragment>
    );
};

export default observer(MyProfileStatsTable);
