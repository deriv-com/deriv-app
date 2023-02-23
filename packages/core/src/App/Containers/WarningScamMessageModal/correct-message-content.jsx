import React from 'react';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { website_domain } from '@deriv/shared';

const CorrectMessageContent = () => (
    <div className='correct-link__container'>
        <Icon icon='IcAccountTick' className='warning-scam-message__icon' size={14} />
        <div className='correct-link__message-container'>
            <Text>
                <Localize i18n_default_text='Only log in to your account at this secure link, never elsewhere.' />
            </Text>
            <div className='correct-link__link-container'>
                <Text>{`https://${website_domain}`}</Text>
            </div>
        </div>
    </div>
);

export default CorrectMessageContent;
