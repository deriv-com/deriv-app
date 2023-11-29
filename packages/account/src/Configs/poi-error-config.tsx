import { Localize } from '@deriv/translations';
import React from 'react';

const handleOnClick = () => window.LC_API.open_chat_window();

export const GENERIC_ERROR_MESSAGE = (
    <Localize i18n_default_text='Sorry, an internal error occurred. Hit the above checkbox to try again.' />
);

export const DUPLICATE_ACCOUNT_ERROR_MESSAGE = (
    <Localize
        i18n_default_text='An account with these details already exists. Please make sure the details you entered are correct as only one real account is allowed per client. If this is a mistake, contact us via <0>live chat</0>.'
        components={[<span key={0} className='link link--orange' onClick={handleOnClick} onKeyDown={handleOnClick} />]}
    />
);

export const CLAIMED_DOCUMENT_ERROR_MESSAGE = (
    <Localize
        i18n_default_text="This document number was already submitted for a different account. It seems you have an account with us that doesn't need further verification. Please contact us via <0>live chat</0> if you need help."
        components={[<span key={0} className='link link--orange' onClick={handleOnClick} onKeyDown={handleOnClick} />]}
    />
);
