import React from 'react';
import { Text, ToggleSwitch } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { getTextSize } from 'Utils/responsive';

const MyProfilePrivacy = () => {
    const { general_store, my_profile_store } = useStores();
    const { isMobile } = useDevice();

    return (
        <div className='my-profile-privacy'>
            <div className='my-profile-privacy__toggle-container'>
                <Text className='my-profile-privacy__label' color='prominent' size={getTextSize('xxs', 'xs', isMobile)}>
                    <Localize i18n_default_text='Show my real name' />
                </Text>
                <Text color='less-prominent' size='xxxs'>
                    {`${my_profile_store.full_name}`}
                </Text>
            </div>
            <ToggleSwitch
                id='my-profile-privacy__toggle'
                classNameLabel='my-profile-privacy__toggle'
                is_enabled={general_store.should_show_real_name}
                handleToggle={my_profile_store.handleToggle}
            />
        </div>
    );
};

export default observer(MyProfilePrivacy);
