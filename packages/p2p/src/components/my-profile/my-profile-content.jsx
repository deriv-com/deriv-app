import React from 'react';
import { DesktopWrapper, Loading, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import MyProfileForm from './my-profile-form';
import MyProfileStats from './my-profile-stats';
import PaymentMethods from './payment-methods';

const MyProfileContent = () => {
    const { my_profile_store } = useStores();

    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    } else if (my_profile_store.active_tab === my_profile_tabs.AD_TEMPLATE) {
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
    }
    return <MyProfileStats />;
};

export default observer(MyProfileContent);
