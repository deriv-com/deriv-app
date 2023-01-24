import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const NotRequired = () => (
    <IconMessageContent
        message={localize('Proof of address verification not required')}
        text={localize(
            'Your account does not need address verification at this time. We will inform you if address verification is required in the future.'
        )}
        icon={<Icon icon='IcPoaVerified' size={128} />}
    />
);
