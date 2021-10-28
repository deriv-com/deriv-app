import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import PaymentMethodsEmpty from './payment-methods-empty';
import AddPaymentMethod from './add-payment-method';

const PaymentMethods = () => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.getAdvertiserPaymentMethods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_profile_store.should_show_add_payment_method_form) {
        return <AddPaymentMethod />;
    }
    return <PaymentMethodsEmpty />;
};

export default observer(PaymentMethods);
