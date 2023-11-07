import React from 'react';
import classNames from 'classnames';
import { Checkbox, Dropdown, Icon, Text } from '@deriv/components';
import { isEmptyObject } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PaymentMethodIcon from 'Components/payment-method-icon';
import { useStores } from 'Stores';
import PropTypes from 'prop-types';

const PaymentMethodCard = ({
    add_payment_method,
    disabled,
    is_add = false,
    is_vertical_ellipsis_visible = true,
    label = undefined,
    large,
    medium,
    onClick = () => {},
    onClickAdd = () => {},
    payment_method,
    show_payment_method_name = true,
    small,
    style,
}) => {
    const { general_store, my_ads_store, my_profile_store } = useStores();
    const { showModal } = useModalManagerContext();
    const { display_name, fields, icon, id } = payment_method || {};
    const method = !is_add && display_name.replace(/\s|-/gm, '');
    const payment_account = fields?.account?.value;
    const payment_account_name = display_name;
    const payment_bank_name = fields?.bank_name?.value;
    const payment_name = fields?.name?.value;

    const handleEditDeletPaymentMethod = e => {
        if (e.target.value === 'delete') {
            showModal({
                key: 'DeletePaymentMethodConfirmationModal',
                props: {
                    payment_method_id: id,
                    payment_method_name: payment_bank_name || payment_name || display_name,
                },
            });
        } else if (e.target.value === 'edit') {
            my_profile_store.setPaymentMethodToEdit(payment_method);
            my_profile_store.setSelectedPaymentMethodDisplayName(payment_method?.display_name);
            my_profile_store.setShouldShowEditPaymentMethodForm(true);
        }
    };

    if (is_add) {
        return (
            <div
                className={classNames('payment-method-card--add', {
                    'payment-method-card--large': large,
                    'payment-method-card--medium': medium,
                    'payment-method-card--small': small,
                })}
                onClick={onClickAdd}
                style={style}
            >
                <Icon
                    icon='IcAddCircle'
                    className='payment-method-card--add-icon'
                    custom_color='var(--brand-red-coral)'
                    size={32}
                />
                <Text align='center' color={disabled ? 'less-prominent' : 'prominent'} size='xs'>
                    {label || add_payment_method}
                </Text>
            </div>
        );
    }

    return (
        <div
            className={classNames('payment-method-card', {
                'payment-method-card--large': large,
                'payment-method-card--medium': medium,
                'payment-method-card--small': small,
            })}
            onClick={onClick}
            style={style}
        >
            <div className='payment-method-card__header'>
                {icon ? (
                    <Icon className='payment-method-card__icon' icon={icon} size={medium || small ? 16 : 24} />
                ) : (
                    <PaymentMethodIcon
                        className='payment-method-card__icon'
                        display_name={display_name}
                        size={medium || small ? 16 : 24}
                    />
                )}

                {is_vertical_ellipsis_visible && (
                    <Dropdown
                        list={[
                            {
                                text: localize('Edit'),
                                value: 'edit',
                            },
                            {
                                text: localize('Delete'),
                                value: 'delete',
                            },
                        ]}
                        onChange={handleEditDeletPaymentMethod}
                        suffix_icon='IcCashierVerticalEllipsis'
                        is_align_text_left
                    />
                )}
                {(general_store.active_index === 2 || general_store.active_index === 0) && (
                    <Checkbox
                        className='payment-method-card__checkbox'
                        disabled={
                            my_ads_store.payment_method_ids.length === 3 &&
                            !my_ads_store.payment_method_ids.includes(payment_method.id)
                        }
                        onChange={onClick}
                        value={!isEmptyObject(style)}
                    />
                )}
            </div>
            <div className='payment-method-card__body'>
                <Text color='prominent' size={large ? 'xs' : 'xxs'}>
                    {!['BankTransfer', 'Other'].includes(method)
                        ? payment_account_name
                        : show_payment_method_name && payment_method?.display_name}
                </Text>
                <Text color='prominent' size={large ? 'xs' : 'xxs'}>
                    {payment_bank_name || payment_name}
                </Text>
                <Text color='prominent' size={large ? 'xs' : 'xxs'}>
                    {payment_account}
                </Text>
            </div>
        </div>
    );
};

PaymentMethodCard.propTypes = {
    add_payment_method: PropTypes.string,
    disabled: PropTypes.bool,
    is_add: PropTypes.bool,
    is_vertical_ellipsis_visible: PropTypes.bool,
    label: PropTypes.string,
    large: PropTypes.bool,
    medium: PropTypes.bool,
    onClick: PropTypes.func,
    onClickAdd: PropTypes.func,
    payment_method: PropTypes.object,
    show_payment_method_name: PropTypes.bool,
    small: PropTypes.bool,
    style: PropTypes.object,
};

export default PaymentMethodCard;
