import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import PaymentMethodCardMenu from './payment-method-card-menu.jsx';

const PaymentMethodCard = ({
    add_payment_method,
    // id,
    is_add = false,
    large,
    medium,
    onClickAdd = () => {},
    payment_method,
    // payment_method_field,
    // payment_method_field_info,
    small,
}) => {
    // console.log(payment_method);
    const [should_show_card_menu, setShouldShowCardMenu] = React.useState(false);
    const method = !is_add && payment_method.display_name.replace(/\s|-/gm, '');

    if (is_add) {
        return (
            <div
                className={classNames('payment-method-card--add', {
                    'payment-method-card--large': large,
                    'payment-method-card--medium': medium,
                    'payment-method-card--small': small,
                })}
                onClick={onClickAdd}
            >
                <Icon
                    icon='IcAddCircle'
                    className='payment-method-card--add-icon'
                    custom_color='var(--brand-red-coral)'
                    size={32}
                />
                <Text color='prominent' size='xs'>
                    {add_payment_method}
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
        >
            <div className='payment-method-card__header'>
                <Icon className='payment-method-card__icon' icon={`IcCashier${method}`} size={24} />
                <Icon
                    className='payment-method-card__ellipsis'
                    icon='IcCashierVerticalEllipsis'
                    onClick={() => setShouldShowCardMenu(true)}
                    size={16}
                />
            </div>
            {should_show_card_menu && <PaymentMethodCardMenu payment_method={payment_method} />}
        </div>
    );
};

export default PaymentMethodCard;
