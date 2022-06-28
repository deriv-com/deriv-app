import React from 'react';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import MyProfileForm from './my-profile-form';
import MyProfileStats from './my-profile-stats';
import PaymentMethods from './payment-methods';
import BlockUserEmpty from 'Components/block-user/block-user-empty';

const MyProfileContent = () => {
    const { my_profile_store } = useStores();
    const formik_ref = React.useRef();

    if (my_profile_store.active_tab === my_profile_tabs.AD_TEMPLATE) {
        return <MyProfileForm />;
    } else if (my_profile_store.active_tab === my_profile_tabs.PAYMENT_METHODS) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <PaymentMethods formik_ref={formik_ref} />
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileFullPageModal
                        body_className='payment-methods-list__modal'
                        height_offset='80px'
                        is_modal_open
                        is_flex
                        page_header_className='buy-sell__modal-header'
                        page_header_text={localize('Payment methods')}
                        pageHeaderReturnFn={() => {
                            if (
                                my_profile_store.selected_payment_method.length > 0 ||
                                (formik_ref.current && formik_ref.current.dirty)
                            ) {
                                my_profile_store.setIsCancelAddPaymentMethodModalOpen(true);
                            } else {
                                my_profile_store.hideAddPaymentMethodForm();
                            }
                        }}
                    >
                        <PaymentMethods formik_ref={formik_ref} />
                    </MobileFullPageModal>
                </MobileWrapper>
            </React.Fragment>
        );
    } else if (my_profile_store.active_tab === my_profile_tabs.BLOCKED_ADVERTISERS) {
        // TODO: Add search box and integrate list of blocked users once blocked user list is merged
        return <BlockUserEmpty />;
    }
    return <MyProfileStats />;
};

export default observer(MyProfileContent);
