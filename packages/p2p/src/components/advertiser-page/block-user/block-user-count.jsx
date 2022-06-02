import React from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, Popover, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import './block-user-count.scss';

const BlockUserCount = () => {
    // TODO: variable for testing, remove this later
    const block_count = 0;
    return (
        // TODO: Get blocked user count once BE card https://redmine.deriv.cloud/issues/62415#Remaining_features_for_P2P_blocking is merged
        <Popover
            className='block-user-count'
            classNameTarget='block-user-count__container'
            alignment='top'
            message={localize(
                block_count === 0 ? 'Nobody has blocked you. Yay!' : '{{block_count}} people have blocked you.',
                { block_count }
            )}
        >
            <Icon className='block-user-count__container--icon' icon='IcUserBlockedOutline' />
            <Text size='xxs' line_height='m'>
                {block_count}
            </Text>
        </Popover>
    );
};

export default observer(BlockUserCount);
