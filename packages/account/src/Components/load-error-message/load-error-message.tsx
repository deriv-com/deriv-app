import React from 'react';
import { Icon } from '@deriv/components';
import IconMessageContent from 'Components/icon-message-content';

type TLoadErrorMessage = {
    error_message: React.ReactNode;
};

const LoadErrorMessage = ({ error_message }: TLoadErrorMessage) => (
    <IconMessageContent message={error_message} icon={<Icon icon='IcPoaLock' size={128} />} />
);

export default LoadErrorMessage;
