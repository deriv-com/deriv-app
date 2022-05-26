import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

export const Expired = ({ onClick }) => (
    // need to be refactored

    <IconMessageContent
        message={localize('New proof of income is needed')}
        text={localize('Your documents for proof of income is expired. Please submit again.')}
        icon={<Icon icon='IcPoaUpload' size={128} />}
    >
        <Button onClick={onClick} has_effect primary>
            <Text className='dc-btn__text' size='xs' weight='bold' as='p'>
                {localize('Resubmit')}
            </Text>
        </Button>
    </IconMessageContent>
);
