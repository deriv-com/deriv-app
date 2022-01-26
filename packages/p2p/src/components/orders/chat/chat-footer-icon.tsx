import React from 'react';
import { Icon } from '@deriv/components';

type ChatFooterIconProps = {
    should_show_attachment_icon: boolean
};

const ChatFooterIcon = React.memo(({
    should_show_attachment_icon
}: ChatFooterIconProps) => (
    <Icon
        className='order-chat__footer-icon'
        icon={should_show_attachment_icon ? 'IcAttachment' : 'IcSendMessage'}
        width={16}
    />
));

ChatFooterIcon.displayName = 'ChatFooterIcon';

export default ChatFooterIcon;
