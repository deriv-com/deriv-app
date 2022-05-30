import React from 'react';
import { Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const Unverified = () => {
    return (
        <IconMessageContent
            message={localize('Proof of income verification failed')}
            text={<Localize i18n_default_text='We were unable to verify your proof of income.' />}
            icon={<Icon icon='IcPoincFailed' size={128} />}
        />
    );
};
