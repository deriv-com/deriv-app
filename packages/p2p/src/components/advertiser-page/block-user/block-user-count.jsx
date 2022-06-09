import React from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, Popover, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import './block-user-count.scss';
import { useStores } from 'Stores';

const BlockUserCount = () => {
    const { my_profile_store } = useStores();
    const { blocked_by_count } = my_profile_store.advertiser_info;

    React.useEffect(() => {
        my_profile_store.getAdvertiserInfo();
    }, []);

    return (
        <Popover
            className='block-user-count'
            classNameTarget='block-user-count__container'
            alignment='top'
            message={localize(
                blocked_by_count === 0
                    ? 'Nobody has blocked you. Yay!'
                    : '{{blocked_by_count}} people have blocked you.',
                { blocked_by_count }
            )}
        >
            <Icon className='block-user-count__container--icon' icon='IcUserBlockedOutline' />
            <Text size='xxs' line_height='m'>
                {blocked_by_count}
            </Text>
        </Popover>
    );
};

export default observer(BlockUserCount);
