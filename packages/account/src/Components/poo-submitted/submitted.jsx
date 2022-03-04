import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

export const POOSubmitted = () => {
    return (
        <IconMessageContent
            message={localize('We’ve received your proof of ownership.')}
            text={localize('We’ll review your documents and notify you of its status within 3 days.')}
            icon={<Icon icon='IcPooSubmitted' size={128} />}
        />
    );
};
