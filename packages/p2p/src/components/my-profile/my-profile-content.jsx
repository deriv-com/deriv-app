import React from 'react';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import MyProfileForm from './my-profile-form';
import MyProfileStats from './my-profile-stats';
import PaymentMethods from './payment-methods';
import CancelAddPaymentMethodModal from './payment-methods/add-payment-method/cancel-add-payment-method-modal';

const MyProfileContent = () => {
    const { my_profile_store } = useStores();

    const generatePageHeaderText = () => {
        if (my_profile_store.should_show_add_payment_method_form) {
            return localize('Add payment method');
        } else if (my_profile_store.should_show_edit_payment_method_form) {
            return localize('Edit payment method');
        }
        return localize('Payment methods');
    };

    if (my_profile_store.active_tab === my_profile_tabs.AD_TEMPLATE) {
        return <MyProfileForm />;
    } else if (my_profile_store.active_tab === my_profile_tabs.PAYMENT_METHODS) {
        return (
            <React.Fragment>
                <CancelAddPaymentMethodModal />
                <DesktopWrapper>
                    <PaymentMethods />
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileFullPageModal
                        body_className='payment-methods-list__modal'
                        height_offset='80px'
                        is_modal_open
                        is_flex
                        page_header_className='buy-sell__modal-header'
                        page_header_text={generatePageHeaderText()}
                        pageHeaderReturnFn={() => {
                            if (my_profile_store.is_add_payment_method_form_modified) {
                                if (my_profile_store.should_show_edit_payment_method_form) {
                                    my_profile_store.setIsCancelEditPaymentMethodModalOpen(true);
                                } else {
                                    my_profile_store.setIsCancelAddPaymentMethodModalOpen(true);
                                }
                            } else {
                                my_profile_store.hideAddPaymentMethodForm();
                                my_profile_store.setShouldShowEditPaymentMethodForm(false);
                            }
                        }}
                    >
                        <PaymentMethods />
                    </MobileFullPageModal>
                </MobileWrapper>
            </React.Fragment>
        );
    }
    return <MyProfileStats />;
};

export default observer(MyProfileContent);
