import { Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

export const Expired = () => (
    <IconMessageContent
        message={localize('New proof of identity document needed')}
        text={
            <Localize
                i18n_default_text='Kindly send a scan of a valid proof of identity to <0>support@deriv.com</0>'
                components={[
                    <a
                        key={0}
                        className='link link--orange'
                        rel='noopener noreferrer'
                        target='_blank'
                        href='mailto:support@deriv.com'
                    />,
                ]}
            />
        }
        icon={<Icon icon='IcPoiUpload' size={128} />}
    />
);
