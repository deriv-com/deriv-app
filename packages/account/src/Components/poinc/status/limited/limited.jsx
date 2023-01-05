import React from 'react';
import { Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const PoincLimited = () => (
    <IconMessageContent
        message={localize("You've reached the limit for uploading your documents")}
        text={<Localize i18n_default_text='Please check your email inbox for more details.' />}
        icon={<Icon icon='IcPoincUnverified' size={128} />}
    />
);
