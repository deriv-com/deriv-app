import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const PoincVerified = () => {
    return (
        <IconMessageContent
            message={localize('Proof of income verification passed')}
            icon={<Icon icon='IcPoincVerified' size={128} />}
        />
    );
};
