import React from 'react';
import { AutoSizer, Loading, Text, ThemedScrollbars } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import MyProfileBalance from './my-profile-balance';
import MyProfileForm from './my-profile-form';
import MyProfileHeader from './my-profile-header';
import MyProfilePrivacy from './my-profile-privacy';
import MyProfileStats from './my-profile-stats';

const MyProfile = () => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.getSettings();
        my_profile_store.getAdvertiserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (my_profile_store.error_message) {
        return (
            <div className='my-profile__error'>
                <Text size='xs' font='loss-danger'>
                    {my_profile_store.error_message}
                </Text>
            </div>
        );
    }

    return (
        <AutoSizer>
            {({ height, width }) => (
                <ThemedScrollbars className='my-profile' height={height} style={{ width }}>
                    <div className='my-profile__content'>
                        <MyProfileHeader />
                        <MyProfileBalance />
                        <MyProfileStats />
                        <MyProfilePrivacy />
                        <MyProfileForm />
                    </div>
                </ThemedScrollbars>
            )}
        </AutoSizer>
    );
};

export default observer(MyProfile);
