import React from 'react';
import { DesktopWrapper, Loading, Text } from '@deriv/components';
import { isEmptyObject } from '@deriv/shared';
import { observer } from '@deriv/stores';
import Verification from 'Components/verification';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import MyProfileContent from './my-profile-content';
import MyProfileDetailsContainer from './my-profile-stats/my-profile-details-container';
import MyProfileHeader from './my-profile-header';

const MyProfile = () => {
    const { general_store, my_profile_store } = useStores();

    React.useEffect(() => {
        if (general_store.active_index !== 3) general_store.setActiveIndex(3);
        my_profile_store.getSettings();

        return () => {
            // leave this in the return otherwise the default isn't set to my stats
            my_profile_store.setActiveTab(my_profile_tabs.MY_STATS);
            my_profile_store.setShouldShowAddPaymentMethodForm(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (
        isEmptyObject(general_store.advertiser_info) &&
        !general_store.poi_status &&
        !general_store.should_show_dp2p_blocked
    ) {
        return <Loading is_fullscreen={false} />;
    }

    if (my_profile_store.error_message) {
        return (
            <div className='my-profile__error'>
                <Text align='center' as='p' className='dp2p-table-error' color='loss-danger' size='xs'>
                    {my_profile_store.error_message}
                </Text>
            </div>
        );
    }

    if (!general_store.is_advertiser) {
        return <Verification />;
    }

    return (
        <div className='my-profile'>
            <div className='my-profile__content'>
                <MyProfileDetailsContainer />
                <DesktopWrapper>
                    <MyProfileHeader />
                </DesktopWrapper>
                <MyProfileContent />
            </div>
        </div>
    );
};

export default observer(MyProfile);
