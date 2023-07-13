import React from 'react';
import { Icon } from '@deriv/components';
import PropTypes from 'prop-types';

const ChatFooterIcon = React.memo(({ should_show_attachment_icon }) => (
    <Icon icon={should_show_attachment_icon ? 'IcAttachment' : 'IcSendMessage'} width={16} />
));

ChatFooterIcon.displayName = 'ChatFooterIcon';
ChatFooterIcon.propTypes = {
    should_show_attachment_icon: PropTypes.bool,
};

export default ChatFooterIcon;
