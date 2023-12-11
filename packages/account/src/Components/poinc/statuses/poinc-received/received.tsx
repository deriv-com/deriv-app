import React from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const PoincReceived = () => (
    <IconMessageContent
        message={<Localize i18n_default_text="We've received your proof of income" />}
        text={
            <Localize i18n_default_text="We'll review your documents and notify you of its status within 7 working days." />
        }
        icon={<Icon icon='IcPoincReceived' size={128} />}
    />
);
