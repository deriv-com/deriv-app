import React from 'react';
import { AutoSizer, DesktopWrapper, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer, Observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import MyProfileContent from './my-profile-content.jsx';
import MyProfileHeader from './my-profile-header';
import MyProfileDetailsContainer from './my-profile-stats/my-profile-details-container/my-profile-details-container.jsx';
import DailyLimitModal from 'Components/daily-limit-modal';
import DailyLimitSuccessModal from 'Components/daily-limit-success-modal';
import LoadingModal from 'Components/loading-modal';
import ErrorModal from 'Components/error-modal';
import { localize } from 'Components/i18next';

const MyProfile = () => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.getSettings();

        return () => {
            // leave this in the return otherwise the default isn't set to my stats
            my_profile_store.setActiveTab(my_profile_tabs.MY_STATS);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_profile_store.error_message) {
        return (
            <div className='my-profile__error'>
                <Text align='center' as='p' className='dp2p-table-error' color='loss-danger' size='xs'>
                    {my_profile_store.error_message}
                </Text>
            </div>
        );
    }

    return (
        <AutoSizer>
            {({ height, width }) => (
                <div className='my-profile' style={{ height, width }}>
                    <div className='my-profile__content'>
                        <DailyLimitModal />
                        <DailyLimitSuccessModal />
                        <Observer>
                            {() => (
                                <>
                                    <LoadingModal is_loading_modal_open={my_profile_store.is_loading_modal_open} />
                                    <ErrorModal
                                        error_message={localize(
                                            "Sorry, we're unable to increase your limits right now. Please try again in a few minutes."
                                        )}
                                        error_modal_title={localize('An internal error occurred')}
                                        has_close_icon={false}
                                        is_error_modal_open={my_profile_store.is_error_modal_open}
                                        setIsErrorModalOpen={is_open => {
                                            if (!is_open) my_profile_store.setIsErrorModalOpen(false);
                                        }}
                                        width={isMobile() ? '90rem' : '40rem'}
                                    />
                                </>
                            )}
                        </Observer>
                        <MyProfileDetailsContainer />
                        <DesktopWrapper>
                            <MyProfileHeader />
                        </DesktopWrapper>
                        <MyProfileContent />
                    </div>
                </div>
            )}
        </AutoSizer>
    );
};

export default observer(MyProfile);
