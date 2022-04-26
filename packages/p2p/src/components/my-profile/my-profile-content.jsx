import React from 'react';
import { Loading } from '@deriv/components';
import { observer } from 'mobx-react-lite';
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
        return <PaymentMethods />;
    }
    return <MyProfileStats />;
};

export default observer(MyProfileContent);
