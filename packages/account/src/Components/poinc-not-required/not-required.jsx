import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const NotRequired = () => (
    <IconMessageContent
        message={localize('Proof of income verification not required')}
        text={localize(
            'Your account does not need income verification at this time. We will inform you if income verification is required in the future.'
        )}
        icon={<Icon icon='IcPoincVerified' size={128} />}
    />
);
