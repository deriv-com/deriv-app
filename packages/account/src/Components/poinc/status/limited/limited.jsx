import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const PoincLimited = () => (
    <IconMessageContent
        message={localize("You've reached the limit for uploading your documents.")}
        icon={<Icon icon='IcPoincUnverified' size={128} />}
    />
);
