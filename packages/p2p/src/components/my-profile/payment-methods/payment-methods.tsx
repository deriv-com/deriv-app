import React from 'react';
import { Loading } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import AddPaymentMethod from 'Components/add-payment-method';
import EditPaymentMethodForm from './edit-payment-method-form';
import PaymentMethodsEmpty from './payment-methods-empty';
import PaymentMethodsList from './payment-methods-list';

const PaymentMethods = () => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.setIsLoading(true);
        my_profile_store.getAdvertiserPaymentMethods();
        my_profile_store.setShouldShowAddPaymentMethodForm(false);
        my_profile_store.setShouldShowEditPaymentMethodForm(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={isMobile()} />;
    } else if (my_profile_store.should_show_add_payment_method_form) {
        return <AddPaymentMethod />;
    } else if (!my_profile_store.advertiser_has_payment_methods) {
        return <PaymentMethodsEmpty />;
    } else if (my_profile_store.should_show_edit_payment_method_form) {
        return <EditPaymentMethodForm />;
    }

    return <PaymentMethodsList />;
};

export default observer(PaymentMethods);
