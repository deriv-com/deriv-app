import { Button, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

export const POORejetced = ({ handleRequireSubmission }) => {
    return (
        <div className='proof-of-identity__container'>
            <IconMessageContent
                message={localize('Proof of ownership verification failed')}
                text={localize('We were unable to verify your proof of ownership.')}
                icon={<Icon icon='IcPooRejected' size={128} />}
            />
            <Button
                type='button'
                className='account-management__continue'
                onClick={handleRequireSubmission}
                large
                text={localize('Try again')}
                primary
            />
        </div>
    );
};
