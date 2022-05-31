import React from 'react';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import MyProfileForm from './my-profile-form';
import MyProfileStats from './my-profile-stats';
import PaymentMethods from './payment-methods';
import BlockUserEmpty from 'Components/advertiser-page/block-user/block-user-empty';

const MyProfileContent = () => {
    const { my_profile_store } = useStores();

    if (my_profile_store.active_tab === my_profile_tabs.AD_TEMPLATE) {
        return <MyProfileForm />;
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
                        is_modal_open={true}
                        page_header_text={localize('Payment methods')}
                        pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                    >
                        <PaymentMethods />
                    </MobileFullPageModal>
                </MobileWrapper>
            </React.Fragment>
        );
    } else if (my_profile_store.active_tab === my_profile_tabs.BLOCKED_ADVERTISERS) {
        // TODO: Add search box and integrate list of blocked users once https://redmine.deriv.cloud/issues/65494#List_of_users is merged
        return <BlockUserEmpty />;
    }
    return <MyProfileStats />;
};

export default observer(MyProfileContent);
