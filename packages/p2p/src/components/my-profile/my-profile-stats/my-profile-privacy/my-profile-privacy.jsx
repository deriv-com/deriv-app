import * as React from 'react';
import { Text, ToggleSwitch } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { isDesktop } from '@deriv/shared';

const MyProfilePrivacy = () => {
    const { general_store, my_profile_store } = useStores();

    return (
        <div className='my-profile-privacy'>
            <div className='my-profile-privacy__toggle-container'>
                <Text
                    className='my-profile-privacy__label'
                    color='prominent'
                    line_height='m'
                    size={isDesktop() ? 'xs' : 'xxs'}
                >
                    <Localize i18n_default_text='Show my real name' />
                </Text>
                <Text color='less-prominent' size='xxxs'>
                    {`${my_profile_store.full_name}`}
                </Text>
            </div>
            <ToggleSwitch
                id='my-profile-privacy__toggle'
                classNameButton='my-profile-privacy__toggle-button'
                classNameLabel='my-profile-privacy__toggle'
                is_enabled={general_store.should_show_real_name}
                handleToggle={my_profile_store.handleToggle}
            />
        </div>
    );
};

export default observer(MyProfilePrivacy);
