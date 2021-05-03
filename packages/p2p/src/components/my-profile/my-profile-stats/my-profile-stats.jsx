import * as React from 'react';
import { Icon, PopoverMobile, Table, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';

const MyProfileStats = () => {
    const { general_store, my_profile_store } = useStores();
    const [is_statistics_tooltip_open, setIsStatisticsTooltipOpen] = React.useState(false);

    const {
        daily_buy,
        daily_buy_limit,
        daily_sell,
        daily_sell_limit,
        total_orders_count,
    } = my_profile_store.advertiser_info;

    return (
        <Table>
            <Table.Row className='my-profile-stats'>
                <Table.Cell className='my-profile-stats__cell'>
                    <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                        <Localize i18n_default_text='Total orders' />
                    </Text>
                    <Text color='prominent' weight='bold' line_height='l' as='p' size={isMobile() ? 'xs' : 's'}>
                        {total_orders_count || '-'}
                    </Text>
                </Table.Cell>
                {isMobile() ? (
                    <Table.Cell className='my-profile-stats__cell'>
                        <Text size='xxxs' color='less-prominent' line_height='m' as='p'>
                            <Localize
                                i18n_default_text='Buy / Sell ({{currency}})'
                                values={{ currency: general_store.client.currency }}
                            />
                        </Text>
                        <Text color='prominent' weight='bold' line_height='l' as='p' size='xs'>
                            {daily_buy || '-'}/{daily_sell || '-'}
                        </Text>
                    </Table.Cell>
                ) : (
                    <React.Fragment>
                        <Table.Cell className='my-profile-stats__cell'>
                            <Text size='xs' color='less-prominent' line_height='m' as='p'>
                                <Localize
                                    i18n_default_text='Buy ({{currency}})'
                                    values={{ currency: general_store.client.currency }}
                                />
                            </Text>
                            <Text color='prominent' weight='bold' line_height='l' as='p'>
                                {daily_buy || '0'}
                            </Text>
                        </Table.Cell>
                        <Table.Cell className='my-profile-stats__cell'>
                            <Text size='xs' color='less-prominent' line_height='m' as='p'>
                                <Localize
                                    i18n_default_text='Sell ({{currency}})'
                                    values={{ currency: general_store.client.currency }}
                                />
                            </Text>
                            <Text color='prominent' weight='bold' line_height='l' as='p'>
                                {daily_sell || '-'}
                            </Text>
                        </Table.Cell>
                    </React.Fragment>
                )}
                <Table.Cell className='my-profile-stats__cell'>
                    <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                        <Localize
                            i18n_default_text='Buy / Sell limit ({{currency}})'
                            values={{ currency: general_store.client.currency }}
                        />
                    </Text>
                    <Text color='prominent' weight='bold' line_height='m' as='p' size={isMobile() ? 'xs' : 's'}>
                        {daily_buy_limit && daily_sell_limit
                            ? `${Math.floor(daily_buy_limit)} / ${Math.floor(daily_sell_limit)}`
                            : '-'}
                    </Text>
                </Table.Cell>
                <div className='my-profile-stats__popover'>
                    <PopoverMobile
                        className='my-profile__stats-popover'
                        button_text={localize('Got it')}
                        is_open={is_statistics_tooltip_open}
                        message={localize(
                            'These fields are based on activities since 00:00 GMT: Buy, Sell, and Buy/Sell limit.'
                        )}
                        setIsOpen={setIsStatisticsTooltipOpen}
                    >
                        <Icon icon='IcInfoOutline' size={16} />
                    </PopoverMobile>
                </div>
            </Table.Row>
        </Table>
    );
};

export default observer(MyProfileStats);
