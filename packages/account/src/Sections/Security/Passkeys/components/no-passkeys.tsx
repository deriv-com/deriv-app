import React from 'react';
import { Localize } from '@deriv/translations';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

export const NoPasskeys = ({ onPrimaryButtonClick, onSecondaryButtonClick }: TPasskeysButtonOnClicks) => {
    return (
        <div className='passkeys'>
            <PasskeysStatusLayout
                description={<Localize i18n_default_text='Enhanced security is just a tap away.' />}
                icon='IcAddPasskey'
                title={<Localize i18n_default_text='Experience safer logins' />}
                onPrimaryButtonClick={onPrimaryButtonClick}
                onSecondaryButtonClick={onSecondaryButtonClick}
                primary_button_text={<Localize i18n_default_text='Create passkey' />}
                secondary_button_text={<Localize i18n_default_text='Learn more' />}
            />
        </div>
    );
};
