import React from 'react';
import { Icon } from '@deriv-lib/components';
import { Localize } from '@deriv-lib/translations';
import IconMessageContent from 'Components/icon-message-content';

export const PoincVerified = () => (
    <IconMessageContent
        message={<Localize i18n_default_text='Proof of income verification passed' />}
        icon={<Icon icon='IcPoincVerified' size={128} />}
    />
);
