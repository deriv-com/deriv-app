import React from 'react';
import { DesktopWrapper, Icon, MobileFullPageModal, MobileWrapper, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import MyProfileStatsTable from './my-profile-stats-table';
import MyProfileSeparatorContainer from '../my-profile-separator-container';
import { Localize, localize } from 'Components/i18next';
import MyProfilePrivacy from './my-profile-privacy';

const MyStats = () => {
    const { my_profile_store } = useStores();
    const [should_show_stats_and_ratings, setShouldShowStatsAndRatings] = React.useState(false);
    const tabs = [
        {
            default_text: 'Stats',
            onClick: () => setShouldShowStatsAndRatings(true),
        },
        {
            default_text: 'Payment methods',
            onClick: () => my_profile_store.setActiveTab(my_profile_tabs.PAYMENT_METHODS),
        },
        {
            default_text: 'Ad details',
            onClick: () => my_profile_store.setActiveTab(my_profile_tabs.AD_TEMPLATE),
        },
        {
            default_text: 'My counterparties',
            onClick: () => my_profile_store.setActiveTab(my_profile_tabs.MY_COUNTERPARTIES),
        },
    ];

    return (
        <React.Fragment>
            <MobileFullPageModal
                height_offset='80px'
                is_flex
                is_modal_open={should_show_stats_and_ratings}
                page_header_text={localize('Stats')}
                pageHeaderReturnFn={() => setShouldShowStatsAndRatings(false)}
            >
                <MyProfileStatsTable />
            </MobileFullPageModal>
            <DesktopWrapper>
                <MyProfileStatsTable />
            </DesktopWrapper>
            <MobileWrapper>
                <MyProfileSeparatorContainer.Line className='my-profile-stats-separator' />
                <MyProfilePrivacy />
                <MyProfileSeparatorContainer.Line className='my-profile-stats-separator' />
                {tabs.map((tab, key) => {
                    return (
                        <React.Fragment key={key}>
                            <div className='my-profile__navigation' onClick={tab.onClick}>
                                <Text color='prominent' size='xxs'>
                                    <Localize i18n_default_text={tab.default_text} />
                                </Text>
                                <Icon icon='IcChevronRight' />
                            </div>
                            {key !== tabs.length - 1 && (
                                <MyProfileSeparatorContainer.Line className='my-profile-stats-separator' />
                            )}
                        </React.Fragment>
                    );
                })}
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(MyStats);
