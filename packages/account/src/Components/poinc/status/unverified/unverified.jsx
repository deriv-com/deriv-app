import React from 'react';
import { Button, Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const PoincUnverified = ({ onReSubmit }) => {
    return (
        <IconMessageContent
            message={localize('Proof of income verification failed')}
            text={<Localize i18n_default_text='We were unable to verify your proof of income.' />}
            icon={<Icon icon='IcPoincFailed' size={128} />}
        >
            <Button
                type='button'
                className='account-management__continue'
                onClick={onReSubmit}
                large
                text={localize('Try Again')}
                primary
            />
        </IconMessageContent>
    );
};
