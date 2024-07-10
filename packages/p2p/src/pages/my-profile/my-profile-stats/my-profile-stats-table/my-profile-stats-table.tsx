import React from 'react';
import { Money, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { getTextSize } from 'Utils/responsive';

const MyProfileStatsTable = () => {
    const {
        client: { currency },
    } = useStore();
    const { isMobile } = useDevice();

    const { general_store } = useStores();

    const {
        buy_completion_rate,
        buy_orders_amount,
        buy_orders_count = 0,
        buy_time_avg,
        partner_count,
        release_time_avg,
        sell_completion_rate,
        sell_orders_amount,
        sell_orders_count = 0,
        total_orders_count = 0,
        total_turnover,
    } = general_store.advertiser_info;

    const [show_lifetime_turnover_value, setShowLifetimeTurnoverValue] = React.useState(false);
    const [show_lifetime_order_value, setShowLifetimeOrderValue] = React.useState(false);

    const avg_buy_time_in_minutes = buy_time_avg > 60 ? Math.round(buy_time_avg / 60) : '1';
    const avg_release_time_in_minutes = release_time_avg > 60 ? Math.round(release_time_avg / 60) : '1';
    const textSize = getTextSize('xxxs', 'xs', isMobile);

    const TextItalic = (
        <Text key={0} className='my-profile-stats-table--italic' color='less-prominent' size={textSize} />
    );

    const stats_strings = [
        {
            text_1: <Localize i18n_default_text='Buy completion  <0>30d</0>' components={[TextItalic]} />,
            text_2: buy_completion_rate ? `${buy_completion_rate}% (${buy_orders_count})` : '-',
        },
        {
            text_1: <Localize i18n_default_text='Sell completion  <0>30d</0>' components={[TextItalic]} />,
            text_2: sell_completion_rate ? `${sell_completion_rate}% (${sell_orders_count})` : '-',
        },
        {
            text_1: <Localize i18n_default_text='Avg pay time  <0>30d</0>' components={[TextItalic]} />,
            text_2: buy_time_avg ? (
                <span>
                    {avg_buy_time_in_minutes === '1' && '< '}
                    <Localize
                        i18n_default_text='{{avg_buy_time_in_minutes}} min'
                        values={{ avg_buy_time_in_minutes }}
                    />
                </span>
            ) : (
                '-'
            ),
        },
        {
            text_1: <Localize i18n_default_text='Avg release time  <0>30d</0>' components={[TextItalic]} />,
            text_2: release_time_avg ? (
                <span>
                    {avg_release_time_in_minutes === '1' && '< '}
                    <Localize
                        i18n_default_text='{{avg_release_time_in_minutes}} min'
                        values={{ avg_release_time_in_minutes }}
                    />
                </span>
            ) : (
                '-'
            ),
        },
        {
            text_1: (
                <Localize
                    i18n_default_text='Trade volume  <0>30d</0> | <1>lifetime</1>'
                    components={[
                        <Text
                            className='my-profile-stats-table--pointer'
                            color={show_lifetime_turnover_value ? 'loss-danger' : 'less-prominent'}
                            key={0}
                            onClick={() => setShowLifetimeTurnoverValue(!show_lifetime_turnover_value)}
                            size={textSize}
                        />,
                        <Text
                            className='my-profile-stats-table--pointer'
                            color={show_lifetime_turnover_value ? 'less-prominent' : 'loss-danger'}
                            key={0}
                            onClick={() => setShowLifetimeTurnoverValue(!show_lifetime_turnover_value)}
                            size={textSize}
                        />,
                    ]}
                />
            ),
            text_2: show_lifetime_turnover_value ? (
                <Money amount={total_turnover} currency={currency} show_currency />
            ) : (
                <Money
                    amount={Number(buy_orders_amount) + Number(sell_orders_amount)}
                    currency={currency}
                    show_currency
                />
            ),
        },
        {
            text_1: (
                <Localize
                    i18n_default_text='Total orders  <0>30d</0> | <1>lifetime</1>'
                    components={[
                        <Text
                            key={0}
                            className='my-profile-stats-table--pointer'
                            color={show_lifetime_order_value ? 'loss-danger' : 'less-prominent'}
                            onClick={() => setShowLifetimeOrderValue(!show_lifetime_order_value)}
                            size={textSize}
                        />,
                        <Text
                            key={0}
                            className='my-profile-stats-table--pointer'
                            color={show_lifetime_order_value ? 'less-prominent' : 'loss-danger'}
                            onClick={() => setShowLifetimeOrderValue(!show_lifetime_order_value)}
                            size={textSize}
                        />,
                    ]}
                />
            ),
            text_2: show_lifetime_order_value
                ? total_orders_count
                : Number(buy_orders_count) + Number(sell_orders_count),
        },
        {
            text_1: <Localize i18n_default_text='Trade partners' />,
            text_2: partner_count || '0',
        },
    ];

    return (
        <div className='my-profile-stats-table'>
            {stats_strings.map((stat_string, key) => (
                <div className='my-profile-stats-table__cell' key={key}>
                    <Text as='p' color='less-prominent' size={textSize}>
                        {stat_string.text_1}
                    </Text>
                    <Text as='p' color='prominent' size='xs' weight='bold'>
                        {stat_string.text_2}
                    </Text>
                </div>
            ))}
        </div>
    );
};

export default observer(MyProfileStatsTable);
