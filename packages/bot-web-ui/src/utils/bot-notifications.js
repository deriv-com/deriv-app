import React from 'react';
import { localize } from '@deriv/translations';
import { Button } from '@deriv/components';

export const switch_account_notification = {
    key: 'bot_switch_account',
    header: localize('You have switched accounts.'),
    message: localize(
        'Our system will finish any DBot trades that are running, and DBot will not place any new trades.'
    ),
    type: 'warning',
    is_persistent: true,
};

export const journalError = clickFunction => {
    return {
        key: 'bot_error',
        header: localize('Error in Bot'),
        message: <Button onClick={clickFunction} has_effect type='button' text={localize('Go to Journal')} primary />,
        type: 'warning',
        is_persistent: true,
    };
};
