import * as React from 'react';
import { DesktopWrapper, MobileWrapper, Text, ToggleSwitch } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import MyProfileSeparatorContainer from '../../my-profile-separator-container';
import { isDesktop } from '@deriv/shared';

const MyProfilePrivacy = () => {
    const { general_store, my_profile_store } = useStores();

    return (
        <div className='my-profile-privacy'>
            <DesktopWrapper>
                <MyProfileSeparatorContainer>
                    <Text color='prominent' size='xs' weight='bold'>
                        <Localize i18n_default_text='Privacy setting' />
                    </Text>
                    <MyProfileSeparatorContainer.Line has_single_child />
                </MyProfileSeparatorContainer>
            </DesktopWrapper>
            <div className='my-profile-privacy__toggle-container'>
                <DesktopWrapper>
                    <ToggleSwitch
                        id='my-profile-privacy__toggle'
                        classNameButton='my-profile-privacy__toggle-button'
                        classNameLabel='my-profile-privacy__toggle'
                        is_enabled={general_store.should_show_real_name}
                        handleToggle={my_profile_store.handleToggle}
                    />
                </DesktopWrapper>
                <Text
                    className='my-profile-privacy__label'
                    color='prominent'
                    line_height='m'
                    size={isDesktop() ? 'xs' : 'xxs'}
                >
                    <Localize
                        i18n_default_text='Show my real name ({{full_name}})'
                        values={{ full_name: my_profile_store.full_name }}
                    />
                </Text>
                <MobileWrapper>
                    <ToggleSwitch
                        id='my-profile-privacy__toggle'
                        classNameButton='my-profile-privacy__toggle-button'
                        classNameLabel='my-profile-privacy__toggle'
                        is_enabled={general_store.should_show_real_name}
                        handleToggle={my_profile_store.handleToggle}
                    />
                </MobileWrapper>
            </div>
        </div>
    );
};

export default observer(MyProfilePrivacy);
