import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const OnfidoNotRequired = () => (
    <IconMessageContent
        message={localize('Proof of identity verification not required')}
        text={localize(
            'Your account does not need identity verification at this time. We will inform you if identity verification is required in the future.'
        )}
        icon={<Icon icon='IcPoiVerified' size={128} />}
    />
);
