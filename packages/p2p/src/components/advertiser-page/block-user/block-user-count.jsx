import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Icon, MobileWrapper, Modal, Popover, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { isDesktop } from '@deriv/shared';
import './block-user-count.scss';

const BlockUserCount = () => {
    const { my_profile_store } = useStores();
    const { blocked_by_count } = my_profile_store.advertiser_info;

    const [is_block_user_count_modal_open, setIsBlockUserCountModalOpen] = React.useState(false);

    const message =
        blocked_by_count === 0
            ? localize('Nobody has blocked you. Yay!')
            : localize('{{blocked_by_count}} people have blocked you.', { blocked_by_count });

    React.useEffect(() => {
        my_profile_store.getAdvertiserInfo();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <MobileWrapper>
                <Modal has_close_icon={false} is_open={is_block_user_count_modal_open} width='440px'>
                    <Modal.Body>
                        <Text color='prominent' size='xs'>
                            {message}
                        </Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            large
                            onClick={() => {
                                setIsBlockUserCountModalOpen(false);
                            }}
                            primary
                        >
                            {localize('Ok')}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </MobileWrapper>
            <div onClick={!isDesktop() ? () => setIsBlockUserCountModalOpen(true) : null}>
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
            </div>
        </>
    );
};

export default observer(BlockUserCount);
