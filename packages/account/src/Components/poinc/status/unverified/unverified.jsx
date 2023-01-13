import React from 'react';
import { Button, Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const PoincUnverified = ({ onReSubmit }) => (
    <IconMessageContent
        message={localize('Income verification failed')}
        text={
            <Localize
                i18n_default_text="We are unable to verify your income. <0 /> Please check the email we've sent you for further information."
                components={[<br key={0} />]}
            />
        }
        icon={<Icon icon='IcPoincFailed' size={128} />}
    >
        <Button
            type='button'
            className='account-management__continue'
            onClick={() => onReSubmit('none')}
            large
            text={localize('Try Again')}
            primary
        />
    </IconMessageContent>
);
