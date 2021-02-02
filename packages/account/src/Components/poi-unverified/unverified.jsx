import { Icon, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

export const Unverified = ({ is_description_enabled }) => (
    <IconMessageContent
        message={localize('We could not verify your proof of identity')}
        text={
            is_description_enabled ? (
                <Localize
                    i18n_default_text='As a precaution, we have disabled trading, deposits and withdrawals for this account. If you have any questions, please go to our Help Center.<0>Help Centre</0>.'
                    components={[<StaticUrl key={0} className='link link--blue' href='/help-centre' />]}
                />
            ) : null
        }
        icon={<Icon icon='IcPoiError' size={128} />}
    />
);
