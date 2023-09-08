import React from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const POONotRequired = () => (
    <div className='proof-of-ownership__container'>
        <IconMessageContent
            icon={<Icon icon='IcPooVerified' size={128} />}
            message={<Localize i18n_default_text="Your proof of ownership isn't required." />}
            text={
                <Localize i18n_default_text='You are not required to submit proof of ownership at this time. We will inform you if proof of ownership is required in the future.' />
            }
        />
    </div>
);

export default POONotRequired;
