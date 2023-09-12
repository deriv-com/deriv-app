import React from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const POOVerified = () => (
    <div className='proof-of-ownership__container'>
        <IconMessageContent
            message={<Localize i18n_default_text='Proof of ownership verification passed.' />}
            icon={<Icon icon='IcPooVerified' size={128} />}
        />
    </div>
);

export default POOVerified;
