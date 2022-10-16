import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { HorizontalSwipe, Icon, Popover, ProgressIndicator, Table, Text } from '@deriv/components';
import { isMobile, formatMoney } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import AdStatus from 'Components/my-ads/ad-status.jsx';
import { useStores } from 'Stores';
import { generateEffectiveRate } from 'Utils/format-value';
import AdType from './ad-type.jsx';

const MyAdsRowRenderer = observer(({ row: advert, setAdvert }) => {
    const { floating_rate_store, general_store, my_ads_store, my_profile_store } = useStores();

    const {
        account_currency,
        amount,
        amount_display,
        id,
        is_active,
        local_currency,
        max_order_amount_display,
        min_order_amount_display,
        payment_method_names,
        price_display,
        rate_display,
        rate_type,
        remaining_amount,
        remaining_amount_display,
        type,
    } = advert;

    // Use separate is_advert_active state to ensure value is updated
    const [is_advert_active, setIsAdvertActive] = React.useState(is_active);
    const [is_popover_actions_visible, setIsPopoverActionsVisible] = React.useState(false);
    const amount_dealt = amount - remaining_amount;
    const enable_action_point = floating_rate_store.change_ad_alert && floating_rate_store.rate_type !== rate_type;
    const is_buy_advert = type === buy_sell.BUY;

    const { display_effective_rate } = generateEffectiveRate({
        price: price_display,
        rate_type,
        rate: rate_display,
        local_currency,
        exchange_rate: floating_rate_store.exchange_rate,
    });

    const ad_pause_color = general_store.is_listed && !general_store.is_barred ? 'general' : 'less-prominent';
    const icon_disabled_color =
        (!general_store.is_listed || general_store.is_barred || !is_advert_active) && 'disabled';
    const is_activate_ad_disabled = floating_rate_store.reached_target_date && enable_action_point;

    const onClickActivateDeactivate = () => {
        if (!is_activate_ad_disabled) {
            my_ads_store.onClickActivateDeactivate(id, is_advert_active, setIsAdvertActive);
        }
    };
    const onClickAdd = () => {
        if (general_store.is_listed && !general_store.is_barred) {
            setAdvert(advert);
            my_ads_store.showQuickAddModal(advert);
        }
    };
    const onClickDelete = () => !general_store.is_barred && my_ads_store.onClickDelete(id);
    const onClickEdit = () => !general_store.is_barred && my_ads_store.onClickEdit(id, rate_type);
    const onClickSwitchAd = () => !general_store.is_barred && my_ads_store.setIsSwitchModalOpen(true, id);
    const onMouseEnter = () => setIsPopoverActionsVisible(true);
    const onMouseLeave = () => setIsPopoverActionsVisible(false);

    const handleOnEdit = () =>
        enable_action_point && floating_rate_store.rate_type !== rate_type ? onClickSwitchAd() : onClickEdit();

    React.useEffect(() => {
        my_profile_store.getAdvertiserPaymentMethods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isMobile()) {
        return (
            <HorizontalSwipe
                is_left_swipe
                right_hidden_component={
                    <React.Fragment>
                        <div className='p2p-my-ads__table-popovers__edit' onClick={handleOnEdit}>
                            <Icon custom_color='var(--general-main-1)' icon='IcEdit' />
                        </div>
                        <div
                            onClick={onClickActivateDeactivate}
                            className={classNames(
                                `p2p-my-ads__table-popovers__${is_advert_active ? 'activate' : 'deactivate'}`,
                                {
                                    'p2p-my-ads__table-popovers--disable':
                                        general_store.is_barred || is_activate_ad_disabled,
                                }
                            )}
                        >
                            <Icon
                                icon={`${is_advert_active && !general_store.is_barred ? 'IcArchive' : 'IcUnarchive'}`}
                                custom_color={'var(--general-main-1)'}
                            />
                        </div>

                        <div className='p2p-my-ads__table-popovers__delete'>
                            <Icon icon='IcDelete' custom_color='var(--general-main-1)' onClick={onClickDelete} />
                        </div>
                    </React.Fragment>
                }
                right_hidden_component_width='18rem'
                visible_component={
                    <Table.Row
                        className={classNames('p2p-my-ads__table-row', {
                            'p2p-my-ads__table-row-disabled': !is_advert_active,
                        })}
                    >
                        <Text color='less-prominent' line_height='m' size='xxs'>
                            <Localize i18n_default_text='Ad ID {{advert_id}} ' values={{ advert_id: id }} />
                        </Text>
                        <div className='p2p-my-ads__table-row__type-and-status'>
                            <Text color={ad_pause_color} line_height='m' size='s' weight='bold'>
                                <Localize
                                    i18n_default_text='{{ad_type}} {{ account_currency }}'
                                    values={{ account_currency, ad_type: is_buy_advert ? 'Buy' : 'Sell' }}
                                />
                            </Text>
                            {enable_action_point ? (
                                <div className='p2p-my-ads__table-status-warning'>
                                    <div style={{ marginRight: '0.8rem' }}>
                                        <AdStatus is_active={!!is_advert_active && !general_store.is_barred} />
                                    </div>

                                    <Icon icon='IcAlertWarning' />
                                </div>
                            ) : (
                                <AdStatus is_active={!!is_advert_active && !general_store.is_barred} />
                            )}
                        </div>
                        <div className='p2p-my-ads__table-row-details'>
                            <Text color='profit-success' line_height='m' size='xxs'>
                                {`${formatMoney(account_currency, amount_dealt, true)}`} {account_currency}&nbsp;
                                {is_buy_advert ? localize('Bought') : localize('Sold')}
                            </Text>
                            <Text color='less-prominent' line_height='m' size='xxs'>
                                {amount_display} {account_currency}
                            </Text>
                        </div>
                        <ProgressIndicator
                            className={'p2p-my-ads__table-available-progress'}
                            value={amount_dealt}
                            total={amount}
                        />
                        <div className='p2p-my-ads__table-row-details'>
                            <Text color='less-prominent' line_height='m' size='xxs'>
                                <Localize i18n_default_text='Limits' />
                            </Text>
                            <Text color='less-prominent' line_height='m' size='xxs'>
                                <Localize
                                    i18n_default_text='Rate (1 {{account_currency}})'
                                    values={{ account_currency }}
                                />
                            </Text>
                        </div>
                        <div className='p2p-my-ads__table-row-details'>
                            <Text color={ad_pause_color} line_height='m' size='xxs'>
                                {min_order_amount_display} - {max_order_amount_display} {account_currency}
                            </Text>
                            <Text
                                color={
                                    general_store.is_listed && !general_store.is_barred ? 'profit-success' : 'disabled'
                                }
                                line_height='m'
                                size='xs'
                                weight='bold'
                            >
                                <div className='display-layout'>
                                    {display_effective_rate} {local_currency}
                                    {rate_type === ad_type.FLOAT && (
                                        <AdType ad_pause_color={ad_pause_color} float_rate={rate_display} />
                                    )}
                                </div>
                            </Text>
                        </div>
                        <div className='p2p-my-ads__table-row-methods'>
                            {payment_method_names ? (
                                payment_method_names.map((payment_method, key) => {
                                    return (
                                        <div className='p2p-my-ads__table__payment-method--label' key={key}>
                                            <Text color={ad_pause_color} size='xxxs' line-height='l'>
                                                {payment_method}
                                            </Text>
                                        </div>
                                    );
                                })
                            ) : (
                                <div
                                    className={classNames('p2p-my-ads__table-add', {
                                        'p2p-my-ads__table-add--disabled': !general_store.is_listed,
                                    })}
                                    onClick={() => onClickAdd()}
                                >
                                    <Icon color={icon_disabled_color} icon='IcAdd' />
                                    <Text color={ad_pause_color} size='xxs' weight='bold'>
                                        <Localize i18n_default_text='Add' />
                                    </Text>
                                </div>
                            )}
                        </div>
                    </Table.Row>
                }
            />
        );
    }

    return (
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <Table.Row
                className={classNames('p2p-my-ads__table-row', {
                    'p2p-my-ads__table-row-disabled': !is_advert_active,
                })}
            >
                <Table.Cell>
                    <Localize
                        i18n_default_text='{{ad_type}} {{ id }}'
                        values={{ id, ad_type: is_buy_advert ? 'Buy' : 'Sell' }}
                    />
                </Table.Cell>
                <Table.Cell>
                    {min_order_amount_display}-{max_order_amount_display} {account_currency}
                </Table.Cell>
                <Table.Cell className='p2p-my-ads__table-price'>
                    <div className='display-layout'>
                        {display_effective_rate} {local_currency}
                        {rate_type === ad_type.FLOAT && (
                            <AdType ad_pause_color={ad_pause_color} float_rate={rate_display} />
                        )}
                    </div>
                </Table.Cell>
                <Table.Cell className='p2p-my-ads__table-available'>
                    <ProgressIndicator
                        className={'p2p-my-ads__table-available-progress'}
                        value={remaining_amount}
                        total={amount}
                    />
                    <div className='p2p-my-ads__table-available-value'>
                        {remaining_amount_display}/{amount_display} {account_currency}
                    </div>
                </Table.Cell>
                <Table.Cell>
                    <div className='p2p-my-ads__table__payment-method'>
                        {payment_method_names ? (
                            payment_method_names.map((payment_method, key) => {
                                return (
                                    <div className='p2p-my-ads__table__payment-method--label' key={key}>
                                        <Text color={ad_pause_color} size='xs' line-height='l'>
                                            {payment_method}
                                        </Text>
                                    </div>
                                );
                            })
                        ) : (
                            <div
                                className={classNames('p2p-my-ads__table-add', {
                                    'p2p-my-ads__table-add--disabled': !general_store.is_listed,
                                })}
                                onClick={() => onClickAdd()}
                            >
                                <Icon color={icon_disabled_color} icon='IcAdd' />
                                <Text color={ad_pause_color} size='xxs' weight='bold'>
                                    <Localize i18n_default_text='Add' />
                                </Text>
                            </div>
                        )}
                    </div>
                </Table.Cell>
                <Table.Cell>
                    {enable_action_point ? (
                        <div className='p2p-my-ads__table-status-warning'>
                            <AdStatus is_active={!!is_advert_active && !general_store.is_barred} />
                            <Icon icon='IcAlertWarning' size={isMobile() ? 28 : 16} />
                        </div>
                    ) : (
                        <div className='p2p-my-ads__table-status'>
                            <AdStatus is_active={!!is_advert_active && !general_store.is_barred} />
                        </div>
                    )}
                </Table.Cell>
                {is_popover_actions_visible && (
                    <div className='p2p-my-ads__table-popovers'>
                        <div onClick={onClickActivateDeactivate}>
                            <Popover
                                alignment='bottom'
                                className={classNames(
                                    `p2p-my-ads__table-popovers__${is_advert_active ? 'activate' : 'deactivate'}`,
                                    {
                                        'p2p-my-ads__table-popovers--disable':
                                            general_store.is_barred || is_activate_ad_disabled,
                                    }
                                )}
                                message={localize('{{status}}', {
                                    status: is_advert_active && !general_store.is_barred ? 'Deactivate' : 'Activate',
                                })}
                            >
                                <Icon
                                    icon={`${
                                        is_advert_active && !general_store.is_barred ? 'IcArchive' : 'IcUnarchive'
                                    }`}
                                    color={(general_store.is_barred || is_activate_ad_disabled) && 'disabled'}
                                />
                            </Popover>
                        </div>
                        <div onClick={handleOnEdit}>
                            <Popover
                                alignment='bottom'
                                className={classNames('p2p-my-ads__table-popovers__deactivate', {
                                    'p2p-my-ads__table-popovers--disable':
                                        general_store.is_barred || is_activate_ad_disabled,
                                })}
                                message={localize('Edit')}
                            >
                                <Icon icon='IcEdit' color={general_store.is_barred && 'disabled'} />
                            </Popover>
                        </div>
                        <div onClick={onClickDelete}>
                            <Popover
                                alignment='bottom'
                                className={classNames('p2p-my-ads__table-popovers__delete', {
                                    'p2p-my-ads__table-popovers--disable':
                                        general_store.is_barred || is_activate_ad_disabled,
                                })}
                                message={localize('Delete')}
                            >
                                <Icon
                                    icon='IcDelete'
                                    color={
                                        (general_store.is_barred ||
                                            (id === my_ads_store.selected_ad_id &&
                                                my_ads_store.delete_error_message)) &&
                                        'disabled'
                                    }
                                />
                            </Popover>
                        </div>
                    </div>
                )}
            </Table.Row>
        </div>
    );
});

MyAdsRowRenderer.displayName = 'MyAdsRowRenderer';
MyAdsRowRenderer.propTypes = {
    advert: PropTypes.object,
};

export default MyAdsRowRenderer;
