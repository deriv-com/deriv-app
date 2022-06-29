import React from 'react';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import MyProfileForm from './my-profile-form';
import MyProfileStats from './my-profile-stats';
import PaymentMethods from './payment-methods';
import BlockUserModal from 'Components/block-user/block-user-modal';
import BlockUserTable from 'Components/my-profile/block-user/block-user-table/block-user-table';

const MyProfileContent = () => {
    const { general_store, my_profile_store } = useStores();
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
                                (formik_ref.current && formik_ref.current.dirty) ||
                                my_profile_store.selected_payment_method.length > 0
                            ) {
                                my_profile_store.setIsCancelAddPaymentMethodModalOpen(true);
                                my_profile_store.setIsCancelEditPaymentMethodModalOpen(true);
                            } else {
                                my_profile_store.hideAddPaymentMethodForm();
                                my_profile_store.setShouldShowEditPaymentMethodForm(false);
                            }
                        }}
                    >
                        <PaymentMethods formik_ref={formik_ref} />
                    </MobileFullPageModal>
                </MobileWrapper>
            </React.Fragment>
        );
    } else if (my_profile_store.active_tab === my_profile_tabs.BLOCKED_ADVERTISERS) {
        return (
            <React.Fragment>
                <BlockUserModal
                    advertiser_name={my_profile_store.selected_blocked_user.name}
                    is_advertiser_blocked
                    is_block_user_modal_open={general_store.is_block_user_modal_open}
                    onCancel={() => general_store.setIsBlockUserModalOpen(false)}
                    onSubmit={my_profile_store.onSubmit}
                />
                <DesktopWrapper>
                    <BlockUserTable />
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileFullPageModal
                        body_className='block-user__modal'
                        height_offset='80px'
                        is_flex
                        is_modal_open
                        page_header_className='buy-sell__modal-header'
                        page_header_text={localize('Blocked Advertisers')}
                        pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                    >
                        <BlockUserTable />
                    </MobileFullPageModal>
                </MobileWrapper>
            </React.Fragment>
        );
    }
    return <MyProfileStats />;
};

export default observer(MyProfileContent);
