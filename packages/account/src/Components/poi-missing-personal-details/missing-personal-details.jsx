import React from 'react';
import { ButtonLink, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const GoToPersonalDetailsButton = () => (
    <ButtonLink to='/account/personal-details'>
        <p className='dc-btn__text'>{localize('Go to personal details')}</p>
    </ButtonLink>
);

export const MissingPersonalDetails = () => (
    <IconMessageContent
        message={localize('Your personal details are missing')}
        text={localize('Please complete your personal details before you verify your identity.')}
        icon={<Icon icon='IcAccountMissinglDetails' size={128} />}
    >
        <GoToPersonalDetailsButton />
    </IconMessageContent>
);
