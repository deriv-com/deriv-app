import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import { MobileFullPageModal } from '@deriv/components';
import AddPaymentMethodForm from './add-payment-method-form.jsx';
import SelectPaymentMethod from './select-payment-method.jsx';

const AddPaymentMethod = ({ should_show_separated_footer }) => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);
        my_profile_store.setSelectedPaymentMethod('');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MobileFullPageModal
            body_className='add-payment-method__modal'
            is_modal_open={my_profile_store.should_show_add_payment_method_form}
            page_header_text={localize('Add payment method')}
            pageHeaderReturnFn={() => my_profile_store.setShouldShowAddPaymentMethodForm(false)}
        >
            {my_profile_store.selected_payment_method ? (
                <AddPaymentMethodForm should_show_separated_footer={should_show_separated_footer} />
            ) : (
                <SelectPaymentMethod />
            )}
        </MobileFullPageModal>
    );
};

export default observer(AddPaymentMethod);
