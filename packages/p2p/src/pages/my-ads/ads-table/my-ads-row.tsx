import React from 'react';
import classNames from 'classnames';
import {
    DesktopWrapper,
    HorizontalSwipe,
    Icon,
    MobileWrapper,
    Popover,
    ProgressIndicator,
    Table,
    Text,
} from '@deriv/components';
import { isMobile, formatMoney } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import AdStatus from 'Pages/my-ads/ad-status';
import { useStores } from 'Stores';
import { TAdDetails } from 'Types';
import { generateEffectiveRate } from 'Utils/format-value';
import AdType from '../ad-type';

const MyAdsRow = observer(({ row: advert }: TAdDetails) => {
    const { floating_rate_store, general_store, my_ads_store, my_profile_store } = useStores();

    const {
        account_currency,
        amount,
        amount_display,
        effective_rate,
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

    const {
        delete_error_message,
        onClickActivateDeactivate: onClickActivateDeactivateAds,
        onClickDelete: onClickDeleteAds,
        onClickEdit: onClickEditAds,
        onToggleSwitchModal,
        selected_ad_id,
        showQuickAddModal,
    } = my_ads_store;
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
        market_rate: effective_rate,
    });

    const { is_listed, is_barred } = general_store;

    const is_ad_listed = is_listed && !is_barred;
    const ad_pause_color = is_ad_listed ? 'general' : 'less-prominent';
    const icon_disabled_color = (!is_listed || is_barred || !is_advert_active) && 'disabled';
    const is_activate_ad_disabled = floating_rate_store.reached_target_date && enable_action_point;

    const onClickActivateDeactivate = () => {
        if (!is_activate_ad_disabled) {
            onClickActivateDeactivateAds(id, is_advert_active, setIsAdvertActive);
        }
    };
    const onClickAdd = () => {
        if (is_ad_listed) {
            showQuickAddModal(advert);
        }
    };
    const onClickDelete = () => !is_barred && onClickDeleteAds(id);
    const onClickEdit = () => !is_barred && onClickEditAds(id, rate_type);
    const onClickSwitchAd = () => {
        if (!is_barred) {
            general_store.showModal({ key: 'MyAdsFloatingRateSwitchModal' });
            onToggleSwitchModal(id);
        }
    };
    const onMouseEnter = () => setIsPopoverActionsVisible(true);
    const onMouseLeave = () => setIsPopoverActionsVisible(false);

    const handleOnEdit = () =>
        enable_action_point && floating_rate_store.rate_type !== rate_type ? onClickSwitchAd() : onClickEdit();

    React.useEffect(() => {
        my_profile_store.getAdvertiserPaymentMethods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPaymentSection = () =>
        payment_method_names ? (
            payment_method_names.map((payment_method, key) => {
                return (
                    <div className='ads-table__payment-method--label' key={key}>
                        <Text color={ad_pause_color} size={isMobile() ? 'xxxs' : 'xs'} line_height='l'>
                            {payment_method}
                        </Text>
                    </div>
                );
            })
        ) : (
            <div
                className={classNames('ads-table__add', {
                    'ads-table__add--disabled': !is_listed,
                })}
                onClick={onClickAdd}
            >
                <Icon color={icon_disabled_color} icon='IcAdd' />
                <Text color={ad_pause_color} size='xxs' weight='bold'>
                    <Localize i18n_default_text='Add' />
                </Text>
            </div>
        );

    const getAdStatus = () => <AdStatus is_active={!!is_advert_active && !is_barred} />;

    const getAdType = () => (
        <div className='display-layout'>
            {display_effective_rate} {local_currency}
            {rate_type === ad_type.FLOAT && <AdType ad_pause_color={ad_pause_color} float_rate={rate_display} />}
        </div>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    <Table.Row
                        className={classNames('ads-table__row', {
                            'ads-table__row-disabled': !is_advert_active,
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
                        <Table.Cell className='ads-table__price'>{getAdType()}</Table.Cell>
                        <Table.Cell className='ads-table__available'>
                            <ProgressIndicator
                                className={'ads-table__available-progress'}
                                value={remaining_amount}
                                total={amount}
                            />
                            <div className='ads-table__available-value'>
                                {remaining_amount_display}/{amount_display} {account_currency}
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            <div className='ads-table__payment-method'>{getPaymentSection()}</div>
                        </Table.Cell>
                        <Table.Cell>
                            {enable_action_point ? (
                                <div className='ads-table__status-warning'>
                                    {getAdStatus()}
                                    <Icon icon='IcAlertWarning' />
                                </div>
                            ) : (
                                <div className='ads-table__status'>{getAdStatus()}</div>
                            )}
                        </Table.Cell>
                        {is_popover_actions_visible && (
                            <div className='ads-table__popovers'>
                                <div onClick={onClickActivateDeactivate} data-testid='dt_activate_deactivate_ad'>
                                    <Popover
                                        alignment='bottom'
                                        className={classNames(
                                            `ads-table__popovers--${is_advert_active ? 'activate' : 'deactivate'}`,
                                            {
                                                'ads-table__popovers--disable': is_barred || is_activate_ad_disabled,
                                            }
                                        )}
                                        message={is_advert_active ? localize('Deactivate') : localize('Activate')}
                                    >
                                        <Icon
                                            icon={`${is_advert_active && !is_barred ? 'IcArchive' : 'IcUnarchive'}`}
                                            color={(is_barred || is_activate_ad_disabled) && 'disabled'}
                                        />
                                    </Popover>
                                </div>
                                <div onClick={handleOnEdit} data-testid='dt_edit_ad'>
                                    <Popover
                                        alignment='bottom'
                                        className={classNames('ads-table__popovers--deactivate', {
                                            'ads-table__popovers--disable': is_barred || is_activate_ad_disabled,
                                        })}
                                        message={localize('Edit')}
                                    >
                                        <Icon icon='IcEdit' color={is_barred && 'disabled'} />
                                    </Popover>
                                </div>
                                <div onClick={onClickDelete} data-testid='dt_delete_ad'>
                                    <Popover
                                        alignment='bottom'
                                        className={classNames('ads-table__popovers-delete', {
                                            'ads-table__popovers--disable': is_barred || is_activate_ad_disabled,
                                        })}
                                        message={localize('Delete')}
                                    >
                                        <Icon
                                            icon='IcDelete'
                                            color={
                                                (is_barred || (id === selected_ad_id && delete_error_message)) &&
                                                'disabled'
                                            }
                                        />
                                    </Popover>
                                </div>
                            </div>
                        )}
                    </Table.Row>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <HorizontalSwipe
                    is_left_swipe
                    right_hidden_component={
                        <React.Fragment>
                            <div className='ads-table__popovers-edit' onClick={handleOnEdit} data-testid='dt_edit_ad'>
                                <Icon custom_color='var(--general-main-1)' icon='IcEdit' />
                            </div>
                            <div
                                data-testid='dt_activate_deactivate_ad'
                                onClick={onClickActivateDeactivate}
                                className={classNames(
                                    `ads-table__popovers--${is_advert_active ? 'activate' : 'deactivate'}`,
                                    {
                                        'ads-table__popovers--disable': is_barred || is_activate_ad_disabled,
                                    }
                                )}
                            >
                                <Icon
                                    icon={`${is_advert_active && !is_barred ? 'IcArchive' : 'IcUnarchive'}`}
                                    custom_color={'var(--general-main-1)'}
                                />
                            </div>

                            <div className='ads-table__popovers-delete' data-testid='dt_delete_ad'>
                                <Icon icon='IcDelete' custom_color='var(--general-main-1)' onClick={onClickDelete} />
                            </div>
                        </React.Fragment>
                    }
                    right_hidden_component_width='18rem'
                    visible_component={
                        <Table.Row
                            className={classNames('ads-table__row', {
                                'ads-table__row-disabled': !is_advert_active,
                            })}
                        >
                            <Text color='less-prominent' size='xxs'>
                                <Localize i18n_default_text='Ad ID {{advert_id}} ' values={{ advert_id: id }} />
                            </Text>
                            <div className='ads-table__row__type-and-status'>
                                <Text color={ad_pause_color} weight='bold'>
                                    <Localize
                                        i18n_default_text='{{ad_type}} {{ account_currency }}'
                                        values={{ account_currency, ad_type: is_buy_advert ? 'Buy' : 'Sell' }}
                                    />
                                </Text>
                                {enable_action_point ? (
                                    <div className='ads-table__status-warning'>
                                        <div style={{ marginRight: '0.8rem' }}>{getAdStatus()}</div>

                                        <Icon icon='IcAlertWarning' />
                                    </div>
                                ) : (
                                    getAdStatus()
                                )}
                            </div>
                            <div className='ads-table__row-details'>
                                <Text color={is_ad_listed ? 'profit-success' : 'less-prominent'} size='xxs'>
                                    {`${formatMoney(account_currency, amount_dealt, true)}`} {account_currency}&nbsp;
                                    {is_buy_advert ? localize('Bought') : localize('Sold')}
                                </Text>
                                <Text color='less-prominent' size='xxs'>
                                    {amount_display} {account_currency}
                                </Text>
                            </div>
                            <ProgressIndicator
                                className={'ads-table__available-progress'}
                                value={amount_dealt}
                                total={amount}
                            />
                            <div className='ads-table__row-details'>
                                <Text color='less-prominent' size='xxs'>
                                    <Localize i18n_default_text='Limits' />
                                </Text>
                                <Text color='less-prominent' size='xxs'>
                                    <Localize
                                        i18n_default_text='Rate (1 {{account_currency}})'
                                        values={{ account_currency }}
                                    />
                                </Text>
                            </div>
                            <div className='ads-table__row-details'>
                                <Text color={ad_pause_color} size='xxs'>
                                    {min_order_amount_display} - {max_order_amount_display} {account_currency}
                                </Text>
                                <Text color={is_ad_listed ? 'profit-success' : 'disabled'} size='xs' weight='bold'>
                                    {getAdType()}
                                </Text>
                            </div>
                            <div className='ads-table__row-methods'>{getPaymentSection()}</div>
                        </Table.Row>
                    }
                />
            </MobileWrapper>
        </React.Fragment>
    );
});

export default MyAdsRow;
