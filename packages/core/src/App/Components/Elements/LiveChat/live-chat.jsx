import React from 'react';
import { connect } from 'Stores/connect';
import { Popover, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat.ts';

const LiveChat = ({ is_mobile_drawer, has_cookie_account }) => {
    const liveChat = useLiveChat(has_cookie_account);

    if (!liveChat.isReady) return null;

    if (is_mobile_drawer)
        return (
            <div className='livechat gtm-deriv-livechat' onClick={() => liveChat.widget?.call('maximize')}>
                <div className='livechat__icon-wrapper'>
                    <Icon icon='IcLiveChat' className='livechat__icon' />
                </div>
                <Text size='xs'>{localize('Live chat')}</Text>
            </div>
        );

    return (
        <div onClick={() => liveChat.widget?.call('maximize')}>
            <Popover
                className='footer__link'
                classNameBubble='help-centre__tooltip'
                alignment='top'
                message={localize('Live chat')}
                zIndex={9999}
            >
                <Icon icon='IcLiveChat' className='footer__icon gtm-deriv-livechat' />
            </Popover>
        </div>
    );
};

export default connect(({ client }) => ({
    has_cookie_account: client.has_cookie_account,
}))(LiveChat);
