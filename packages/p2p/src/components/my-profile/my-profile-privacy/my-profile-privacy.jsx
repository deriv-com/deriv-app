import * as React from 'react';
import { Text, ToggleSwitch } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import MyProfileSeparatorContainer from '../my-profile-separator-container';

const MyProfilePrivacy = () => {
    const { general_store, my_profile_store } = useStores();

    return (
        <div className='my-profile-privacy'>
            <MyProfileSeparatorContainer>
                <Text size='xs' color='prominent' weight='bold'>
                    <Localize i18n_default_text='Privacy setting' />
                </Text>
                <MyProfileSeparatorContainer.Line has_single_child />
            </MyProfileSeparatorContainer>
            <div className='my-profile-privacy__toggle-container'>
                <ToggleSwitch
                    id='my-profile-privacy__toggle'
                    classNameButton='my-profile-privacy__toggle-button'
                    classNameLabel='my-profile-privacy__toggle'
                    is_enabled={general_store.should_show_real_name}
                    handleToggle={my_profile_store.handleToggle}
                />
                <Text size='xs' line_height='m' color='prominent' className='my-profile-privacy__label'>
                    <Localize
                        i18n_default_text='Show my real name ({{full_name}})'
                        values={{ full_name: my_profile_store.full_name }}
                    />
                </Text>
            </div>
        </div>
    );
};

export default observer(MyProfilePrivacy);
