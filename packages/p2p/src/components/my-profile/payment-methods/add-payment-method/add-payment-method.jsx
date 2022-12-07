import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import AddPaymentMethodForm from './add-payment-method-form.jsx';
import PageReturn from 'Components/page-return/page-return.jsx';
import PropTypes from 'prop-types';
import SelectPaymentMethod from './select-payment-method.jsx';
import { useModalManagerContext } from 'Components/modal-manager';

const AddPaymentMethod = ({ should_show_page_return = true, should_show_separated_footer }) => {
    const { my_ads_store, my_profile_store } = useStores();
    const { showModal } = useModalManagerContext();

    React.useEffect(() => {
        my_profile_store.setSelectedPaymentMethod('');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <DesktopWrapper>
                {should_show_page_return && (
                    <PageReturn
                        onClick={() => {
                            if (my_profile_store.selected_payment_method.length > 0) {
                                showModal({
                                    key: 'CancelAddPaymentMethodModal',
                                });
                            } else {
                                my_profile_store.hideAddPaymentMethodForm();
                                my_ads_store.setShouldShowAddPaymentMethodModal(false);
                            }
                        }}
                        page_title={localize('Add payment method')}
                    />
                )}
                {my_profile_store.selected_payment_method ? (
                    <AddPaymentMethodForm should_show_separated_footer={should_show_separated_footer} />
                ) : (
                    <SelectPaymentMethod />
                )}
            </DesktopWrapper>
            <MobileWrapper>
                {my_profile_store.selected_payment_method ? (
                    <AddPaymentMethodForm should_show_separated_footer={should_show_separated_footer} />
                ) : (
                    <SelectPaymentMethod />
                )}
            </MobileWrapper>
        </React.Fragment>
    );
};

AddPaymentMethod.propTypes = {
    formik_ref: PropTypes.shape({ current: PropTypes.any }),
    should_show_page_return: PropTypes.bool,
    should_show_separated_footer: PropTypes.bool,
};

export default observer(AddPaymentMethod);
