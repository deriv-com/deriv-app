import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

export const POONotRequired = () => {
    return (
        <IconMessageContent
            message={localize('Proof of ownership not required.')}
            text={localize(
                'You are not required to submit proof of ownership at this time. We will inform you if proof of ownership is required in the future.'
            )}
            icon={<Icon icon='IcPooVerified' size={128} />}
        />
    );
};
