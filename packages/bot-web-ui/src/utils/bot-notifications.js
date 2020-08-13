import React from 'react';
import { localize } from '@deriv/translations';
import { Button } from '@deriv/components';
import classNames from 'classnames';
import { platform_name, isMobile } from '@deriv/shared';
import '../assets/sass/notify-item.scss';

export const switch_account_notification = {
    key: 'bot_switch_account',
    header: localize('You have switched accounts.'),
    message: localize(
        'Our system will finish any DBot trades that are running, and DBot will not place any new trades.'
    ),
    type: 'warning',
    is_persistent: true,
};

export const journalError = onClick => {
    return {
        key: 'bot_error',
        header: localize('The bot encountered an error while running.'),
        message: (
            <Button
                className={classNames({
                    'notify__item-button': isMobile(),
                    'notify__item-button-journal': !isMobile(),
                })}
                onClick={onClick}
                has_effect
                type='button'
                text={localize('View error in Journal')}
                secondary
            />
        ),
        type: 'danger',
        platform: [platform_name.DBot],
        is_disposable: true,
    };
};
