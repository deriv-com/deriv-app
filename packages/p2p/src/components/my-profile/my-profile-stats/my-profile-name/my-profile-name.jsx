import React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import UserAvatar from 'Components/user/user-avatar/user-avatar.jsx';
import { useStores } from 'Stores';

const MyProfileName = () => {
    const { general_store } = useStores();

    return (
        <div className='my-profile-name'>
            <UserAvatar
                className='my-profile-name__avatar'
                nickname={general_store.nickname}
                size={32}
                text_size='xs'
            />
            <div className='my-profile-name__name'>
                <Text color='prominent' weight='bold' size='s' line_height='m'>
                    {general_store.nickname}
                </Text>
            </div>
        </div>
    );
};

export default observer(MyProfileName);
