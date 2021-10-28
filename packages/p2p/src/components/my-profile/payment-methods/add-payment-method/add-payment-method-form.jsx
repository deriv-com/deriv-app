import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';

const AddPaymentMethodForm = () => {
    const { my_profile_store } = useStores();

    my_profile_store.getSelectedPaymentMethodFields();

    return <div>hi</div>;
};

export default observer(AddPaymentMethodForm);
