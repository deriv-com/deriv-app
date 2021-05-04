import React from 'react';
import PropTypes from 'prop-types';
import { Icon, PopoverMobile, Table, Text, ThemedScrollbars } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './advertiser-page.scss';

const AdvertiserPageStats = () => {
    const { advertiser_page_store } = useStores();
    const [is_field_info_tooltip_open, setIsFieldInfoTooltipOpen] = React.useState(false);

    const {
        buy_completion_rate,
        buy_orders_count,
        release_time_avg,
        sell_orders_count,
        total_completion_rate,
        total_orders_count,
    } = advertiser_page_store.advertiser_info;

    const avg_release_time_in_minutes = release_time_avg > 60 ? Math.round(release_time_avg / 60) : '< 1';

    return (
        <div className='advertiser-page__stats--wrapper'>
            <Table>
                <ThemedScrollbars
                    className='advertiser-page__horizontal-scroll'
                    is_bypassed={isDesktop()}
                    width='calc(100vw - 32px)'
                    is_only_horizontal
                    is_scrollbar_hidden
                >
                    <Table.Row className='advertiser-page__stats'>
                        <Table.Cell className='advertiser-page__stats-cell'>
                            <Text align='center' color='less-prominent' size='xs' line_height='m'>
                                {localize('Total orders')}
                            </Text>
                            <Text align='center' color='prominent' size='s' weight='bold'>
                                {total_orders_count || '-'}
                            </Text>
                        </Table.Cell>
                        <div className='advertiser-page__stats-cell-separator' />
                        {isMobile() ? (
                            <Table.Cell className='advertiser-page__stats-cell'>
                                <Text align='center' color='less-prominent' size='xs' line_height='m'>
                                    {localize('Buy/Sell')}
                                </Text>
                                <Text align='center' color='prominent' size='s' weight='bold'>
                                    {`${buy_orders_count}/${sell_orders_count}`}
                                </Text>
                            </Table.Cell>
                        ) : (
                            <React.Fragment>
                                <Table.Cell className='advertiser-page__stats-cell'>
                                    <Text align='center' color='less-prominent' size='xs' line_height='m'>
                                        {localize('Buy')}
                                    </Text>
                                    <Text align='center' color='prominent' size='s' weight='bold'>
                                        {buy_orders_count}
                                    </Text>
                                </Table.Cell>
                                <div className='advertiser-page__stats-cell-separator' />
                                <Table.Cell className='advertiser-page__stats-cell'>
                                    <Text align='center' color='less-prominent' size='xs' line_height='m'>
                                        {localize('Sell')}
                                    </Text>
                                    <Text align='center' color='prominent' size='s' weight='bold'>
                                        {sell_orders_count}
                                    </Text>
                                </Table.Cell>
                            </React.Fragment>
                        )}
                        <div className='advertiser-page__stats-cell-separator' />
                        <Table.Cell className='advertiser-page__stats-cell'>
                            <Text align='center' color='less-prominent' size='xs' line_height='m'>
                                {localize('Completion')}
                            </Text>
                            <div className='advertiser-page__stats-cell-completion'>
                                <Text align='center' color='prominent' size='s' weight='bold'>
                                    {total_completion_rate ? `${total_completion_rate}%` : '-'}
                                </Text>
                                <div className='advertiser-page__stats-cell-buy'>
                                    <Text align='center' color='prominent' line_height='m' size='xs'>
                                        {localize('(Buy {{- buy_completion_rate }})', {
                                            buy_completion_rate: buy_completion_rate
                                                ? `${buy_completion_rate}%`
                                                : localize('N/A'),
                                        })}
                                    </Text>
                                </div>
                            </div>
                        </Table.Cell>
                        <div className='advertiser-page__stats-cell-separator' />
                        <Table.Cell className='advertiser-page__stats-cell'>
                            <Text align='center' color='less-prominent' size='xs' line_height='m'>
                                {localize('Avg. release time')}
                            </Text>
                            <Text align='center' color='prominent' size='s' weight='bold'>
                                {release_time_avg
                                    ? localize('{{- avg_release_time_in_minutes}} min', {
                                          avg_release_time_in_minutes,
                                      })
                                    : '-'}
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                </ThemedScrollbars>
            </Table>
            <PopoverMobile
                button_text={localize('Got it')}
                className='advertiser-page__popover-icon'
                is_open={is_field_info_tooltip_open}
                message={
                    <Text color='prominent' line_height='m' size='xs'>
                        <Localize i18n_default_text="These fields are based on the last 30 days' activity: Buy, Sell, Completion, and Avg. release time." />
                    </Text>
                }
                setIsOpen={setIsFieldInfoTooltipOpen}
            >
                <Icon icon='IcInfoOutline' size={16} />
            </PopoverMobile>
        </div>
    );
};

AdvertiserPageStats.propTypes = {
    is_visible: PropTypes.bool,
};

export default observer(AdvertiserPageStats);
