import React from 'react';
import { Popover, Icon, Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat';

const LiveChat = observer(({ showPopover }: { showPopover?: boolean }) => {
    const { client } = useStore();
    const { has_cookie_account, loginid } = client;
    const { isDesktop } = useDevice();
    const liveChat = useLiveChat(has_cookie_account, loginid);

    if (!liveChat.isReady) return null;

    const liveChatClickHandler = () => liveChat.widget?.call('maximize');

    if (isDesktop)
        return (
            <div onKeyDown={liveChatClickHandler} onClick={liveChatClickHandler}>
                {showPopover ? (
                    <Popover
                        className='footer__link'
                        classNameBubble='help-centre__tooltip'
                        alignment='top'
                        message={<Localize i18n_default_text='Live chat' />}
                        zIndex='9999'
                    >
                        <Icon icon='IcLiveChat' className='footer__icon gtm-deriv-livechat' />
                    </Popover>
                ) : (
                    <div className='footer__link'>
                        <Icon icon='IcLiveChat' className='footer__icon gtm-deriv-livechat' />
                    </div>
                )}
            </div>
        );

    return (
        <div className='livechat gtm-deriv-livechat' onKeyDown={liveChatClickHandler} onClick={liveChatClickHandler}>
            <div className='livechat__icon-wrapper'>
                <Icon icon='IcLiveChat' className='livechat__icon' />
            </div>
            <Text size='xs'>
                <Localize i18n_default_text='Live chat' />
            </Text>
        </div>
    );
});

export default LiveChat;
