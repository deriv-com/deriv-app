import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const PoincNotRequired = () => (
    <IconMessageContent
        message={localize('Proof of income verification is not required')}
        icon={<Icon icon='IcPoincVerified' size={128} />}
    />
);
