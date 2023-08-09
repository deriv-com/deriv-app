import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import './payment-method-card-menu.scss';

const PaymentMethodCardMenu = ({ payment_method }) => {
    const { my_profile_store } = useStores();
    const { showModal } = useModalManagerContext();

    return (
        <div className='payment-method-card-menu'>
            <Text className='payment-method-card-menu__text' color='prominent'>
                <Localize i18n_default_text='Edit' />
            </Text>
            <Text
                className='payment-method-card-menu__text'
                color='prominent'
                onClick={() => {
                    my_profile_store.setPaymentMethodToDelete(payment_method);
                    showModal({ key: 'ConfirmDeletePaymentMethodModal' });
                }}
            >
                <Localize i18n_default_text='Delete' />
            </Text>
        </div>
    );
};

export default PaymentMethodCardMenu;
