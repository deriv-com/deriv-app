import React from 'react';
import { localize } from 'Components/i18next';
import { DesktopWrapper } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AddPaymentMethodForm from 'Components/add-payment-method-form';
import PageReturn from 'Components/page-return';
import ScrollbarWrapper from 'Components/scrollbar-wrapper';
import SelectPaymentMethod from './select-payment-method';

type TAddPaymentMethodProps = {
    should_show_page_return?: boolean;
    should_show_separated_footer?: boolean;
};

const AddPaymentMethod = ({
    should_show_page_return = true,
    should_show_separated_footer = true,
}: TAddPaymentMethodProps) => {
    const { general_store, my_profile_store } = useStores();
    const { hideModal, showModal } = useModalManagerContext();

    const payment_method_form = my_profile_store.selected_payment_method ? (
        <AddPaymentMethodForm should_show_separated_footer={should_show_separated_footer} />
    ) : (
        <SelectPaymentMethod />
    );

    return (
        <ScrollbarWrapper {...(general_store.active_index === 3 && { height: '39rem' })}>
            <React.Fragment>
                <DesktopWrapper>
                    {should_show_page_return && (
                        <PageReturn
                            onClick={() => {
                                if (general_store?.formik_ref?.dirty || !!my_profile_store.selected_payment_method) {
                                    showModal({
                                        key: 'CancelAddPaymentMethodModal',
                                        props: {},
                                    });
                                } else {
                                    my_profile_store.hideAddPaymentMethodForm();
                                    hideModal();
                                }
                            }}
                            page_title={localize('Add payment method')}
                        />
                    )}
                </DesktopWrapper>
                {payment_method_form}
            </React.Fragment>
        </ScrollbarWrapper>
    );
};

export default observer(AddPaymentMethod);
