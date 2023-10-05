import { Localize } from '@deriv/translations';
import React from 'react';

export const GENERIC_ERROR_MESSAGE = (
    <Localize i18n_default_text='Sorry, an internal error occurred. Hit the above checkbox to try again.' />
);

export const DUPLICATE_ACCOUNT_ERROR_MESSAGE = (
    <Localize
        i18n_default_text='An account with these details already exists. Please make sure the details you entered are correct as only one real account is allowed per client. If this is a mistake, contact us via <0>live chat</0>.'
        components={[<span key={0} className='link link--orange' onClick={() => window.LC_API.open_chat_window()} />]}
    />
);
