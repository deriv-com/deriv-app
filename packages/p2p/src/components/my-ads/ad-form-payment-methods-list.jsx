import React from 'react';
import { useStores } from 'Stores';
import { ThemedScrollbars } from '@deriv/components';
import PaymentMethodCard from '../my-profile/payment-methods/payment-method-card';
import './ad-form-payment-methods-list.scss';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';

const AdFormPaymentMethodsList = ({ selected_methods, onClickPaymentMethodCard }) => {
    const { my_profile_store, my_ads_store } = useStores();

    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
    };

    return (
            <ThemedScrollbars
                className='ads-payment-methods__container'
                is_scrollbar_hidden
                is_scrollable={isMobile()}
                is_only_horizontal={isMobile()}
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
                <PaymentMethodCard
                    is_add={true}
                    label={localize('Payment method')}
                    medium
                    onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethodModal(true)}
                />
            </ThemedScrollbars>
    );
};

export default observer(AdFormPaymentMethodsList);
