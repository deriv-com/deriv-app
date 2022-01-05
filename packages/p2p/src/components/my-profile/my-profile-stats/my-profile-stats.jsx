import React from 'react';
import { DesktopWrapper, Icon, MobileWrapper, Text } from '@deriv/components';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import MyProfileBalance from './my-profile-balance';
import MyProfilePrivacy from './my-profile-privacy';
import MyProfileStatsTable from './my-profile-stats-table';
import MyProfileName from './my-profile-name';
import MyProfileSeparatorContainer from '../my-profile-separator-container';
import { Localize } from 'Components/i18next';
import { isMobile } from '@deriv/shared';

const MyStats = () => {
    const { my_profile_store } = useStores();

    return (
        <React.Fragment>
            <MyProfileName />
            <DesktopWrapper>
                <MyProfileBalance />
            </DesktopWrapper>
            <MyProfileSeparatorContainer.Line className='my-profile-stats-separator' is_invisible={isMobile()} />
            <MyProfileStatsTable />
            <MobileWrapper>
                <MyProfileSeparatorContainer.Line className='my-profile-stats-separator' />
                <MyProfileBalance />
                <MyProfileSeparatorContainer.Line className='my-profile-stats-separator' />
            </MobileWrapper>
            <MyProfilePrivacy />
            <MobileWrapper>
                <MyProfileSeparatorContainer.Line className='my-profile-stats-separator' />
                <div
                    className='my-profile__navigation'
                    onClick={() => my_profile_store.setActiveTab(my_profile_tabs.PAYMENT_METHODS)}
                >
                    <Text color='prominent' size='xxs'>
                        <Localize i18n_default_text='Payment methods' />
                    </Text>
                    <Icon icon='IcChevronRight' />
                </div>
                <MyProfileSeparatorContainer.Line className='my-profile-stats-separator' />
                <div
                    className='my-profile__navigation'
                    onClick={() => my_profile_store.setActiveTab(my_profile_tabs.AD_TEMPLATE)}
                >
                    <Text color='prominent' size='xxs'>
                        <Localize i18n_default_text='Ad template' />
                    </Text>
                    <Icon icon='IcChevronRight' />
                </div>
                <MyProfileSeparatorContainer.Line className='my-profile-stats-separator' />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default MyStats;
