import React from 'react';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
// import MyProfileForm from './my-profile-form';
import MyProfileStats from './my-profile-stats';
import PaymentMethods from './payment-methods';
import BlockUserTable from '../advertiser-page/block-user/block-user-table.jsx';
import BlockUserModal from '../advertiser-page/block-user/block-user-modal.jsx';

const MyProfileContent = () => {
    const { advertiser_page_store, my_profile_store } = useStores();

    const onSubmit = async () => {
        advertiser_page_store.setIsBlockUserModalOpen(false);
        advertiser_page_store.unblockUser(advertiser_page_store.selected_blocked_user.id);
        my_profile_store.getBlockedAdvertisersList();
    };

    if (my_profile_store.active_tab === my_profile_tabs.AD_TEMPLATE) {
        // return <MyProfileForm />;
        return (
            <React.Fragment>
                <BlockUserModal
                    advertiser={advertiser_page_store.selected_blocked_user}
                    is_advertiser_blocked
                    is_block_user_modal_open={advertiser_page_store.is_block_user_modal_open}
                    onCancel={() => advertiser_page_store.setIsBlockUserModalOpen(false)}
                    onSubmit={onSubmit}
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
    } else if (my_profile_store.active_tab === my_profile_tabs.PAYMENT_METHODS) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <PaymentMethods />
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileFullPageModal
                        body_className='payment-methods-list__modal'
                        height_offset='80px'
                        is_flex
                        is_modal_open
                        page_header_className='buy-sell__modal-header'
                        page_header_text={localize('Payment methods')}
                        pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
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
