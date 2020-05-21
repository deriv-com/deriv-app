import { Button, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

export const Expired = ({ onClick }) => (
    <IconMessageContent
        message={localize('New proof of address is needed')}
        text={localize('Your documents for proof of address is expired. Please submit again.')}
        icon={<Icon icon='IcPoaUpload' size={128} />}
    >
        <Button onClick={onClick} has_effect primary>
            <p className='dc-btn__text'>{localize('Resubmit')}</p>
        </Button>
    </IconMessageContent>
);
