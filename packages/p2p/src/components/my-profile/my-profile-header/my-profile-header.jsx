import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Text } from '@deriv/components';
import UserAvatar from 'Components/user/user-avatar/user-avatar.jsx';
import { useStores } from 'Stores';

const MyProfileHeader = () => {
    const { general_store } = useStores();

    return (
        <div className='my-profile-header'>
            <UserAvatar
                className='my-profile-header__avatar'
                nickname={general_store.nickname}
                size={32}
                text_size='xs'
            />
            <div className='my-profile-header__name'>
                <Text color='prominent' weight='bold' size='s' line_height='m'>
                    {general_store.nickname}
                </Text>
            </div>
        </div>
    );
};

export default observer(MyProfileHeader);
