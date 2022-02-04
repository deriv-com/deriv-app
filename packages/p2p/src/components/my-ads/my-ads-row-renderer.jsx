import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    Button,
    HorizontalSwipe,
    Icon,
    MobileFullPageModal,
    Modal,
    Popover,
    ProgressIndicator,
    Table,
    Text,
} from '@deriv/components';
import { isMobile, formatMoney } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import AdStatus from 'Components/my-ads/ad-status.jsx';
import { useStores } from 'Stores';
import CreateAdFormPaymentMethods from './create-ad-form-payment-methods.jsx';

const MyAdsRowRenderer = observer(({ row: advert }) => {
    const { general_store, my_ads_store, my_profile_store } = useStores();

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
        remaining_amount,
        remaining_amount_display,
        type,
    } = advert;

    // Use separate is_advert_active state to ensure value is updated
    const [is_advert_active, setIsAdvertActive] = React.useState(is_active);
    const [is_popover_actions_visible, setIsPopoverActionsVisible] = React.useState(false);
    const [selected_methods, setSelectedMethods] = React.useState([]);
    const [should_show_add_new_payment_method_form, setShouldShowAddNewPaymentMethodForm] = React.useState(false);

    const amount_dealt = amount - remaining_amount;
    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
    };

    const onClickActivateDeactivate = () => {
        my_ads_store.onClickActivateDeactivate(id, is_advert_active, setIsAdvertActive);
    };
    const onClickDelete = () => !general_store.is_barred && my_ads_store.onClickDelete(id);
    const onClickEdit = () => !general_store.is_barred && my_ads_store.onClickEdit(id);
    const onMouseEnter = () => setIsPopoverActionsVisible(true);
    const onMouseLeave = () => setIsPopoverActionsVisible(false);

    const onClickPaymentMethodCard = payment_method => {
        if (!my_ads_store.payment_method_ids.includes(payment_method.ID)) {
            my_ads_store.payment_method_ids.push(payment_method.ID);
            setSelectedMethods([...selected_methods, payment_method.ID]);
        } else {
            my_ads_store.payment_method_ids = my_ads_store.payment_method_ids.filter(
                payment_method_id => payment_method_id !== payment_method.ID
            );
            setSelectedMethods(selected_methods.filter(i => i !== payment_method.ID));
        }
    };

    if (isMobile()) {
        return (
            <>
                <MobileFullPageModal
                    body_className='buy-sell__modal-body'
                    className='buy-sell__modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open={my_profile_store.should_show_add_payment_method_form}
                    page_header_className='buy-sell__modal-header'
                    page_header_text={localize('Choose payment method')}
                    pageHeaderReturnFn={() => my_profile_store.setShouldShowAddPaymentMethodForm(false)}
                    renderPageFooterChildren={() => (
                        <>
                            <Button
                                has_effect
                                large
                                onClick={() => my_profile_store.setShouldShowAddPaymentMethodForm(false)}
                                secondary
                                text={localize('Cancel')}
                            />
                            <Button
                                has_effect
                                large
                                onClick={() => my_ads_store.onClickUpdatePaymentMethods(id)}
                                primary
                                text={localize('Add')}
                            />
                        </>
                    )}
                    page_footer_className='buy-sell__modal-footer'
                >
                    <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                    {should_show_add_new_payment_method_form ? (
                        <AddPaymentMethodForm />
                    ) : (
                        my_profile_store.advertiser_payment_methods_list.map((payment_method, key) => (
                            <>
                                <PaymentMethodCard
                                    is_vertical_ellipsis_visible={false}
                                    key={key}
                                    large
                                    onClick={() => onClickPaymentMethodCard(payment_method)}
                                    payment_method={payment_method}
                                    style={selected_methods.includes(payment_method.ID) ? style : {}}
                                />
                                <PaymentMethodCard
                                    is_add={true}
                                    label={localize('Payment method')}
                                    large
                                    onClickAdd={() => setShouldShowAddNewPaymentMethodForm(true)}
                                />
                            </>
                        ))
                    )}
                </MobileFullPageModal>
                <HorizontalSwipe
                    is_left_swipe
                    right_hidden_component={
                        <React.Fragment>
                            {!is_advert_active && (
                                <div className='p2p-my-ads__table-popovers__edit' onClick={onClickEdit}>
                                    <Icon custom_color='var(--general-main-1)' icon='IcEdit' size={16} />
                                </div>
                            )}
                            {is_advert_active ? (
                                <div className='p2p-my-ads__table-popovers__activate'>
                                    <Icon
                                        icon='IcArchive'
                                        custom_color='var(--general-main-1)'
                                        size={14}
                                        onClick={onClickActivateDeactivate}
                                    />
                                </div>
                            ) : (
                                <div className='p2p-my-ads__table-popovers__deactivate'>
                                    <Icon
                                        icon='IcUnarchive'
                                        custom_color='var(--general-main-1)'
                                        size={14}
                                        onClick={onClickActivateDeactivate}
                                    />
                                </div>
                            )}
                            <div className='p2p-my-ads__table-popovers__delete'>
                                <Icon
                                    icon='IcDelete'
                                    custom_color='var(--general-main-1)'
                                    size={16}
                                    onClick={onClickDelete}
                                />
                            </div>
                        </React.Fragment>
                    }
                    right_hidden_component_width={is_advert_active ? '12rem' : '18rem'}
                    visible_component={
                        <Table.Row
                            className={classNames('p2p-my-ads__table-row', {
                                'p2p-my-ads__table-row-disabled': !is_advert_active,
                            })}
                        >
                            <Text color='less-prominent' line_height='m' size='xxs'>
                                <Localize i18n_default_text='Ad ID {{advert_id}} ' values={{ advert_id: id }} />
                            </Text>
                            <div className='p2p-my-ads__table-row-details'>
                                <Text line_height='m' size='s' weight='bold'>
                                    {type === buy_sell.BUY ? (
                                        <Localize
                                            i18n_default_text='Buy {{ account_currency }}'
                                            values={{ account_currency }}
                                        />
                                    ) : (
                                        <Localize
                                            i18n_default_text='Sell {{ account_currency }}'
                                            values={{ account_currency }}
                                        />
                                    )}
                                </Text>
                                <AdStatus is_active={!!is_advert_active} />
                            </div>
                            <div className='p2p-my-ads__table-row-details'>
                                <Text color='profit-success' line_height='m' size='xxs'>
                                    {`${formatMoney(account_currency, amount_dealt, true)}`} {account_currency}&nbsp;
                                    {type === buy_sell.BUY ? localize('Bought') : localize('Sold')}
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
                                <Text color='prominent' line_height='m' size='xxs'>
                                    {min_order_amount_display} - {max_order_amount_display} {account_currency}
                                </Text>
                                <Text color='profit-success' line_height='m' size='xs' weight='bold'>
                                    {price_display} {local_currency}
                                </Text>
                            </div>
                            <div className='p2p-my-ads__table-row-methods'>
                                {payment_method_names ? (
                                    payment_method_names.map((payment_method, key) => {
                                        return (
                                            <div className='p2p-my-ads__table__payment-method--label' key={key}>
                                                <Text color='general' size='xxxs' line-height='l'>
                                                    {payment_method}
                                                </Text>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className='p2p-my-ads__table-add'>
                                        <Icon icon='IcAdd' />
                                        <Text color='prominent' size='xxs' weight='bold'>
                                            <Localize i18n_default_text='Add' />
                                        </Text>
                                    </div>
                                )}
                            </div>
                        </Table.Row>
                    }
                />
            </>
        );
    }

    return (
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <Modal
                className='p2p-my-ads__modal-error'
                has_close_icon
                is_open={my_profile_store.should_show_add_payment_method_form}
                title={localize('Choose payment method')}
            >
                <Modal.Body>
                    <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                    {should_show_add_new_payment_method_form ? (
                        <AddPaymentMethodForm />
                    ) : (
                        my_profile_store.advertiser_payment_methods_list.map((payment_method, key) => (
                            <>
                                <PaymentMethodCard
                                    is_vertical_ellipsis_visible={false}
                                    key={key}
                                    large
                                    onClick={() => onClickPaymentMethodCard(payment_method)}
                                    payment_method={payment_method}
                                    style={selected_methods.includes(payment_method.ID) ? style : {}}
                                />
                                <PaymentMethodCard
                                    is_add={true}
                                    label={localize('Payment method')}
                                    large
                                    onClickAdd={() => setShouldShowAddNewPaymentMethodForm(true)}
                                />
                            </>
                        ))
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        large
                        onClick={() => my_profile_store.setShouldShowAddPaymentMethodForm(false)}
                        secondary
                        text={localize('Cancel')}
                    />
                    <Button
                        has_effect
                        large
                        onClick={() => my_ads_store.onClickUpdatePaymentMethods(id)}
                        primary
                        text={localize('Add')}
                    />
                </Modal.Footer>
            </Modal>
            <Table.Row
                className={classNames('p2p-my-ads__table-row', {
                    'p2p-my-ads__table-row-disabled': !is_advert_active,
                })}
            >
                <Table.Cell>
                    {type === buy_sell.BUY ? (
                        <Localize i18n_default_text='Buy {{ id }}' values={{ id }} />
                    ) : (
                        <Localize i18n_default_text='Sell {{ id }}' values={{ id }} />
                    )}
                </Table.Cell>
                <Table.Cell>
                    {min_order_amount_display}-{max_order_amount_display} {account_currency}
                </Table.Cell>
                <Table.Cell className='p2p-my-ads__table-price'>
                    {price_display} {local_currency}
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
                                        <Text color='general' size='xs' line-height='l'>
                                            {payment_method}
                                        </Text>
                                    </div>
                                );
                            })
                        ) : (
                            <div
                                className='p2p-my-ads__table-add'
                                onClick={() => my_profile_store.setShouldShowAddPaymentMethodForm(true)}
                            >
                                <Icon icon='IcAdd' />
                                <Text color='prominent' size='xxs' weight='bold'>
                                    <Localize i18n_default_text='Add' />
                                </Text>
                            </div>
                        )}
                    </div>
                </Table.Cell>
                <Table.Cell>
                    <div className='p2p-my-ads__table-status'>
                        <AdStatus is_active={!!is_advert_active} />
                    </div>
                </Table.Cell>
                {is_popover_actions_visible && (
                    <div className='p2p-my-ads__table-popovers'>
                        {is_advert_active ? (
                            <div onClick={onClickActivateDeactivate}>
                                <Popover
                                    alignment='bottom'
                                    className='p2p-my-ads__table-popovers__deactivate'
                                    message={localize('Deactivate')}
                                >
                                    <Icon icon='IcArchive' color={general_store.is_barred && 'disabled'} size={16} />
                                </Popover>
                            </div>
                        ) : (
                            <div onClick={onClickActivateDeactivate}>
                                <Popover
                                    alignment='bottom'
                                    className='p2p-my-ads__table-popovers__activate'
                                    message={localize('Activate')}
                                >
                                    <Icon icon='IcUnarchive' color={general_store.is_barred && 'disabled'} size={16} />
                                </Popover>
                            </div>
                        )}
                        {!is_advert_active && (
                            <div onClick={onClickEdit}>
                                <Popover
                                    alignment='bottom'
                                    className='p2p-my-ads__table-popovers__edit'
                                    message={localize('Edit')}
                                >
                                    <Icon icon='IcEdit' size={16} />
                                </Popover>
                            </div>
                        )}
                        <div onClick={onClickDelete}>
                            <Popover
                                alignment='bottom'
                                className='p2p-my-ads__table-popovers__delete'
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
                                    size={16}
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
