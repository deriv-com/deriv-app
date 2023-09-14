import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

type TExpired = {
    onClick: () => void;
};

export const Expired = ({ onClick }: TExpired) => (
    <IconMessageContent
        message={localize('New proof of address is needed')}
        text={localize('Your documents for proof of address is expired. Please submit again.')}
        icon={<Icon icon='IcPoaUpload' size={128} />}
    >
        <Button onClick={onClick} has_effect primary>
            <Text className='dc-btn__text' size='xs' weight='bold' as='p'>
                {localize('Resubmit')}
            </Text>
        </Button>
    </IconMessageContent>
);
