import React from 'react';
import classNames from 'classnames';
import { Dropdown, Icon, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';

const PaymentMethodCard = ({
    add_payment_method,
    is_add = false,
    is_vertical_ellipsis_visible = true,
    label = undefined,
    large,
    medium,
    onClick = () => {},
    onClickAdd = () => {},
    payment_method,
    small,
    style,
}) => {
    const { my_profile_store } = useStores();

    const method = !is_add && payment_method.display_name.replace(/\s|-/gm, '');
    const payment_account = payment_method?.fields?.account?.value;
    const payment_account_name = payment_method?.fields?.account?.display_name;
    const payment_bank_name = payment_method?.fields?.bank_name?.value;
    const payment_name = payment_method?.fields?.name?.value;

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

                <Text align='center' color='prominent' size='xs'>
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
                {method === 'BankTransfer' || method === 'Other' ? (
                    <Icon
                        className='payment-method-card__icon'
                        icon={`IcCashier${method}`}
                        size={medium || small ? 16 : 24}
                    />
                ) : (
                    <Icon
                        className='payment-method-card__icon'
                        icon='IcCashierEwallet'
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
                        onChange={e => {
                            if (e.target.value === 'edit') {
                                my_profile_store.setPaymentMethodToEdit(payment_method);
                                my_profile_store.setSelectedPaymentMethodDisplayName(payment_method?.display_name);
                                my_profile_store.getSelectedPaymentMethodDetails();
                                my_profile_store.setShouldShowEditPaymentMethodForm(true);
                            } else {
                                my_profile_store.setPaymentMethodToDelete(payment_method);
                                my_profile_store.setIsConfirmDeleteModalOpen(true);
                            }
                        }}
                        suffix_icon='IcCashierVerticalEllipsis'
                        is_align_text_left
                    />
                )}
            </div>
            <div className='payment-method-card__body'>
                <Text color='prominent' size={large ? 'xs' : 'xxs'}>
                    {method === 'BankTransfer' || method === 'Other'
                        ? payment_method?.display_name
                        : payment_account_name}
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

export default PaymentMethodCard;
