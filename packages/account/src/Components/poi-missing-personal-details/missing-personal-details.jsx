import React from 'react';
import { ButtonLink, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const GoToPersonalDetailsButton = ({ from, anchor }) => (
    <ButtonLink to={`/account/personal-details${from ? `?from=${from}` : ''}${anchor ? `#${anchor}` : ''}`}>
        <Text className='dc-btn__text' weight='bold' as='p'>
            {localize('Go to personal details')}
        </Text>
    </ButtonLink>
);

export const MissingPersonalDetails = ({ has_invalid_postal_code, from }) => {
    if (has_invalid_postal_code)
        return (
            <IconMessageContent
                message={localize('Your postal code is invalid')}
                text={localize('Please correct your postal code in personal details before you verify your identity.')}
                icon={<Icon icon='IcAccountMissingDetails' size={128} />}
            >
                <GoToPersonalDetailsButton anchor='address_postcode' from={from} />
            </IconMessageContent>
        );
    return (
        <IconMessageContent
            message={localize('Your personal details are missing')}
            text={localize('Please complete your personal details before you verify your identity.')}
            icon={<Icon icon='IcAccountMissingDetails' size={128} />}
        >
            <GoToPersonalDetailsButton />
        </IconMessageContent>
    );
};
