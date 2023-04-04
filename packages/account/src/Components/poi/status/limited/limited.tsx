import React from 'react';
import { Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const POILimited = () => (
    <IconMessageContent
        message={localize("You've reached the limit for uploading your documents.")}
        text={
            <Localize
                i18n_default_text='Please contact us via <0>live chat</0>.'
                components={[
                    <span key={0} className='link link--orange' onClick={() => window.LC_API.open_chat_window()} />,
                ]}
            />
        }
        icon={<Icon icon='IcPoiFailed' size={128} />}
    />
);
