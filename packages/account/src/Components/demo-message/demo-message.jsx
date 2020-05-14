import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const DemoMessage = () => (
    <IconMessageContent
        message={localize('This feature is not available for demo accounts.')}
        icon={<Icon icon='IcPoaLock' size={128} />}
    />
);

export default DemoMessage;
