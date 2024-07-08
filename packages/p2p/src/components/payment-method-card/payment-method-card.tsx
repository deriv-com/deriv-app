import React from 'react';
import classNames from 'classnames';
import { Checkbox, Dropdown, Icon, Text } from '@deriv/components';
import { isEmptyObject } from '@deriv/shared';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PaymentMethodIcon from 'Components/payment-method-icon';
import { TPaymentMethod } from 'Types/my-profile.types';

type TPaymentMethodCardProps = {
    add_payment_method?: string;
    disabled?: boolean;
    is_add?: boolean;
    is_vertical_ellipsis_visible?: boolean;
    label?: string;
    large?: boolean;
    medium?: boolean;
    onClick?: () => void;
    onClickAdd?: () => void;
    payment_method?: TPaymentMethod;
    show_payment_method_name?: boolean;
    small?: boolean;
    style?: React.CSSProperties;
};

const PaymentMethodCard = ({
    add_payment_method,
    disabled = false,
    is_add = false,
    is_vertical_ellipsis_visible = true,
    label = undefined,
    large = false,
    medium = false,
    onClick = () => {
        // do nothing
    },
    onClickAdd = () => {
        // do nothing
    },
    payment_method,
    show_payment_method_name = true,
    small = false,
    style,
}: TPaymentMethodCardProps) => {
    const { my_ads_store, my_profile_store } = useStores();
    const { payment_method_ids } = my_ads_store;

    const { showModal } = useModalManagerContext();
    const { display_name, fields, icon, id } = payment_method || {};
    const method = !is_add && display_name?.replace(/\s|-/gm, '');
    const payment_account = fields?.account?.value;
    const payment_account_name = display_name;
    const payment_bank_name = fields?.bank_name?.value;
    const payment_name = fields?.name?.value;

    const handleEditDeletePaymentMethod = (event: { target: { value: string } }) => {
        if (event.target.value === 'delete') {
            showModal({
                key: 'DeletePaymentMethodConfirmationModal',
                props: {
                    payment_method_id: id,
                    payment_method_name: payment_bank_name ?? payment_name ?? display_name,
                },
            });
        } else if (event.target.value === 'edit') {
            my_profile_store.setPaymentMethodToEdit(payment_method);
            my_profile_store.setSelectedPaymentMethodDisplayName(display_name);
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
                    data_testid='dt_payment_method_card_add_icon'
                    size={32}
                />
                <Text align='center' color={disabled ? 'less-prominent' : 'prominent'} size='xs'>
                    {label ?? add_payment_method}
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
                {is_vertical_ellipsis_visible ? (
                    <Dropdown
                        is_align_text_left
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
                        onChange={handleEditDeletePaymentMethod}
                        suffix_icon='IcCashierVerticalEllipsis'
                    />
                ) : (
                    <Checkbox
                        className='payment-method-card__checkbox'
                        disabled={payment_method_ids.length === 3 && !payment_method_ids.includes(id)}
                        label=''
                        onChange={onClick}
                        value={!isEmptyObject(style)}
                    />
                )}
            </div>
            <div className='payment-method-card__body'>
                <Text color='prominent' size={large ? 'xs' : 'xxs'}>
                    {method && !['BankTransfer', 'Other'].includes(method)
                        ? payment_account_name
                        : show_payment_method_name && display_name}
                </Text>
                <Text color='prominent' size={large ? 'xs' : 'xxs'}>
                    {payment_bank_name ?? payment_name}
                </Text>
                <Text color='prominent' size={large ? 'xs' : 'xxs'}>
                    {payment_account}
                </Text>
            </div>
        </div>
    );
};

export default PaymentMethodCard;
