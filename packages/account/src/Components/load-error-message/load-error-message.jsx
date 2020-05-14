import React from 'react';
import { Icon } from '@deriv/components';
import IconMessageContent from 'Components/icon-message-content';

// TODO: Needs UI
const LoadErrorMessage = ({ error_message }) => (
    <IconMessageContent message={error_message} icon={<Icon icon='IcPoaLock' size={128} />} />
);

export default LoadErrorMessage;
