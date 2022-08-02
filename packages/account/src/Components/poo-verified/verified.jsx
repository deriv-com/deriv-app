import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

export const POOVerified = () => {
    return (
        <IconMessageContent
            message={localize('Proof of ownership verification passed.')}
            icon={<Icon icon='IcPooVerified' size={128} />}
        />
    );
};
