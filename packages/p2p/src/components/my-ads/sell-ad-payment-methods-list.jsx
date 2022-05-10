import React from 'react';
import { useStores } from 'Stores';
import { ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PaymentMethodCard from '../my-profile/payment-methods/payment-method-card';
import './sell-ad-payment-methods-list.scss';

const SellAdPaymentMethodsList = ({
    is_only_horizontal = isMobile(),
    is_scrollable = isMobile(),
    onClickAdd,
    onClickPaymentMethodCard,
    selected_methods,
}) => {
    const { my_profile_store } = useStores();

    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
    };

    return (
        <ThemedScrollbars
            className={classNames('sell-ad-payment-methods__container', {
                'sell-ad-payment-methods__container--horizontal': is_only_horizontal,
            })}
            is_scrollbar_hidden
            is_scrollable={is_scrollable}
            is_only_horizontal={is_only_horizontal}
        >
            {my_profile_store.advertiser_payment_methods_list.map((payment_method, key) => (
                <PaymentMethodCard
                    is_vertical_ellipsis_visible={false}
                    key={key}
                    medium
                    onClick={() => onClickPaymentMethodCard(payment_method)}
                    payment_method={payment_method}
                    style={selected_methods.includes(payment_method.ID) ? style : {}}
                />
            ))}
            <PaymentMethodCard is_add={true} label={localize('Payment method')} medium onClickAdd={onClickAdd} />
        </ThemedScrollbars>
    );
};

SellAdPaymentMethodsList.propTypes = {
    is_only_horizontal: PropTypes.bool,
    is_scrollable: PropTypes.bool,
    onClickAdd: PropTypes.func,
    onClickPaymentMethodCard: PropTypes.func,
    selected_methods: PropTypes.array,
};

export default observer(SellAdPaymentMethodsList);
