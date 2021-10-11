import React from 'react';
import { Icon, Text, Button } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const PaymentMethodsEmpty = () => {
    const { my_profile_store } = useStores();

    return (
        <div className='payment-methods-empty'>
            <Icon icon='IcPaymentMethodsWallet' className='payment-methods-empty--icon' height={159} width={256} />
            <Text className='payment-methods-empty--text' line_height='m' size='s' weight='bold'>
                <Localize i18n_default_text='You haven’t added any payment methods yet' />
            </Text>
            <Text line_height='m' size='s'>
                <Localize i18n_default_text='Hit the button below to add payment methods.' />
            </Text>
            <Button
                has_effect
                medium
                primary
                onClick={() => my_profile_store.setShowAddPaymentMethodForm(true)}
                text={localize('Add payment methods')}
            />
        </div>
    );
};

export default PaymentMethodsEmpty;
