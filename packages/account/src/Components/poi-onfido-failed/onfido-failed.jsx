import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const OnfidoFailed = () => (
    <IconMessageContent
        message={localize('Proof of identity verification failed')}
        text={localize(
            'We were unable to verify your document automatically. We will try to verify your document manually. Please check back in 1-3 days.'
        )}
        icon={<Icon icon='IcPoiFailed' size={128} />}
    />
);
