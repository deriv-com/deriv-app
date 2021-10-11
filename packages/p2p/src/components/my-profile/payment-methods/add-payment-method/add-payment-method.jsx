import React from 'react';
import PageReturn from 'Components/page-return/page-return.jsx';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';

const AddPaymentMethod = () => {
    const { my_profile_store } = useStores();

    return (
        <PageReturn
            onClick={() => my_profile_store.setShowAddPaymentMethodForm(false)}
            page_title={localize('Add payment method')}
        />
    );
};

export default AddPaymentMethod;
