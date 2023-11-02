import React from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const POOSubmitted = () => (
    <div className='proof-of-ownership__container'>
        <IconMessageContent
            icon={<Icon icon='IcPooSubmitted' size={128} />}
            message={<Localize i18n_default_text='We’ve received your proof of ownership.' />}
            text={
                <Localize i18n_default_text='We’ll review your documents and notify you of its status within 3 days.' />
            }
        />
    </div>
);

export default POOSubmitted;
