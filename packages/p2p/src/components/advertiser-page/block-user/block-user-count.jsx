import React from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, Popover, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { isDesktop } from '@deriv/shared';
import './block-user-count.scss';

const BlockUserCount = () => {
    const { my_profile_store } = useStores();
    const { blocked_by_count } = my_profile_store.advertiser_info;

    const message =
        blocked_by_count === 0
            ? localize('Nobody has blocked you. Yay!')
            : localize('{{blocked_by_count}} people have blocked you.', { blocked_by_count });

    React.useEffect(() => {
        my_profile_store.getAdvertiserInfo();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Popover
            alignment='top'
            className='block-user-count'
            classNameTarget='block-user-count__container'
            message={message}
        >
            <Icon className='block-user-count__container--icon' icon='IcUserBlockedOutline' size={16} />
            <Text color='less-prominent' line_height='m' size={isDesktop() ? 'xs' : 14}>
                {blocked_by_count}
            </Text>
        </Popover>
    );
};

export default observer(BlockUserCount);
