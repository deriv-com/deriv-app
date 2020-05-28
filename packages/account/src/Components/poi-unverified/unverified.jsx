import { Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

export const Unverified = ({ is_description_enabled }) => (
    <IconMessageContent
        message={localize('We could not verify your proof of identity')}
        text={
            is_description_enabled ? (
                <Localize
                    i18n_default_text='Please check your email for details.'
                    // TODO: enable link to Help Center when POI help content is ready
                    // i18n_default_text='Please check your email for details. If you have any questions, please go to our <0>Help Centre</0>.'
                    // components={[
                    //     <a key={0} className='link link--orange' rel='noopener noreferrer' target='_blank' href='https://www.deriv.com/help-centre/' />,
                    // ]}
                />
            ) : null
        }
        icon={<Icon icon='IcPoiError' size={128} />}
    />
);
