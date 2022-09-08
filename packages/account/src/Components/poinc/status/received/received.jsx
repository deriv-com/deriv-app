import { Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

export const PoincReceived = () => {
    return (
        <IconMessageContent
            message={localize("We've received your proof of income")}
            text={
                <Localize i18n_default_text="We've review your documents and notify you its status whithin 3 days." />
            }
            icon={<Icon icon='IcPoincReceived' size={128} />}
        />
    );
};
