import React from 'react';
import { DesktopWrapper, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import UserAvatar from 'Components/user/user-avatar/user-avatar.jsx';
import { useStores } from 'Stores';
import { isMobile } from '@deriv/shared';
import TradeBadge from '../../../trade-badge';
import MyProfilePrivacy from '../my-profile-privacy';

const MyProfileName = () => {
    const { general_store, my_profile_store } = useStores();

    const { basic_verification, full_verification, total_orders_count } = my_profile_store.advertiser_info;

    return (
        <div className='my-profile-name'>
            <UserAvatar
                className='my-profile-name__avatar'
                nickname={general_store.nickname}
                size={isMobile() ? 32 : 64}
                text_size={isMobile() ? 's' : 'sm'}
            />
            <div className='my-profile-name__name'>
                <div className='my-profile-name--privacy'>
                    <div className='my-profile-name--column'>
                        <Text color='prominent' weight='bold' size='s' line_height='m'>
                            {general_store.nickname}
                        </Text>
                        <div className='my-profile-name--row'>
                            <TradeBadge
                                is_poa_verified={!!full_verification}
                                is_poi_verified={!!basic_verification}
                                trade_count={total_orders_count}
                                large
                            />
                        </div>
                    </div>
                    <DesktopWrapper>
                        <MyProfilePrivacy />
                    </DesktopWrapper>
                </div>
            </div>
        </div>
    );
};

export default observer(MyProfileName);
