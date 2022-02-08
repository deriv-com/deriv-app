import React from 'react';
import { observer } from 'mobx-react-lite';
import PageReturn from 'Components/page-return/page-return.jsx';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import AddPaymentMethodForm from './add-payment-method-form.jsx';
import SelectPaymentMethod from './select-payment-method.jsx';

const AddPaymentMethod = ({ should_show_page_return = true, should_show_separated_footer }) => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);
        my_profile_store.setSelectedPaymentMethod('');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            {should_show_page_return && (
                <PageReturn
                    onClick={my_profile_store.hideAddPaymentMethodForm}
                    page_title={localize('Add payment method')}
                />
            )}
            {my_profile_store.selected_payment_method ? (
                <AddPaymentMethodForm should_show_separated_footer={should_show_separated_footer} />
            ) : (
                <SelectPaymentMethod />
            )}
        </React.Fragment>
    );
};

export default observer(AddPaymentMethod);
