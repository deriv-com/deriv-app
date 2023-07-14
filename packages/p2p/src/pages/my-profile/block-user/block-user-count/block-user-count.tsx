import React from 'react';
import { Icon, Popover, Text } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import { getMessage } from 'Utils/advertiser';

const BlockUserCount = () => {
    const { showModal } = useModalManagerContext();
    const { general_store } = useStores();
    const { user_blocked_count } = general_store;

    return (
        <React.Fragment>
            <div
                data-testid='dt_block_user_count'
                onClick={
                    isMobile()
                        ? () => showModal({ key: 'BlockedCountModal', props: {} })
                        : () => {
                              /* do nothing */
                          }
                }
            >
                <Popover
                    alignment='top'
                    className='block-user-count'
                    classNameTarget='block-user-count__container'
                    message={getMessage(user_blocked_count)}
                >
                    <Icon className='block-user-count__container--icon' icon='IcUserBlockedOutline' size={16} />
                    <Text color='less-prominent' size={isDesktop() ? 'xs' : '14'}>
                        {user_blocked_count}
                    </Text>
                </Popover>
            </div>
        </React.Fragment>
    );
};

export default observer(BlockUserCount);
