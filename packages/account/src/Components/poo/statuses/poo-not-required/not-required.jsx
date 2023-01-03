import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

export const POONotRequired = () => {
    return (
        <div className='proof-of-ownership__container'>
            <IconMessageContent
                message={localize("Your proof of ownership isn't required.")}
                text={localize(
                    'You are not required to submit proof of ownership at this time. We will inform you if proof of ownership is required in the future.'
                )}
                icon={<Icon icon='IcPooVerified' size={128} />}
            />
        </div>
    );
};
