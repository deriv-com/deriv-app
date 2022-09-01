import React from 'react';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';

const CorrectMessageModal = () => (
    <div className='correct-link__container'>
        <Icon icon='IcAccountTick' className='warning-scam-message__icon' />
        <div className='correct-link__message-container'>
            <Text size='s'>
                <Localize i18n_default_text='Only log in to your account at this secure link, never elsewhere.' />
            </Text>
            <div className='correct-link__link-container'>
                <Text size='s' color='black'>
                    https://app.deriv.com
                </Text>
            </div>
        </div>
    </div>
);

export default CorrectMessageModal;
