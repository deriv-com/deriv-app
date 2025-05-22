import React from 'react';
import { Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import IconMessageContent from '../../../icon-message-content';
import { Chat } from '@deriv/utils';

export const POILimited = () => (
    <IconMessageContent
        message={localize("You've reached the limit for uploading your documents.")}
        text={
            <Localize
                i18n_default_text='Please contact us via <0>live chat</0>.'
                components={[<span key={0} className='link link--orange' onClick={Chat.open} />]}
            />
        }
        icon={<Icon icon='IcPoiFailed' size={128} />}
    />
);
